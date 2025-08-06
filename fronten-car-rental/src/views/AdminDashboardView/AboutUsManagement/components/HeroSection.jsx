import React, { useRef } from 'react';
import { Edit2, Save, RotateCcw, Upload } from 'lucide-react';

export default function HeroSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  // Provide fallback to avoid undefined errors
  const hero = sections?.hero || {
    header: { title: '', description: '' },
    image: null
  };

  const imageInputRef = useRef(null);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('content', JSON.stringify({
        header: hero.header,
        image: hero.image
      }));
      if (hero.imageFile) formData.append('image', hero.imageFile);

      const result = await handleUpdate('hero', formData);
      if (result?.success) setEditingSection(null);
    } catch (error) {
      console.error('Failed to update hero section:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setSections(prev => ({
          ...prev,
          hero: {
            ...hero,
            image: e.target.result,
            imageFile: file
          }
        }));
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Hero Section</h3>
        {editingSection !== 'hero' && (
          <button
            onClick={() => setEditingSection('hero')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
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
              value={hero.header?.title || ''}
              onChange={(e) => {
                setSections(prev => ({
                  ...prev,
                  hero: {
                    ...hero,
                    header: {
                      ...hero.header,
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
              value={hero.header?.description || ''}
              onChange={(e) => {
                setSections(prev => ({
                  ...prev,
                  hero: {
                    ...hero,
                    header: {
                      ...hero.header,
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
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Upload size={18} />
                <span>Upload Image</span>
              </button>
            </div>
            {hero.image && (
              <img
                src={hero.image}
                alt="Hero"
                className="mt-2 max-w-xs rounded shadow"
              />
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
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
          <h4 className="font-medium">{hero.header?.title}</h4>
          <p className="text-gray-600 mt-1">{hero.header?.description}</p>
          {hero.image && (
            <div className="mt-4">
              <img
                src={hero.image}
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