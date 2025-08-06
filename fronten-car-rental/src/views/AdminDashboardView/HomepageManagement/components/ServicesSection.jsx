import React, { useState, useEffect } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash, AlertCircle } from 'lucide-react';

// Add serviceIcons constant at the top
const serviceIcons = {
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  speed: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  support: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
};

// Add IconSelector component at the top after the serviceIcons constant
const IconSelector = ({ selected, onSelect }) => (
  <div className="grid grid-cols-3 gap-2 mb-4">
    {Object.entries(serviceIcons).map(([iconName, path]) => (
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

export default function ServicesSection({ sections = {}, setSections, editingSection, setEditingSection, handleUpdate }) {
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null
  });
  const [initialized, setInitialized] = useState(false);

  const defaultServices = {
    header: {
      title: 'Our Services & Benefits',
      description: 'To make renting easy and hassle-free, we provide a variety of services and advantages'
    },
    items: []
  };

  // Initialize services data if not present
  useEffect(() => {
    if (!sections.services && !initialized) {
      setSections(prev => ({
        ...prev,
        services: defaultServices
      }));
      setInitialized(true);
    }
  }, [sections, setSections, initialized]);

  // Safe access to services data with fallbacks
  const servicesData = sections?.services || defaultServices;
  const items = Array.isArray(servicesData?.items) ? servicesData.items : [];
  const isEditingHeader = editingSection === 'services-header';

  const handleHeaderEdit = () => {
    setEditingSection('services-header');
  };

  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null });

      // Validate header content
      if (!servicesData.header?.title?.trim() || !servicesData.header?.description?.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: servicesData.header,
        items: items
      };

      const formData = new FormData();
      formData.append('content', JSON.stringify(content));

      const result = await handleUpdate('services', formData);

      if (result.success) {
        // Update local state with the saved data
        setSections(prev => ({
          ...prev,
          services: {
            header: content.header,
            items: content.items
          }
        }));
        setEditingSection(null);
        setUpdateStatus({ loading: false, error: null });
      } else {
        throw new Error(result.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error saving services header:', error);
      setUpdateStatus({ loading: false, error: error.message });
    }
  };

  // Update the handleServiceSave function with better error handling
  const handleServiceSave = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const service = sections.services?.items?.[index];
      if (!service) throw new Error('Service not found');

      if (!service.title?.trim() || !service.description?.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: sections.services.header,
        items: sections.services.items.map((item, i) => ({
          title: item.title.trim(),
          description: item.description.trim(),
          iconType: item.iconType || 'shield'
        }))
      };

      const result = await handleUpdate('services', content);

      if (result.success) {
        setSections(prev => ({
          ...prev,
          services: content
        }));
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Service updated successfully!'
        });
      } else {
        throw new Error(result.message || 'Failed to update');
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        error: error.message
      });
    }
  };

  // Add these console logs in key functions for debugging
  const handleServiceSaveOld = async (index) => {
    try {
      console.log('Saving service:', index, sections.services.items[index]); // Debug log
      setUpdateStatus({ loading: true, error: null, success: null });

      const service = sections.services.items[index];
      if (!service?.title?.trim() || !service?.description?.trim()) {
        throw new Error('Title and description are required');
      }

      const formData = new FormData();
      const content = {
        header: sections.services.header,
        items: sections.services.items.map((item, i) => ({
          title: item.title,
          description: item.description,
          iconPath: item.iconPath,
        }))
      };

      console.log('Sending content:', content); // Debug log
      formData.append('content', JSON.stringify(content));

      if (service.icon instanceof File) {
        console.log('Adding icon file:', service.icon.name); // Debug log
        formData.append('icon', service.icon);
      }

      const result = await handleUpdate('services', formData);
      console.log('Save result:', result); // Debug log

      if (result?.success) {
        // Add visual feedback
        setUpdateStatus({
          loading: false,
          error: null,
          success: `Service "${service.title}" saved successfully!`
        });

        // Show success notification
        alert(`Service "${service.title}" has been saved!`);

        setTimeout(() => {
          setUpdateStatus(prev => ({ ...prev, success: null }));
        }, 3000);
      }
    } catch (error) {
      console.error('Save error:', error); // Debug log
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  // Add this function to check data structure
  const validateServicesData = () => {
    console.log('Current sections:', sections);
    console.log('Services data:', sections.services);
    console.log('Items:', sections.services?.items);

    if (!sections.services) {
      console.error('No services data found');
      return false;
    }

    if (!Array.isArray(sections.services.items)) {
      console.error('Items is not an array:', sections.services.items);
      return false;
    }

    return true;
  };

  // Add this to your useEffect
  useEffect(() => {
    validateServicesData();
  }, [sections]);

  // Add this useEffect to log state changes
  useEffect(() => {
    console.log('Services state updated:', sections.services);
  }, [sections.services]);

  // Update handleHeaderChange to handle undefined services
  const handleHeaderChange = (field, value) => {
    setSections(prevSections => ({

      ...prevSections,
      services: {
        ...servicesData,
        header: {
          ...(servicesData?.header || {}),
          [field]: value
        }
      }
    }));
  };

  // Update the addNewService function
  const addNewService = () => {
    if (items.length >= 3) {
      setUpdateStatus({
        loading: false,
        error: 'Maximum 3 services allowed',
        success: null
      });
      return;
    }

    const newService = {
      title: '',
      description: '',
      iconType: 'shield'
    };

    setSections(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [...(prev.services?.items || []), newService]
      }
    }));

    const newIndex = sections.services?.items?.length || 0;
    setEditingSection(`service-${newIndex}`);
  };

  const deleteService = (index) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const newServices = items.filter((_, i) => i !== index);
      setSections({
        ...sections,
        services: {
          ...servicesData,
          items: newServices
        }
      });
    }
  };

  // Replace the existing handleImageChange function with this corrected version
  const handleImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUpdateStatus({
        loading: false,
        error: 'Please upload an image file',
        success: null
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUpdateStatus({
        loading: false,
        error: 'File size should be less than 5MB',
        success: null
      });
      return;
    }

    // Update service with new image
    setSections(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: prev.services.items.map((item, i) =>
          i === index ? { ...item, icon: file } : item
        )
      }
    }));
  };

  // Add loading indicator component
  const LoadingIndicator = () => (
    <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
      Loading...
    </div>
  );

  // Add success indicator component
  const SuccessIndicator = ({ message }) => (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      {message}
    </div>
  );

  // Add error indicator component
  const ErrorIndicator = ({ message }) => (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
      Error: {message}
    </div>
  );

  return (
    <div className="mb-8">
      {updateStatus.loading && <LoadingIndicator />}
      {updateStatus.success && <SuccessIndicator message={updateStatus.success} />}
      {updateStatus.error && <ErrorIndicator message={updateStatus.error} />}

      {updateStatus.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={18} />
          <span>{updateStatus.error}</span>
        </div>
      )}

      {updateStatus.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <Save size={18} />
          <span>{updateStatus.success}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Section Header</h3>
          {!isEditingHeader ? (
            <button
              onClick={handleHeaderEdit}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Edit2 size={18} />
              <span>Edit Header</span>
            </button>
          ) : null}
        </div>

        {isEditingHeader ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={servicesData.header?.title || ''}
                onChange={(e) => handleHeaderChange('title', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={servicesData.header?.description || ''}
                onChange={(e) => handleHeaderChange('description', e.target.value)}
                rows="3"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleHeaderSave}
                disabled={updateStatus.loading}
                className={`flex items-center gap-2 px-4 py-2 ${updateStatus.loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  } text-white rounded`}
              >
                <Save size={18} />
                <span>{updateStatus.loading ? 'Saving...' : 'Save Changes'}</span>
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
            <p className="font-bold mt-2">{servicesData.header?.title || 'No title set'}</p>
            <p className="text-gray-600 mt-1">{servicesData.header?.description || 'No description set'}</p>
          </div>
        )}
      </div>

      {/* Services Items Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Services & Benefits</h3>
        <button
          onClick={addNewService}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            {editingSection === `service-${index}` ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={service.title || ''}
                    onChange={(e) => {
                      const newServices = [...items];
                      newServices[index] = {
                        ...service,
                        title: e.target.value
                      };
                      setSections({ ...sections, services: { ...servicesData, items: newServices } });
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="Enter service title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={service.description || ''}
                    onChange={(e) => {
                      const newServices = [...items];
                      newServices[index] = {
                        ...service,
                        description: e.target.value
                      };
                      setSections({ ...sections, services: { ...servicesData, items: newServices } });
                    }}
                    rows="3"
                    className="w-full p-2 border rounded"
                    placeholder="Enter service description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Icon</label>
                  <IconSelector
                    selected={service.iconType || 'shield'}
                    onSelect={(iconType) => {
                      const newServices = [...items];
                      newServices[index] = {
                        ...service,
                        iconType
                      };
                      setSections({ ...sections, services: { ...servicesData, items: newServices } });
                    }}
                  />
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleServiceSave(index)}
                      disabled={updateStatus.loading}
                      className={`flex items-center gap-2 px-4 py-2 ${updateStatus.loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        } text-white rounded`}
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
                  <button
                    onClick={() => deleteService(index)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 mb-2">
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
                        d={serviceIcons[service.iconType] || serviceIcons.shield}
                      />
                    </svg>
                  </div>
                  <h4 className="font-medium">{service.title}</h4>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button
                  onClick={() => setEditingSection(`service-${index}`)}
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