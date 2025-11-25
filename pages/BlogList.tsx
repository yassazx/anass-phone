import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { blogs } = useStore();
  const publishedBlogs = blogs.filter(blog => blog.published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-gold-100 mb-4">Blog</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest tech news, product reviews, and industry insights.
        </p>
      </div>

      {publishedBlogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-serif text-lg">No blog posts available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedBlogs.map(blog => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="group bg-onyx-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gold-500/50 transition-all duration-300 flex flex-col"
            >
              {blog.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx-900/80 to-transparent"></div>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-serif text-gold-100 mb-3 group-hover:text-gold-400 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-gold-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};


