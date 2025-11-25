import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogs } = useStore();
  const blog = blogs.find(b => b.slug === slug && b.published);

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-serif text-gold-100 mb-4">Blog Post Not Found</h1>
        <Link to="/blog" className="text-gold-400 hover:text-gold-300">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Blog
      </Link>

      {blog.featuredImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-gold-100 mb-4">
          {blog.title}
        </h1>
        <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
          <span className="flex items-center gap-2">
            <User size={16} />
            {blog.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(blog.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gold-900/20 text-gold-400 text-xs rounded border border-gold-900/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="blog-content max-w-none text-gray-300"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="mt-12 pt-8 border-t border-gray-800">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft size={18} />
          View All Posts
        </Link>
      </div>
    </article>
  );
};

