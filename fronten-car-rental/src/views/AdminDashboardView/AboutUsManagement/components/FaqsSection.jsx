import React, { useState } from 'react';
import { Edit2, Save, RotateCcw, Plus, Trash } from 'lucide-react';

export default function FaqsSection({ sections, setSections, editingSection, setEditingSection, handleUpdate }) {
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: null
  });

  const defaultData = {
    header: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about our car rental services'
    },
    faqs: []
  };

  const sectionData = {
    header: {
      title: sections?.faqs?.header?.title ?? defaultData.header.title,
      description: sections?.faqs?.header?.description ?? defaultData.header.description
    },
    faqs: sections?.faqs?.faqs ?? []
  };

  const isEditingHeader = editingSection === 'faqs-header';

  const handleHeaderEdit = () => {
    setEditingSection('faqs-header');
  };

  const handleHeaderSave = async () => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      if (!sectionData.header.title.trim() || !sectionData.header.description.trim()) {
        throw new Error('Title and description are required');
      }

      const content = {
        header: {
          title: sectionData.header.title.trim(),
          description: sectionData.header.description.trim()
        },
        faqs: sectionData.faqs
      };

      const result = await handleUpdate('faqs', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          faqs: result.data.content
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

  const handleFaqSave = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const faq = sectionData.faqs[index];
      if (!faq.question?.trim() || !faq.answer?.trim()) {
        throw new Error('Question and answer are required');
      }

      const content = {
        header: sectionData.header,
        faqs: sectionData.faqs.map(f => ({
          ...f,
          question: f.question.trim(),
          answer: f.answer.trim()
        }))
      };

      const result = await handleUpdate('faqs', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          faqs: result.data.content
        }));
        setEditingSection(null);
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'FAQ updated successfully!'
        });
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setUpdateStatus({
        loading: false,
        error: error.message,
        success: null
      });
    }
  };

  const addNewFaq = () => {
    setSections(prev => ({
      ...prev,
      faqs: {
        ...prev.faqs,
        faqs: [
          ...(prev.faqs?.faqs || []),
          { question: '', answer: '' }
        ]
      }
    }));
    setEditingSection(`faq-${sectionData.faqs.length}`);
  };

  const deleteFaq = async (index) => {
    try {
      setUpdateStatus({ loading: true, error: null, success: null });

      const newFaqs = sectionData.faqs.filter((_, i) => i !== index);
      const content = {
        header: sectionData.header,
        faqs: newFaqs
      };

      const result = await handleUpdate('faqs', content);

      if (result?.success) {
        setSections(prev => ({
          ...prev,
          faqs: result.data.content
        }));
        setUpdateStatus({
          loading: false,
          error: null,
          success: 'FAQ deleted successfully!'
        });
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
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
          <h3 className="text-xl font-semibold">FAQs Header</h3>
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
                  faqs: {
                    ...sectionData,
                    header: { ...sectionData.header, title: e.target.value }
                  }
                })}
                className="w-full p-2 border rounded"
                placeholder="FAQs Section Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={sectionData.header.description}
                onChange={(e) => setSections({
                  ...sections,
                  faqs: {
                    ...sectionData,
                    header: { ...sectionData.header, description: e.target.value }
                  }
                })}
                rows="3"
                className="w-full p-2 border rounded"
                placeholder="FAQs Section Description"
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

      {/* FAQs List Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">FAQ Items</h3>
          <button
            onClick={addNewFaq}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-4">
          {sectionData.faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4">
              {editingSection === `faq-${index}` ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <input
                      type="text"
                      value={faq.question || ''}
                      onChange={(e) => {
                        const newFaqs = [...sectionData.faqs];
                        newFaqs[index] = { ...faq, question: e.target.value };
                        setSections({
                          ...sections,
                          faqs: {
                            ...sectionData,
                            faqs: newFaqs
                          }
                        });
                      }}
                      className="w-full p-2 border rounded"
                      placeholder="Enter question"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Answer</label>
                    <textarea
                      value={faq.answer || ''}
                      onChange={(e) => {
                        const newFaqs = [...sectionData.faqs];
                        newFaqs[index] = { ...faq, answer: e.target.value };
                        setSections({
                          ...sections,
                          faqs: {
                            ...sectionData,
                            faqs: newFaqs
                          }
                        });
                      }}
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Enter answer"
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFaqSave(index)}
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
                      onClick={() => deleteFaq(index)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium mb-2">{faq.question || 'Untitled Question'}</h4>
                  <p className="text-gray-600 mb-4">{faq.answer || 'No answer provided'}</p>
                  <button
                    onClick={() => setEditingSection(`faq-${index}`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
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