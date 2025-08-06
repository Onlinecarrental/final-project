import React, { useState, useRef } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash, Upload, Image, Shield, Award, ThumbsUp } from 'lucide-react';

// Add helper function for image URLs
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `/.netlify/functions/api${path}`;
};

// Add validation helper
const validateContent = (content) => {
  const errors = [];
  if (!content.title?.trim()) errors.push('Title is required');
  if (!content.description?.trim()) errors.push('Description is required');
  if (content.title?.length > 100) errors.push('Title must be less than 100 characters');
  if (content.description?.length > 300) errors.push('Description must be less than 300 characters');
  return errors;
};

const trustIcons = {
  'shield': <Shield className="w-6 h-6 text-blue-600" />,
  'award': <Award className="w-6 h-6 text-yellow-600" />,
  'thumbs-up': <ThumbsUp className="w-6 h-6 text-green-600" />
};

export default function TrustSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null
  });
  const fileInputRef = useRef(null);
  const bannerImageRef = useRef(null);

  // Add handleHeaderSave function
  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const validationErrors = validateContent(sections.trust.header);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const content = {
        header: {
          title: sections.trust.header.title.trim(),
          description: sections.trust.header.description.trim(),
          subtitle: sections.trust.header.subtitle.trim()
        },
        items: sections.trust.items
      };

      const result = await handleUpdate('trust', content);

      if (result?.success) {
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Header updated successfully!'
        });
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  // Add handleImageChange function
  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setUpdateStatus({
          error: 'Please upload an image file'
        });
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('content', JSON.stringify({
        ...sections.trust,
        section: 'trust'
      }));

      const result = await handleUpdate('trust', formData);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          trust: {
            ...prev.trust,
            image: result.data.content.image
          }
        }));
        setUpdateStatus({
          success: 'Image updated successfully!'
        });
      }
    } catch (error) {
      setUpdateStatus({
        error: error.message
      });
    }
  };

  const handleBannerImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setUpdateStatus({
          error: 'Please upload an image file'
        });
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('bannerImage', 'true');
      formData.append('content', JSON.stringify({
        ...sections.trust
      }));

      const result = await handleUpdate('trust', formData);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          trust: {
            ...prev.trust,
            bannerImage: result.data.content.bannerImage
          }
        }));
        setUpdateStatus({
          success: 'Banner image updated successfully!'
        });
      }
    } catch (error) {
      setUpdateStatus({
        error: error.message
      });
    }
  };

  const handleTrustSave = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const trust = sections.trust.items[index];
      if (!trust.title?.trim() || !trust.description?.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: sections.trust.header,
        items: sections.trust.items.map(item => ({
          ...item,
          title: item.title.trim(),
          description: item.description.trim(),
          icon: item.icon || 'shield'
        }))
      };

      const result = await handleUpdate('trust', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          trust: result.data.content
        }));
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Trust property updated successfully!'
        });
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const addNewTrust = () => {
    setSections(prev => ({
      ...prev,
      trust: {
        ...prev.trust,
        items: [
          ...(prev.trust.items || []),
          { title: '', description: '', icon: 'shield' }
        ]
      }
    }));
    setEditingSection(`trust-${sections.trust.items.length}`);
  };

  const deleteTrust = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const newItems = sections.trust.items.filter((_, i) => i !== index);
      const content = {
        header: sections.trust.header,
        items: newItems
      };

      const result = await handleUpdate('trust', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          trust: result.data.content
        }));
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Trust property deleted successfully!'
        });
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  return (
    <div className="mb-8">
      {/* Status Messages */}
      {updateStatus.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {updateStatus.error}
        </div>
      )}
      {updateStatus.success && (
        <div class="bg-green-50 text-green-600 p-4 rounded mb-4">
          {updateStatus.success}
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Header Section</h3>
          {editingSection !== 'header' && (
            <button
              onClick={() => setEditingSection('header')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Edit2 size={18} />
              <span>Edit Header</span>
            </button>
          )}
        </div>

        {editingSection === 'header' ? (
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={sections.trust.header?.title || ''}
                onChange={(e) => {
                  setSections(prev => ({
                    ...prev,
                    trust: {
                      ...prev.trust,
                      header: {
                        ...prev.trust.header,
                        title: e.target.value
                      }
                    }
                  }));
                }}
                className="w-full p-2 border rounded"
                placeholder="Enter title"
              />
            </div>

            {/* Subtitle Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                value={sections.trust.header?.subtitle || ''}
                onChange={(e) => {
                  setSections(prev => ({
                    ...prev,
                    trust: {
                      ...prev.trust,
                      header: {
                        ...prev.trust.header,
                        subtitle: e.target.value
                      }
                    }
                  }));
                }}
                className="w-full p-2 border rounded"
                placeholder="Enter subtitle"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-1">Section Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Upload size={18} />
                  <span>Upload Image</span>
                </button>
              </div>
              {sections.trust.image && (
                <div className="mt-2">
                  <img
                    src={getImageUrl(sections.trust.image)}
                    alt="Section"
                    className="max-w-xs rounded shadow"
                  />
                </div>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleHeaderSave}
                disabled={updateStatus.loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Save size={18} />
                <span>{updateStatus.loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={() => setEditingSection(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <RotateCcw size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="font-medium">{sections.trust.header?.title || 'No title set'}</h4>
            <p className="text-gray-600 mt-1">{sections.trust.header?.subtitle || 'No subtitle set'}</p>
            {sections.trust.image && (
              <img
                src={getImageUrl(sections.trust.image)}
                alt="Section"
                className="mt-2 max-w-xs rounded shadow"
              />
            )}
          </div>
        )}
      </div>

      {/* Banner Image Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Banner Image</h3>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="file"
              ref={bannerImageRef}
              onChange={handleBannerImageChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => bannerImageRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Upload size={18} />
                <span>Upload Banner Image</span>
              </button>
            </div>

            {sections.trust.bannerImage ? (
              <div className="mt-2 relative group">
                <img
                  src={getImageUrl(sections.trust.bannerImage)}
                  alt="Trust banner"
                  className="w-full h-auto mt-10 mb-10 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg" />
              </div>
            ) : (
              <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500">No banner image uploaded</p>
                <p className="text-sm text-gray-400 mt-1">Click upload to add a banner image</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Properties List */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Trust Properties</h3>
        <button
          onClick={addNewTrust}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus size={18} />
          <span>Add Trust Property</span>
        </button>
      </div>

      {/* Trust Items Grid */}
      <div className="grid gap-4">
        {sections.trust.items.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            {editingSection === `trust-${index}` ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...sections.trust.items];
                    newItems[index] = { ...newItems[index], title: e.target.value };
                    setSections(prev => ({
                      ...prev,
                      trust: {
                        ...prev.trust,
                        items: newItems
                      }
                    }));
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Title"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...sections.trust.items];
                    newItems[index] = { ...newItems[index], description: e.target.value };
                    setSections(prev => ({
                      ...prev,
                      trust: {
                        ...prev.trust,
                        items: newItems
                      }
                    }));
                  }}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Description"
                />
                <select
                  value={item.icon || 'shield'}
                  onChange={(e) => {
                    const newItems = [...sections.trust.items];
                    newItems[index] = { ...newItems[index], icon: e.target.value };
                    setSections(prev => ({
                      ...prev,
                      trust: {
                        ...prev.trust,
                        items: newItems
                      }
                    }));
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="shield">Shield</option>
                  <option value="award">Award</option>
                  <option value="thumbs-up">Thumbs Up</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTrustSave(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw size={18} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => deleteTrust(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded ml-auto hover:bg-red-700 transition-colors"
                  >
                    <Trash size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {trustIcons[item.icon || 'shield']}
                  <h4 className="font-medium">{item.title}</h4>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <button
                  onClick={() => setEditingSection(`trust-${index}`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Loading Overlay */}
      {updateStatus.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}