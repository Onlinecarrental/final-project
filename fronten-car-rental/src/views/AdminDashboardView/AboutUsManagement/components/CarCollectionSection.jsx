import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash, Upload } from 'lucide-react';

// Helper function to format image URLs
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `/.netlify/functions/api${path}`;
  if (path.startsWith('uploads/')) return `/.netlify/functions/api/${path}`;
  return path;
};

// Constants can stay outside
const defaultCategories = [
  { title: "Popular Car", path: "/popular-cars" },
  { title: "Luxury Car", path: "/luxury-cars" },
  { title: "Vintage Car", path: "/vintage-cars" },
  { title: "Family Car", path: "/family-cars" },
  { title: "Off-Road Car", path: "/offroad-cars" }
];

// Ensure default sections have all required fields to avoid undefined errors
const defaultDecoration = {
  title: "We Are More Than",
  description: [
    "Lorem pretium fermentum quam, sit amet cursus ante sollicitudin velen morbi consesua the miss sustion consation porttitor orci sit amet iaculis nisan.",
    "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito",
    "Lorem pretium fermentum quam sit amet cursus ante sollicitudin velen fermen morbinetion consesua the risus consequation the porttito"
  ],
  features: [
    { text: "24/7 Roadside Assistance" },
    { text: "Free Cancellation & Return" },
    { text: "Rent Now Pay When You Arrive" }
  ],
  image: null
};

// Default empty car object to avoid undefined errors
const defaultCar = {
  title: '',
  description: '',
  image: null,
  features: []
};

// Validation helpers can stay outside
const validateContent = (content) => {
  const errors = [];
  if (!content.title?.trim()) errors.push('Title is required');
  if (!content.description?.trim()) errors.push('Description is required');
  if (content.title?.length > 100) errors.push('Title must be less than 100 characters');
  if (content.description?.length > 500) errors.push('Description must be less than 500 characters');
  return errors;
};

const validateDecoration = (content) => {
  const errors = [];
  if (!content.title?.trim()) errors.push('Title is required');
  if (!content.description?.trim()) errors.push('Description is required');
  if (!content.features?.length) errors.push('At least one feature is required');
  return errors;
};

export default function CarCollectionSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  // Move all hooks inside component
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  // Initialize carCollection if it doesn't exist
  useEffect(() => {
    if (!sections.carCollection) {
      setSections(prev => ({
        ...prev,
        carCollection: {
          header: { title: '', description: '' },
          decoration: { ...defaultDecoration },
          cars: [],
          categories: defaultCategories
        }
      }));
    } else if (!sections.carCollection.decoration) {
      setSections(prev => ({
        ...prev,
        carCollection: {
          ...prev.carCollection,
          decoration: { ...defaultDecoration }
        }
      }));
    } else if (!sections.carCollection.decoration.features) {
      setSections(prev => ({
        ...prev,
        carCollection: {
          ...prev.carCollection,
          decoration: {
            ...prev.carCollection.decoration,
            features: []
          }
        }
      }));
    }
  }, [sections, setSections]);

  const fileInputRef = useRef(null);
  // const bannerSvgRef = useRef(null);
  // const luxuryCarRef = useRef(null);

  // Move all handlers inside component
  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const validationErrors = validateContent(sections.carCollection.header);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const content = {
        header: {
          title: sections.carCollection.header.title.trim(),
          description: sections.carCollection.header.description.trim()
        },
        decoration: sections.carCollection.decoration || defaultDecoration,
        cars: sections.carCollection.cars || []
      };

      const result = await handleUpdate('carCollection', content);

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

  const handleDecorationSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const decoration = sections.carCollection.decoration || defaultDecoration;
      const validationErrors = validateDecoration(decoration);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      const formData = new FormData();
      if (decoration.imageFile) {
        formData.append('image', decoration.imageFile);
        formData.append('decorationImage', 'true');
      }

      const content = {
        header: sections.carCollection.header || { title: '', description: '' },
        decoration: {
          title: decoration.title.trim(),
          description: decoration.description || '',
          features: decoration.features || [],
          image: decoration.image || null
        },
        categories: sections.carCollection.categories || defaultCategories,
        cars: sections.carCollection.cars || []
      };

      formData.append('content', JSON.stringify(content));

      const result = await handleUpdate('carCollection', formData);

      if (result?.success) {
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Decoration section updated successfully!'
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

  const handleLuxuryCarImageChange = async (e) => {
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
        ...sections.carCollection,
        luxuryCarImage: true
      }));

      const result = await handleUpdate('carCollection', formData);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          carCollection: {
            ...prev.carCollection,
            luxuryCarImage: result.data.content.luxuryCarImage
          }
        }));
        setUpdateStatus({
          success: 'Luxury car image updated successfully!'
        });
      }
    } catch (error) {
      setUpdateStatus({
        error: error.message || 'Failed to update image'
      });
    }
  };



  const addNewCar = () => {
    setSections(prev => ({
      ...prev,
      carCollection: {
        ...prev.carCollection,
        cars: [
          ...(prev.carCollection.cars || []),
          { ...defaultCar }
        ]
      }
    }));
    setEditingSection(`car-${sections.carCollection?.cars?.length || 0}`);
  };

  const handleCarSave = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const cars = sections.carCollection.cars || [];
      const car = cars[index] || defaultCar;

      if (!car.title?.trim() || !car.description?.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: sections.carCollection.header || { title: '', description: '' },
        decoration: sections.carCollection.decoration || defaultDecoration,
        cars: cars.map((item, i) => ({
          ...item,
          title: item.title.trim(),
          description: item.description.trim()
        }))
      };

      // Handle image upload if present
      if (car.imageFile) {
        const formData = new FormData();
        formData.append('image', car.imageFile);
        formData.append('carIndex', index.toString());
        formData.append('content', JSON.stringify(content));

        const result = await handleUpdate('carCollection', formData);

        if (result?.success) {
          setSections(prev => ({
            ...prev,
            carCollection: {
              ...result.data.content,
              cars: result.data.content.cars.map(c => ({
                ...c,
                imageFile: null
              }))
            }
          }));
          setEditingSection(null);
          setUpdateStatus({
            loading: false,
            error: null,
            success: 'Car updated successfully!'
          });
        }
      } else {
        const result = await handleUpdate('carCollection', content);

        if (result?.success) {
          setSections(prev => ({
            ...prev,
            carCollection: result.data.content
          }));
          setEditingSection(null);
          setUpdateStatus({
            loading: false,
            error: null,
            success: 'Car updated successfully!'
          });
        }
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const deleteCar = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const cars = sections.carCollection?.cars || [];
      const newCars = cars.filter((_, i) => i !== index);

      const content = {
        header: sections.carCollection.header || { title: '', description: '' },
        decoration: sections.carCollection.decoration || defaultDecoration,
        cars: newCars
      };

      const result = await handleUpdate('carCollection', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          carCollection: result.data.content
        }));
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Car deleted successfully!'
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

  const handleImageChange = (index, file) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setUpdateStatus({
          loading: false,
          error: 'Image size should be less than 5MB',
          success: null
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setUpdateStatus({
          loading: false,
          error: 'Please upload an image file',
          success: null
        });
        return;
      }

      setSections(prev => ({
        ...prev,
        carCollection: {
          ...prev.carCollection,
          cars: (prev.carCollection?.cars || []).map((car, i) =>
            i === index ? {
              ...car,
              imageFile: file,
              image: URL.createObjectURL(file)
            } : car
          )
        }
      }));
    }
  };

  // Add handleFeatureAdd function
  const handleFeatureAdd = () => {
    setSections(prev => {
      const currentDecoration = prev.carCollection?.decoration || { features: [] };
      const currentFeatures = currentDecoration.features || [];

      return {
        ...prev,
        carCollection: {
          ...prev.carCollection,
          decoration: {
            ...currentDecoration,
            features: [
              ...currentFeatures,
              { text: '' }
            ]
          }
        }
      };
    });
  };

  // Add handleFeatureDelete function
  const handleFeatureDelete = (index) => {
    setSections(prev => {
      const currentDecoration = prev.carCollection?.decoration || { features: [] };
      const currentFeatures = currentDecoration.features || [];

      return {
        ...prev,
        carCollection: {
          ...prev.carCollection,
          decoration: {
            ...currentDecoration,
            features: currentFeatures.filter((_, i) => i !== index)
          }
        }
      };
    });
  };

  // Get decoration safely
  const decoration = sections?.carCollection?.decoration || defaultDecoration;
  const features = decoration?.features || [];
  const cars = sections?.carCollection?.cars || [];

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
            carCollection: {
              ...prev.carCollection,
              [imageType]: data.secure_url
            }
          }));

          // Update the backend
          const content = {
            ...sections.carCollection,
            [imageType]: data.secure_url
          };

          const result = await handleUpdate('carCollection', content);

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

  const handleDecorationImageChange = async (e) => {
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
          ...sections.carCollection,
          decoration: {
            ...sections.carCollection.decoration,
            image: data.secure_url
          }
        };

        const result = await handleUpdate('carCollection', content);

        if (result?.success) {
          setSections(prev => ({
            ...prev,
            carCollection: {
              ...prev.carCollection,
              decoration: {
                ...prev.carCollection.decoration,
                image: data.secure_url
              }
            }
          }));
          setUpdateStatus({
            success: 'Decoration image updated successfully!'
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
          ...sections.carCollection,
          bannerImage: data.secure_url
        };

        const result = await handleUpdate('carCollection', content);

        if (result?.success) {
          setSections(prev => ({
            ...prev,
            carCollection: {
              ...prev.carCollection,
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
    <div className="mb-8">
      {updateStatus.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
          {updateStatus.error}
        </div>
      )}

      {updateStatus.success && (
        <div className="bg-green-50 text-green-600 p-4 rounded mb-4">
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
              className="flex items-center gap-2 text-black hover:text-blue-800"
            >
              <Edit2 size={18} />
              <span>Edit Header</span>
            </button>
          )}
        </div>

        {editingSection === 'header' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={sections.carCollection.header?.title || ''}
                onChange={(e) => {
                  setSections(prev => ({
                    ...prev,
                    carCollection: {
                      ...prev.carCollection,
                      header: {
                        ...prev.carCollection.header,
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
                value={sections.carCollection.header?.description || ''}
                onChange={(e) => {
                  setSections(prev => ({
                    ...prev,
                    carCollection: {
                      ...prev.carCollection,
                      header: {
                        ...prev.carCollection.header,
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
            <h4 className="font-medium">{sections.carCollection.header?.title || 'No title set'}</h4>
            <p className="text-gray-600 mt-1">{sections.carCollection.header?.description || 'No description set'}</p>
          </div>
        )}
      </div>

      {/* Decoration Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Decoration Section</h3>
          {editingSection !== 'decoration' && (
            <button
              onClick={() => setEditingSection('decoration')}
              className="flex items-center gap-2 text-black hover:text-blue-800"
            >
              <Edit2 size={18} />
              <span>Edit Decoration</span>
            </button>
          )}
        </div>

        {editingSection === 'decoration' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={decoration.title || ''}
                onChange={(e) => {
                  setSections(prev => ({
                    ...prev,
                    carCollection: {
                      ...prev.carCollection,
                      decoration: {
                        ...prev.carCollection.decoration,
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
                value={decoration.description || ''}
                onChange={(e) => {
                  setSections(prev => ({
                    ...prev,
                    carCollection: {
                      ...prev.carCollection,
                      decoration: {
                        ...prev.carCollection.decoration,
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

            {/* Features Section */}
            <div>
              <label className="block text-sm font-medium mb-1">Features</label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature.text || ''}
                      onChange={(e) => {
                        setSections(prev => {
                          const decorationObj = prev.carCollection?.decoration || { features: [] };
                          const featuresArr = decorationObj.features || [];

                          return {
                            ...prev,
                            carCollection: {
                              ...prev.carCollection,
                              decoration: {
                                ...decorationObj,
                                features: featuresArr.map((f, i) =>
                                  i === index ? { ...f, text: e.target.value } : f
                                )
                              }
                            }
                          };
                        });
                      }}
                      className="flex-1 p-2 border rounded"
                      placeholder="Feature text"
                    />
                    <button
                      onClick={() => handleFeatureDelete(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleFeatureAdd}
                  className="flex items-center gap-2 text-black hover:text-blue-800"
                >
                  <Plus size={18} />
                  <span>Add Feature</span>
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Section Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleDecorationImageChange(e)}
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
              {decoration.image && (
                <div className="mt-2">
                  <img
                    src={getImageUrl(decoration.image)}
                    alt="Decoration"
                    className="max-w-xs rounded shadow"
                  />
                </div>
              )}
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleDecorationSave}
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
            <h4 className="font-medium">{decoration.title || 'No title set'}</h4>
            <p className="text-gray-600 mt-1">{decoration.description || 'No description set'}</p>
            {features.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Features:</h5>
                <ul className="list-disc pl-5">
                  {features.map((feature, index) => (
                    <li key={index}>{feature.text || ''}</li>
                  ))}
                </ul>
              </div>
            )}
            {decoration.image && (
              <img
                src={getImageUrl(decoration.image)}
                alt="Decoration"
                className="mt-4 max-w-xs rounded shadow"
              />
            )}
          </div>
        )}
      </div>

      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Car Collection</h3>
  
      </div> */}

      <div className="grid gap-4">
        {cars.map((car, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            {editingSection === `car-${index}` ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={car.title || ''}
                  onChange={(e) => {
                    setSections(prev => ({
                      ...prev,
                      carCollection: {
                        ...prev.carCollection,
                        cars: (prev.carCollection?.cars || []).map((c, i) =>
                          i === index ? { ...c, title: e.target.value } : c
                        )
                      }
                    }));
                  }}
                  className="w-full p-2 border rounded"
                  placeholder="Car Name"
                />
                <textarea
                  value={car.description || ''}
                  onChange={(e) => {
                    setSections(prev => ({
                      ...prev,
                      carCollection: {
                        ...prev.carCollection,
                        cars: (prev.carCollection?.cars || []).map((c, i) =>
                          i === index ? { ...c, description: e.target.value } : c
                        )
                      }
                    }));
                  }}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Car Description"
                />
                <input
                  type="file"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
                {car.image && (
                  <div className="relative">
                    <img
                      src={getImageUrl(car.image)}
                      alt={car.title || 'Car preview'}
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCarSave(index)}
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
                    onClick={() => deleteCar(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded ml-auto hover:bg-red-700 transition-colors"
                  >
                    <Trash size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-medium mb-2">{car.title || ''}</h4>
                <p className="text-gray-600 mb-4">{car.description || ''}</p>
                {car.image && (
                  <img
                    src={getImageUrl(car.image)}
                    alt={car.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <button
                  onClick={() => setEditingSection(`car-${index}`)}
                  className="flex items-center gap-2 text-black hover:text-blue-700 transition-colors"
                >
                  <Edit2 size={18} />
                  <span>Edit</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {updateStatus.loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}