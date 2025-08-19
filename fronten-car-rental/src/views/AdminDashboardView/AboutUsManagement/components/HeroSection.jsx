import React, { useState, useRef } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash, Upload, Image } from 'lucide-react';

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

export default function HeroSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null
  });
  const fileInputRef = useRef(null);
  const bannerImageRef = useRef(null);

  const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dlinqw87p/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "upload_preset";

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUpdateStatus({
          error: 'Please upload an image file'
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.secure_url) {
          setSections(prev => ({
            ...prev,
            hero: {
              ...prev.hero,
              [imageType]: data.secure_url
            }
          }));

          // Update the backend
          const content = {
            ...sections.hero,
            [imageType]: data.secure_url
          };

          const result = await handleUpdate('hero', content);

          if (result?.success) {
            setUpdateStatus({
              success: `${imageType} updated successfully!`
            });
          } else {
            throw new Error('Failed to update backend');
          }
        } else {
          throw new Error('No secure URL in response');
        }
      } catch (err) {
        setUpdateStatus({
          error: `Image upload error: ${err.message}`
        });
      }
    }
  };

  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const validationErrors = validateContent(sections.hero.header);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const content = {
        header: {
          title: sections.hero.header.title.trim(),
          description: sections.hero.header.description.trim()
        },
        image: sections.hero.image,
        bannerImage: sections.hero.bannerImage
      };

      const result = await handleUpdate('hero', content);

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
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.secure_url) {
        const content = {
          ...sections.hero,
          bannerImage: data.secure_url
        };

        const result = await handleUpdate('hero', content);

        if (result?.success) {
          setSections(prev => ({
            ...prev,
            hero: {
              ...prev.hero,
              bannerImage: data.secure_url
            }
          }));
          setUpdateStatus({
            success: 'Banner image updated successfully!'
          });
        } else {
          throw new Error('Failed to update backend');
        }
      } else {
        throw new Error('No secure URL in response');
      }
    } catch (error) {
      setUpdateStatus({
        error: error.message
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Hero Section</h3>
        {editingSection !== 'hero' && (
          <button
            onClick={() => setEditingSection('hero')}
            className="flex items-center gap-2 text-black hover:text-blue-800"
          >
            <Edit2 size={18} />
            <span>Edit Hero</span>
          </button>
        )}
      </div>

      {editingSection === 'hero' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={sections.hero?.header?.title || ''}
              onChange={(e) => {
                setSections(prev => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    header: {
                      ...prev.hero?.header,
                      title: e.target.value
                    }
                  }
                }));
              }}
              className="w-full p-2 border rounded"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={sections.hero?.header?.description || ''}
              onChange={(e) => {
                setSections(prev => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    header: {
                      ...prev.hero?.header,
                      description: e.target.value
                    }
                  }
                }));
              }}
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageUpload(e, 'image')}
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
            {sections.hero?.image && (
              <img
                src={sections.hero.image}
                alt="Hero"
                className="mt-2 max-w-xs rounded shadow"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleHeaderSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Save size={18} />
              <span>Save Changes</span>
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
          <h4 className="font-medium">{sections.hero?.header?.title}</h4>
          <p className="text-gray-600 mt-1">{sections.hero?.header?.description}</p>
          {sections.hero?.image && (
            <div className="mt-4">
              <img
                src={sections.hero.image}
                alt="Hero"
                className="max-w-xs rounded shadow"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}