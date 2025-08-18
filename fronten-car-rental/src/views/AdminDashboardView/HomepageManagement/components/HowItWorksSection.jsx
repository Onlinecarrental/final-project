import React, { useState, useRef } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash, Upload, Image as ImageIcon } from 'lucide-react';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dlinqw87p/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

// Add stepIcons constant at the top
const stepIcons = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  car: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z",
  key: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  drive: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
};

// Add IconSelector component
const IconSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-4 gap-2 mb-4">
    {Object.entries(stepIcons).map(([iconName, path]) => (
      <button
        key={iconName}
        onClick={() => onSelect(iconName)}
        className={`p-2 rounded flex flex-col items-center ${selected === iconName ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50 hover:bg-gray-100'
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={path}
          />
        </svg>
        <span className="text-xs mt-1 capitalize">{iconName}</span>
      </button>
    ))}
  </div>
);

// Add validation helpers at the top
const validateStep = (step) => {
  const errors = [];
  if (!step.title?.trim()) errors.push('Title is required');
  if (!step.description?.trim()) errors.push('Description is required');
  if (!step.iconType) errors.push('Icon selection is required');
  if (step.title?.length > 50) errors.push('Title must be less than 50 characters');
  if (step.description?.length > 200) errors.push('Description must be less than 200 characters');
  return errors;
};

// Add status message display component
const StatusMessage = ({ status }) => {
  if (!status.error && !status.success) return null;

  return (
    <div className={`p-4 rounded mb-4 ${status.error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
      }`}>
      {status.error || status.success}
    </div>
  );
};

// Move defaultData before any function that uses it
const defaultData = {
  header: {
    title: 'How It Works',
    description: 'Renting a car has never been easier with our simple steps'
  },
  steps: [],
  image: null
};
const uploadImageToCloudinary = async (file, sections, setSections, handleUpdate) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'car-rental/how-it-works');
  formData.append('tags', 'car-rental,how-it-works');

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
      const updatedSection = {
        ...(sections.howItWorks || {}),
        image: data.secure_url,
        imagePreview: data.secure_url
      };

      const result = await handleUpdate('howItWorks', updatedSection);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          howItWorks: updatedSection
        }));
        return { 
          success: true,
          message: 'Image uploaded successfully!',
          loading: false
        };
      } else {
        throw new Error('Failed to update section with new image');
      }
    } else {
      throw new Error('No secure URL returned from Cloudinary');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    return { 
      error: error.message || 'Failed to upload image. Please try again.',
      loading: false
    };
  }
};

export default function HowItWorksSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const [updateStatus, setUpdateStatus] = useState({ loading: false, error: null, success: null });
  const fileInputRef = useRef(null);
  
  // Initialize local data with sections data or defaults
  const [localData, setLocalData] = useState(() => ({
    header: sections?.howItWorks?.header || defaultData.header,
    steps: sections?.howItWorks?.steps || defaultData.steps,
    image: sections?.howItWorks?.image || null,
    imagePreview: sections?.howItWorks?.image || null
  }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUpdateStatus({ error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUpdateStatus({ error: 'Image size should be less than 5MB' });
      return;
    }

    setUpdateStatus({ loading: true, error: null, success: null });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'car-rental/how-it-works');
    formData.append('tags', 'car-rental,how-it-works');
    formData.append('api_key', 'dlinqw87p');
    formData.append('timestamp', (Date.now() / 1000) | 0);

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
        setLocalData(prev => ({
          ...prev,
          image: data.secure_url,
          imagePreview: data.secure_url
        }));
        setUpdateStatus({ success: 'Image uploaded successfully!', loading: false });
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
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const isEditingHeader = editingSection === 'howItWorks-header';

  const handleHeaderEdit = () => {
    setEditingSection('howItWorks-header');
  };

  // Update the handleHeaderSave function
  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      // Validate header
      if (!sectionData.header.title?.trim()) {
        throw new Error('Header title is required');
      }
      if (!sectionData.header.description?.trim()) {
        throw new Error('Header description is required');
      }
      if (sectionData.header.title.length > 100) {
        throw new Error('Header title must be less than 100 characters');
      }
      if (sectionData.header.description.length > 300) {
        throw new Error('Header description must be less than 300 characters');
      }

      const content = {
        header: {
          title: sectionData.header.title.trim(),
          description: sectionData.header.description.trim()
        },
        steps: sectionData.steps
      };

      const result = await handleUpdate('howItWorks', content);

      if (result.success) {
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Header updated successfully!'
        });
      } else {
        throw new Error(result.message || 'Failed to update header');
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUpdateStatus({ error: 'Please upload a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUpdateStatus({ error: 'Image must be less than 5MB' });
      return;
    }

    setUpdateStatus({ loading: true, error: null, success: null });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', 'dlinqw87p'); // Add your Cloudinary API key
    formData.append('timestamp', (Date.now() / 1000) | 0);
    formData.append('folder', 'car-rental/homepage');

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (data.secure_url) {
        // Update local state with the new image URL
        const updatedSections = {
          ...sections,
          howItWorks: {
            ...sections.howItWorks,
            image: data.secure_url
          }
        };

        // Update the backend with the new image URL
        const result = await handleUpdate('howItWorks', {
          ...sections.howItWorks,
          image: data.secure_url
        });

        if (result?.success) {
          setSections(updatedSections);
          setUpdateStatus({ 
            success: 'Image uploaded successfully!',
            loading: false
          });
        } else {
          throw new Error(result?.message || 'Failed to update image');
        }
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setUpdateStatus({ 
        error: error.message || 'Failed to upload image',
        loading: false
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Log the current image URL for debugging
  console.log('Current image URL:', sectionData.image);

  // Update the handleImageDelete function
  const handleImageDelete = async () => {
    try {
      if (!window.confirm('Are you sure you want to remove this image?')) {
        return;
      }

      setUpdateStatus({ loading: true, error: null, success: null });

      const content = {
        ...sectionData,
        image: null
      };

      const result = await handleUpdate('howItWorks', content);

      if (result.success) {
        // Update the local state to remove the image
        setSections(prev => ({
          ...prev,
          howItWorks: {
            ...prev.howItWorks,
            image: null
          }
        }));

        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Image removed successfully!'
        });
      } else {
        throw new Error(result.message || 'Failed to remove image');
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message || 'Failed to remove image',
        success: null
      });
    }
  };

  // Update the handleAddStep function
  const handleAddStep = () => {
    const currentSteps = sections.howItWorks?.steps || [];
    if (currentSteps.length >= 4) {
      setUpdateStatus({
        loading: false,
        error: 'Maximum 4 steps allowed',
        success: null
      });
      return;
    }

    const newStep = {
      title: 'New Step',
      description: 'Description for the new step',
      iconType: 'search' // Default icon
    };
    setSections({
      ...sections,
      howItWorks: {
        ...sectionData,
        steps: [...(sectionData.steps || []), newStep]
      }
    });
  };

  // Update the handleStepSave function
  const handleStepSave = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const steps = sections.howItWorks?.steps || [];
      const step = steps[index];

      // Validate the step
      const validationErrors = validateStep(step);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Validate total steps
      if (steps.length > 4) {
        throw new Error('Maximum 4 steps allowed');
      }

      const content = {
        header: sections.howItWorks?.header || defaultData.header,
        steps: steps.map(s => ({
          title: s.title.trim(),
          description: s.description.trim(),
          iconType: s.iconType
        }))
      };

      const result = await handleUpdate('howItWorks', content);

      if (result.success) {
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Step updated successfully!'
        });
      } else {
        throw new Error(result.message || 'Failed to update');
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const deleteStep = (index) => {
    const steps = sections.howItWorks?.steps || [];
    if (steps.length <= 1) {
      setUpdateStatus({
        loading: false,
        error: 'At least one step is required',
        success: null
      });
      return;
    }

    if (window.confirm('Are you sure you want to delete this step?')) {
      setSections(prev => ({
        ...prev,
        howItWorks: {
          ...prev.howItWorks,
          steps: steps.filter((_, i) => i !== index)
        }
      }));
    }
  };

  return (
    <div className="space-y-8">
      <StatusMessage status={updateStatus} />
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Section Header</h3>
          {!isEditingHeader && (
            <button
              onClick={handleHeaderEdit}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Edit2 size={18} />
              <span>Edit Header</span>
            </button>
          )}
        </div>

        {isEditingHeader ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={sectionData.header.title || ''}
                onChange={(e) => setSections({
                  ...sections,
                  howItWorks: {
                    ...sectionData,
                    header: { ...sectionData.header, title: e.target.value }
                  }
                })}
                className="w-full p-2 border rounded"
              />
              <div className="text-sm text-gray-500 mt-1">
                Title: {sectionData.header.title?.length || 0}/100 characters
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={sectionData.header.description || ''}
                onChange={(e) => setSections({
                  ...sections,
                  howItWorks: {
                    ...sectionData,
                    header: { ...sectionData.header, description: e.target.value }
                  }
                })}
                rows="3"
                className="w-full p-2 border rounded"
              />
              <div className="text-sm text-gray-500 mt-1">
                Description: {sectionData.header.description?.length || 0}/300 characters
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleHeaderSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Save size={18} />
                <span>Save</span>
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
            <h4 className="font-medium text-gray-700">Current Header:</h4>
            <p className="font-bold mt-2">{sectionData.header.title || 'No title set'}</p>
            <p className="text-gray-600 mt-1">{sectionData.header.description || 'No description set'}</p>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Section Image</h3>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={updateStatus.loading}
              className={`flex items-center gap-2 px-4 py-2 
                ${updateStatus.loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} 
                text-white rounded transition-colors`}
            >
              <Upload size={18} />
              <span>{updateStatus.loading ? 'Uploading...' : 'Upload Image'}</span>
            </button>
            {sections.howItWorks?.image && (
              <button
                onClick={handleImageDelete}
                disabled={updateStatus.loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 
                  text-white rounded transition-colors"
              >
                <Trash size={18} />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4">
          {sections.howItWorks?.image ? (
            <div className="relative group">
              <img
                src={getImageUrl(sections.howItWorks.image)}
                alt="How It Works"
                className="max-w-md rounded-lg shadow-md transition-transform 
                  duration-300 group-hover:scale-[1.02]"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.src = defaultData.image; // Fallback image
                }}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 
                transition-opacity duration-300 rounded-lg" />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 
              text-center max-w-md">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 font-medium">No image uploaded</p>
              <p className="text-sm text-gray-400 mt-1">
                Click upload to add an image
              </p>
            </div>
          )}
        </div>

        {/* Add debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-gray-500">
            Current image path: {sections.howItWorks?.image || 'None'}
          </div>
        )}

        {updateStatus.loading && (
          <div className="mt-4 flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent 
              rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>

      {/* Steps Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Steps</h3>
          <button
            onClick={handleAddStep}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Add Step</span>
          </button>
        </div>

        {(sectionData.steps || []).map((step, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            {editingSection === `howItWorks-${index}` ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Step Icon</label>
                  <IconSelector
                    selected={step.iconType || 'search'}
                    onSelect={(iconType) => {
                      const newSteps = [...sectionData.steps];
                      newSteps[index] = { ...step, iconType };
                      setSections({ ...sections, howItWorks: { ...sectionData, steps: newSteps } });
                    }}
                  />
                </div>
                <input
                  type="text"
                  value={step.title || ''}
                  onChange={(e) => {
                    const newSteps = [...sectionData.steps];
                    newSteps[index] = { ...step, title: e.target.value };
                    setSections({ ...sections, howItWorks: { ...sectionData, steps: newSteps } });
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Enter step title"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Title: {step.title?.length || 0}/50 characters
                </div>
                <textarea
                  value={step.description || ''}
                  onChange={(e) => {
                    const newSteps = [...sectionData.steps];
                    newSteps[index] = { ...step, description: e.target.value };
                    setSections({ ...sections, howItWorks: { ...sectionData, steps: newSteps } });
                  }}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Enter step description"
                />
                <div className="text-sm text-gray-500 mt-1">
                  Description: {step.description?.length || 0}/200 characters
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStepSave(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    <RotateCcw size={18} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={() => deleteStep(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={stepIcons[step.iconType] || stepIcons.search}
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium">{step.title || 'Untitled Step'}</h4>
                </div>
                <p className="text-gray-600 mb-4">{step.description || 'No description'}</p>
                <button
                  onClick={() => setEditingSection(`howItWorks-${index}`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-900"
                >
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}