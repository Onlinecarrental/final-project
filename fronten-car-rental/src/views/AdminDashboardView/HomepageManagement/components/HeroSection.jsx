import { useRef, useState } from 'react';
import { Edit2, Save, RotateCcw, Upload } from 'lucide-react';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dlinqw87p/image/upload";
// ⚠️ Change this to your own unsigned preset created in Cloudinary dashboard
const CLOUDINARY_UPLOAD_PRESET = "car_rental_preset";

export default function HeroSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const isEditing = editingSection === 'hero';
  const heroData = sections.hero || {};
  const fileInputRef = useRef(null);
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null, success: null });

  const handleEdit = () => {
    setEditingSection('hero');
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

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
        image: heroData.image
      };

      const result = await handleUpdate('hero', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            ...content
          }
        }));

        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          success: 'Hero section updated successfully!'
        });
      } else {
        throw new Error(result?.message || 'Failed to update hero section');
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      setUpdateStatus({
        loading: false,
        error: error.message || 'An error occurred while saving'
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUpdateStatus({ error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUpdateStatus({ error: 'Image size should be less than 5MB' });
      return;
    }

    setUpdateStatus({ loading: true, error: null });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'car-rental/homepage');
    formData.append('tags', 'car-rental,hero');

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      if (data.secure_url) {
        // Update local state with the new image URL
        const updatedHero = {
          ...sections.hero,
          image: data.secure_url,
          imagePreview: data.secure_url
        };

        // Save to backend
        const result = await handleUpdate('hero', updatedHero);

        if (result?.success) {
          setSections(prev => ({
            ...prev,
            hero: updatedHero
          }));
          setUpdateStatus({
            success: 'Image uploaded successfully!',
            loading: false
          });
        } else {
          throw new Error('Failed to update hero section with new image');
        }
      } else {
        throw new Error('Failed to get secure URL from Cloudinary');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setUpdateStatus({
        error: error.message || 'Failed to upload image. Please try again.',
        loading: false
      });
    } finally {
      if (e.target) e.target.value = '';
    }
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
                onChange={handleImageUpload}
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
                    src={heroData.imagePreview || heroData.image}
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
                  onError={(e) => {
                    console.error('Failed to load image:', e.target.src);
                    e.target.style.display = 'none';
                  }}
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
