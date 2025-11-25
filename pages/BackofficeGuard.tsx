import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Backoffice } from './Backoffice';

const PASSWORD_FALLBACK = 'anass-backoffice-2025';
const STORAGE_KEY = 'anass_phone_backoffice_auth';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPTS_KEY = 'anass_phone_backoffice_attempts';
const LOCKOUT_KEY = 'anass_phone_backoffice_lockout';

const getStaticPassword = () =>
  import.meta.env.VITE_BACKOFFICE_PASSWORD?.trim() || PASSWORD_FALLBACK;

export const BackofficeGuard: React.FC = () => {
  const requiredPassword = useMemo(getStaticPassword, []);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkLockout = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil, 10);
      const now = Date.now();
      if (now < lockoutTime) {
        const timeLeft = Math.ceil((lockoutTime - now) / 1000 / 60);
        setIsLockedOut(true);
        setLockoutTimeLeft(timeLeft);
        return true;
      } else {
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
        setIsLockedOut(false);
        setLockoutTimeLeft(0);
      }
    }
    return false;
  }, []);

  const resetActivityTimeout = useCallback(() => {
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    if (isAuthorized) {
      activityTimeoutRef.current = setTimeout(() => {
        handleLogout();
        setError('Session expired due to inactivity. Please log in again.');
      }, SESSION_TIMEOUT);
    }
  }, [isAuthorized]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthorized(false);
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for existing lockout
    checkLockout();

    // Check for valid session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const sessionData = JSON.parse(stored);
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge < SESSION_TIMEOUT) {
          setIsAuthorized(true);
          resetActivityTimeout();
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Legacy format, remove it
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHasCheckedStorage(true);
  }, [checkLockout, resetActivityTimeout]);

  // Update lockout timer
  useEffect(() => {
    if (isLockedOut) {
      timeoutRef.current = setInterval(() => {
        if (!checkLockout()) {
          setIsLockedOut(false);
          setLockoutTimeLeft(0);
          if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
          }
        } else {
          const lockoutUntil = localStorage.getItem(LOCKOUT_KEY);
          if (lockoutUntil) {
            const timeLeft = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000 / 60);
            setLockoutTimeLeft(timeLeft);
          }
        }
      }, 60000); // Update every minute
    }

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [isLockedOut, checkLockout]);

  // Track user activity
  useEffect(() => {
    if (isAuthorized) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const handleActivity = () => resetActivityTimeout();

      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      resetActivityTimeout();

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }
  }, [isAuthorized, resetActivityTimeout]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (checkLockout()) {
      setError(`Too many failed attempts. Please try again in ${lockoutTimeLeft} minute(s).`);
      return;
    }

    if (inputPassword === requiredPassword) {
      // Reset attempts on success
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      
      // Store session with timestamp
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        authenticated: true,
        timestamp: Date.now()
      }));
      
      setIsAuthorized(true);
      setError('');
      setInputPassword('');
      setIsLockedOut(false);
      resetActivityTimeout();
    } else {
      // Increment failed attempts
      const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
      localStorage.setItem(ATTEMPTS_KEY, attempts.toString());

      if (attempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem(LOCKOUT_KEY, lockoutUntil.toString());
        setIsLockedOut(true);
        setLockoutTimeLeft(Math.ceil(LOCKOUT_DURATION / 1000 / 60));
        setError(`Too many failed attempts. Account locked for ${Math.ceil(LOCKOUT_DURATION / 1000 / 60)} minutes.`);
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`);
      }
      setInputPassword('');
    }
  };

  if (!hasCheckedStorage) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        Checking access...
      </div>
    );
  }

  if (isAuthorized) {
    return (
      <>
        <div className="bg-onyx-900 border-b border-gray-800 px-6 py-3 text-right text-sm text-gray-400">
          <span className="mr-4">Backoffice unlocked</span>
          <button className="text-gold-400 hover:text-gold-200" onClick={handleLogout}>
            Lock Backoffice
          </button>
        </div>
        <Backoffice />
      </>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-onyx-950 px-4">
      <div className="w-full max-w-md bg-onyx-900 border border-gold-900/40 rounded-xl p-8 shadow-2xl shadow-black/30">
        <h2 className="text-3xl font-serif text-gold-100 mb-2 text-center">Backoffice</h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Enter the administrator password to continue.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={inputPassword}
              onChange={e => {
                setInputPassword(e.target.value);
                setError('');
              }}
              className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:border-gold-500 outline-none"
              placeholder="••••••••••"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isLockedOut}
            className={`w-full font-semibold py-3 rounded transition-colors duration-200 ${
              isLockedOut
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gold-600 hover:bg-gold-500 text-black'
            }`}
          >
            {isLockedOut ? `Locked (${lockoutTimeLeft}m)` : 'Unlock'}
          </button>
        </form>

        <p className="text-[12px] text-gray-500 mt-6 text-center">
          Tip: set `VITE_BACKOFFICE_PASSWORD` in your environment to override the default password.
        </p>
      </div>
    </div>
  );
};

