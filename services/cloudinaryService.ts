export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

const getCloudinaryConfig = (): CloudinaryConfig | null => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return null;
  }

  return { cloudName, uploadPreset };
};

export const uploadImageToCloudinary = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const config = getCloudinaryConfig();
    if (!config) {
      reject(new Error('Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your environment variables.'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('cloud_name', config.cloudName);

    fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error('Upload succeeded but no URL returned'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};





