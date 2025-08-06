import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

// Add these utility functions at the top of your component
const validateFileSize = (file, maxSize) => {
  if (file.size > maxSize) {
    throw new Error(`File size should be less than ${maxSize / (1024 * 1024)}MB`);
  }
  return true;
};

const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Only ${allowedTypes.join(', ')} files are allowed`);
  }
  return true;
};

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: null,
    imagePreview: null,
    author: {
      name: '',
      image: null,
      imagePreview: null
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const validateForm = (data) => {
    const errors = [];

    if (!data.title.trim()) {
      errors.push('Blog title is required');
    } else if (data.title.length < 5) {
      errors.push('Blog title must be at least 5 characters long');
    }

    if (!data.category) {
      errors.push('Please select a category');
    }

    if (!data.content.trim()) {
      errors.push('Blog content is required');
    } else if (data.content.length < 100) {
      errors.push('Blog content must be at least 100 characters long');
    }

    if (!data.author.name.trim()) {
      errors.push('Author name is required');
    }

    if (!isEditing && !data.image) {
      errors.push('Blog cover image is required');
    }

    return errors;
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (5MB max)
      validateFileSize(file, 5 * 1024 * 1024);

      // Validate file type
      validateFileType(file, ['image/jpeg', 'image/png', 'image/gif']);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ 
        ...prev, 
        image: file,
        imagePreview: previewUrl // Add preview URL
      }));
    } catch (error) {
      e.target.value = ''; // Reset input
      alert(error.message);
    }
  };

  const handleAuthorImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (2MB max)
      validateFileSize(file, 2 * 1024 * 1024);

      // Validate file type
      validateFileType(file, ['image/jpeg', 'image/png']);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        author: {
          ...prev.author,
          image: file,
          imagePreview: previewUrl // Add preview URL
        }
      }));
    } catch (error) {
      e.target.value = ''; // Reset input
      alert(error.message);
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validationErrors = validateForm(formData);
      if (validationErrors.length > 0) {
        const errorMessage = 'Please fix the following errors:\n\n• ' + 
          validationErrors.join('\n• ');
        alert(errorMessage);
        return;
      }

      // Create FormData object
      const data = new FormData();

      // Append basic blog data
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('content', formData.content);

      // Create and append excerpt
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formData.content;
      const excerpt = tempDiv.textContent.substring(0, 150) + '...';
      data.append('excerpt', excerpt);

      // Handle blog image
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      // Handle author data
      data.append('author', JSON.stringify({
        name: formData.author.name.trim()
      }));

      // Handle author image separately
      if (formData.author.image instanceof File) {
        data.append('authorImage', formData.author.image);
      }

      // Set up request config
      const config = {
        headers: {
          'Accept': 'application/json',
          // Let axios set the Content-Type header automatically for FormData
        }
      };

      // Make the API request
      const url = isEditing 
        ? `http://localhost:5000/api/blogs/${currentBlog._id}`
        : 'http://localhost:5000/api/blogs';

      const response = await axios({
        method: isEditing ? 'put' : 'post',
        url,
        data,
        config
      });

      if (response.data.success) {
        alert(isEditing ? 'Blog updated successfully!' : 'Blog created successfully!');
        resetForm();
        await fetchBlogs();
      }
    } catch (error) {
      console.error('Blog submission error:', error);
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to save blog';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      if (response.data.success) {
        setBlogs(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert(error.response?.data?.message || 'Failed to fetch blogs');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      if (response.data.success) {
        setCategories(response.data.data.map(cat => cat.name));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: null,
      imagePreview: null,
      author: {
        name: blog.authorName || '',
        image: null,
        imagePreview: null
      }
    });
    setIsEditing(true);
    setShowEditor(true);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${blogId}`);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert(error.response?.data?.message || 'Failed to delete blog');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      content: '',
      image: null,
      imagePreview: null,
      author: {
        name: '',
        image: null,
        imagePreview: null
      }
    });
    setCurrentBlog(null);
    setIsEditing(false);
    setShowEditor(false);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${categoryToDelete}" category?`)) {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup preview URLs when component unmounts
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      if (formData.author.imagePreview) {
        URL.revokeObjectURL(formData.author.imagePreview);
      }
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Blog
        </button>
      </div>

      {showEditor && (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Add New Blog</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="border p-2 rounded"
                  required
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Author Name</label>
                    <input
                      type="text"
                      placeholder="Author Name"
                      value={formData.author.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        author: { ...prev.author, name: e.target.value }
                      }))}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Author Image</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleAuthorImageChange}
                      className="border p-2 rounded w-full"
                    />
                    {formData.author.imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={formData.author.imagePreview} 
                          alt="Author preview" 
                          className="w-24 h-24 object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Blog Cover Image</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                    className="border p-2 rounded w-full"
                    required={!isEditing}
                  />
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={formData.imagePreview} 
                        alt="Blog cover preview" 
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Blog Content</label>
                  <Editor
                    apiKey='3o5n0gl714tqk3nk5ua2hx7cu51hu7lcvehwn7otso8niq1y'
                    init={{
                      height: 500,
                      plugins: [
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 
                        'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 
                        'wordcount', 'checklist', 'mediaembed', 'casechange', 'formatpainter'
                      ],
                      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat'
                    }}
                    value={formData.content}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{isEditing ? 'Updating...' : 'Publishing...'}</span>
                    </>
                  ) : (
                    isEditing ? 'Update Blog' : 'Publish Blog'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <div className="grid gap-4">
        {blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{blog.title}</h3>
              <p className="text-sm text-gray-500">{blog.category}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}