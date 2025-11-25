import React, { useState } from 'react';
import { Blog } from '../types';
import { Plus, Trash2, Edit, Eye, EyeOff, Calendar, FileText } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface BlogManagementProps {
  blogs: Blog[];
  onAdd: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (blog: Blog) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPublish: (id: string, published: boolean) => Promise<void>;
}

export const BlogManagement: React.FC<BlogManagementProps> = ({
  blogs,
  onAdd,
  onUpdate,
  onDelete,
  onPublish,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    author: 'Admin',
    published: false,
    seoTitle: '',
    seoDescription: '',
    tags: [] as string[],
    tagInput: '',
  });

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        featuredImage: blog.featuredImage || '',
        author: blog.author,
        published: blog.published,
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        tags: blog.tags,
        tagInput: '',
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        author: 'Admin',
        published: false,
        seoTitle: '',
        seoDescription: '',
        tags: [],
        tagInput: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      slug,
      content: formData.content,
      excerpt: formData.excerpt,
      featuredImage: formData.featuredImage || undefined,
      author: formData.author,
      publishedAt: formData.published ? now : '',
      published: formData.published,
      seoTitle: formData.seoTitle || undefined,
      seoDescription: formData.seoDescription || undefined,
      tags: formData.tags,
    };

    if (editingBlog) {
      await onUpdate({ ...editingBlog, ...blogData });
    } else {
      await onAdd(blogData);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-white">Blog Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gold-600 hover:bg-gold-500 text-black px-4 py-2 rounded font-bold flex items-center gap-2"
        >
          <Plus size={18} /> New Blog Post
        </button>
      </div>

      <div className="bg-onyx-900 rounded-lg border border-gray-800 overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mb-6">
              <FileText className="mx-auto text-gray-600" size={64} />
            </div>
            <p className="text-gray-300 text-lg mb-2 font-medium">No blog posts yet.</p>
            <p className="text-gray-500 text-sm mb-8">Get started by creating your first blog post.</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gold-600 hover:bg-gold-500 text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto transition-all duration-300 shadow-[0_0_20px_rgba(212,165,54,0.3)] hover:shadow-[0_0_30px_rgba(212,165,54,0.5)]"
            >
              <Plus size={20} /> Create Your First Blog Post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-black text-gray-200 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {blogs.map(blog => (
                <tr key={blog.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-white font-medium">{blog.title}</td>
                  <td className="px-6 py-4">{blog.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      blog.published ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-400'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onPublish(blog.id, !blog.published)}
                        className="text-gray-500 hover:text-gold-400"
                        title={blog.published ? 'Unpublish' : 'Publish'}
                      >
                        {blog.published ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleOpenModal(blog)}
                        className="text-gray-500 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(blog.id)}
                        className="text-gray-500 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-onyx-900 p-8 rounded-lg border border-gold-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-serif text-gold-400 mb-6">
              {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title *</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated from title"
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  placeholder="Short description for listing page"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none font-mono text-sm"
                  placeholder="HTML content or plain text"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Featured Image</label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={e => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Published
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.tagInput}
                    onChange={e => setFormData({ ...formData, tagInput: e.target.value })}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag and press Enter"
                    className="flex-1 bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 bg-gray-800 hover:bg-gray-700 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gold-900/20 text-gold-400 text-xs rounded border border-gold-900/50 flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gold-400 hover:text-gold-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">SEO Description</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={2}
                    className="w-full bg-black border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-600 text-black font-bold rounded hover:bg-gold-500"
                >
                  {editingBlog ? 'Update' : 'Create'} Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

