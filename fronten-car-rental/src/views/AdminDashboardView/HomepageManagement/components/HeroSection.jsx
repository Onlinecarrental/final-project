import { useRef, useState } from 'react';
import { Edit2, Save, RotateCcw, Upload } from 'lucide-react';
import axios from 'axios';

// Add this helper function after imports
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `/.netlify/functions/api/${path.replace(/^\/+/, '')}`;
};

export default function HeroSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const isEditing = editingSection === 'hero';
  const heroData = sections.hero || {};
  const fileInputRef = useRef(null);
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null });

  const handleEdit = () => {
    setEditingSection('hero');
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  // Update the handleSave function
  const handleSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null });

      // Validate content
      if (!heroData.title?.trim() || !heroData.description?.trim()) {
        throw new Error('Title and description are required');
      }

      // Prepare the content object
      const content = {
        title: heroData.title.trim(),
        description: heroData.description.trim(),
        image: heroData.image // Keep existing image if not updating
      };

      let result;

      if (heroData.imageFile) {
        const formData = new FormData();
        formData.append('image', heroData.imageFile);
        formData.append('content', JSON.stringify(content));
        result = await handleUpdate('hero', formData);
      } else {
        result = await handleUpdate('hero', content);
      }

      if (result?.success) {
        // Update local state with new image path
        setSections(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            ...result.data.content,
            imageFile: null,
            imagePreview: null
          }
        }));
        
        setEditingSection(null);
        alert('Hero section updated successfully!');
      } else {
        throw new Error(result?.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      setUpdateStatus({ loading: false, error: error.message });
    }
  };

  // Add a new function to validate SSL connection
  const validateConnection = async () => {
    try {
      await axios.get('/.netlify/functions/api/api/health');
      return true;
    } catch (error) {
      console.error('Connection validation failed:', error);
      return false;
    }
  };

  // Fix the template literal in the alert
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.onloadend = () => {
      setSections(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          imageFile: file,
          imagePreview: reader.result
        }
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
      <div className="bg-white rounded-lg shadow p-4">
        {updateStatus.error && (
          <div className="text-red-600 mb-2">Error: {updateStatus.error}</div>
        )}
        {updateStatus.loading && (
          <div className="text-blue-600 mb-2">Updating...</div>
        )}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={heroData.title || ''}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...heroData, title: e.target.value }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={heroData.description || ''}
                onChange={(e) => setSections({
                  ...sections,
                  hero: { ...heroData, description: e.target.value }
                })}
                rows="3"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  <Upload size={18} />
                  <span>Upload Image</span>
                </button>
                {(heroData.imagePreview || heroData.image) && (
                  <img
                    src={heroData.imagePreview || getImageUrl(heroData.image)}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded"
                    onError={(e) => {
                      console.error('Failed to load image:', e.target.src);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={updateStatus.loading}
                className={`flex items-center gap-2 px-4 py-2 ${updateStatus.loading ? 'bg-gray-400' : 'bg-green-600'
                  } text-white rounded`}
              >
                <Save size={18} />
                <span>{updateStatus.loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded"
              >
                <RotateCcw size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Current Content:</h3>
              <p className="font-bold mt-2">{heroData.title}</p>
              <p className="text-gray-600 mt-1">{heroData.description}</p>
              {(heroData.image || heroData.imagePreview) && (
                <img
                  src={heroData.imagePreview || heroData.image}
                  alt="Hero"
                  className="mt-2 max-w-xs rounded"
                />
              )}
            </div>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-blue-600"
            >
              <Edit2 size={18} />
              <span>Edit Section</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}