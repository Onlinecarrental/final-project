import React, { useState } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash, Shield, Clock, Trophy, Star, ThumbsUp, Award } from 'lucide-react';

const reasonIcons = {
  'shield-check': <Shield className="w-6 h-6 text-blue-600" />,
  'clock': <Clock className="w-6 h-6 text-green-600" />,
  'trophy': <Trophy className="w-6 h-6 text-yellow-600" />,
  'star': <Star className="w-6 h-6 text-purple-600" />,
  'thumbs-up': <ThumbsUp className="w-6 h-6 text-indigo-600" />,
  'award': <Award className="w-6 h-6 text-red-600" />
};

export default function WhyChooseSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  const defaultData = {
    header: {
      title: 'Why Choose Us',
      description: 'We offer the best experience with our rental deals'
    },
    reasons: []
  };

  const sectionData = {
    header: {
      title: sections?.whyChoose?.header?.title ?? defaultData.header.title,
      description: sections?.whyChoose?.header?.description ?? defaultData.header.description
    },
    reasons: sections?.whyChoose?.reasons ?? []
  };

  const isEditingHeader = editingSection === 'whyChoose-header';

  const handleHeaderEdit = () => {
    setEditingSection('whyChoose-header');
  };

  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null });

      if (!sectionData.header.title.trim() || !sectionData.header.description.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: {
          title: sectionData.header.title.trim(),
          description: sectionData.header.description.trim()
        },
        reasons: sectionData.reasons
      };

      const result = await handleUpdate('whyChoose', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          whyChoose: result.data.content
        }));
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Header updated successfully!'
        });
      } else {
        throw new Error(result?.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Error saving header:', error);
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const getIconComponent = (iconName) => {
    return reasonIcons[iconName] || <Shield className="w-6 h-6 text-blue-600" />;
  };

  const addNewReason = () => {
    const newReason = {
      title: '',
      description: '',
      icon: 'shield-check'
    };

    setSections(prev => ({
      ...prev,
      whyChoose: {
        ...prev.whyChoose,
        reasons: [...prev.whyChoose.reasons, newReason]
      }
    }));
    setEditingSection(`whyChoose-${sectionData.reasons.length}`);
  };

  const updateReason = (index, field, value) => {
    const newReasons = [...sectionData.reasons];
    newReasons[index] = { ...newReasons[index], [field]: value };
    setSections({
      ...sections,
      whyChoose: {
        ...sectionData,
        reasons: newReasons
      }
    });
  };

  const handleReasonSave = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const reason = sectionData.reasons[index];
      if (!reason.title.trim() || !reason.description.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: sectionData.header,
        reasons: sectionData.reasons.map((r, i) => ({
          ...r,
          title: r.title.trim(),
          description: r.description.trim(),
          icon: r.icon || 'shield-check'
        }))
      };

      const result = await handleUpdate('whyChoose', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          whyChoose: result.data.content
        }));
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: `Reason "${reason.title}" updated successfully!`
        });
      }
    } catch (error) {
      console.error('Error saving reason:', error);
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const deleteReason = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null });

      const newReasons = sectionData.reasons.filter((_, i) => i !== index);
      const content = {
        header: sectionData.header,
        reasons: newReasons
      };

      const result = await handleUpdate('whyChoose', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          whyChoose: result.data.content
        }));
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'Reason deleted successfully!'
        });
      }
    } catch (error) {
      console.error('Error deleting reason:', error);
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  return (
    <div className="space-y-8">
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
                value={sectionData.header.title}
                onChange={(e) => setSections({
                  ...sections,
                  whyChoose: {
                    ...sectionData,
                    header: { ...sectionData.header, title: e.target.value }
                  }
                })}
                className="w-full p-2 border rounded"
                placeholder="Section Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={sectionData.header.description}
                onChange={(e) => setSections({
                  ...sections,
                  whyChoose: {
                    ...sectionData,
                    header: { ...sectionData.header, description: e.target.value }
                  }
                })}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="Section Description"
              />
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
            <p className="font-bold mt-2">{sectionData.header.title}</p>
            <p className="text-gray-600 mt-1">{sectionData.header.description}</p>
          </div>
        )}
      </div>

      {/* Reasons Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Reasons</h3>
          <button 
            onClick={addNewReason}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Add Reason</span>
          </button>
        </div>

        <div className="grid gap-4">
          {sectionData.reasons.map((reason, index) => (
            <div key={index} className="border rounded-lg p-4">
              {editingSection === `whyChoose-${index}` ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={reason.title}
                      onChange={(e) => updateReason(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="Reason Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={reason.description}
                      onChange={(e) => updateReason(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Reason Description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon</label>
                    <select
                      value={reason.icon}
                      onChange={(e) => updateReason(index, 'icon', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="shield-check">Shield</option>
                      <option value="clock">Clock</option>
                      <option value="trophy">Trophy</option>
                      <option value="star">Star</option>
                      <option value="thumbs-up">Thumbs Up</option>
                      <option value="award">Award</option>
                    </select>
                    <div className="mt-2">
                      {getIconComponent(reason.icon)}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleReasonSave(index)}
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
                    <button 
                      onClick={() => deleteReason(index)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {getIconComponent(reason.icon)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium mb-2">{reason.title || 'Untitled Reason'}</h4>
                    <p className="text-gray-600 mb-4">{reason.description || 'No description'}</p>
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => setEditingSection(`whyChoose-${index}`)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={18} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => deleteReason(index)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800"
                      >
                        <Trash size={18} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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