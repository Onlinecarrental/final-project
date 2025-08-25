import { useEffect, useState, useMemo } from 'react';
import { db } from '../../../firebase/config';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Search, Users, User, CheckCircle, XCircle, Eye, Trash2, MoreVertical } from 'lucide-react';

// Skeleton Loader Component
const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="animate-pulse space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        {[...Array(cols)].map((_, j) => (
          <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    ))}
  </div>
);

// Status Badge Component
const StatusBadge = ({ approved }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${approved
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
    }`}>
    {approved ? 'Approved' : 'Pending'}
  </span>
);

export default function UserManagement() {
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('agents');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [agentsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, 'agent')),
        getDocs(collection(db, 'users')),
      ]);

      const agentRows = agentsSnap.docs.map((d) => ({ id: d.id, ...d.data(), role: 'agent' }));
      const userRows = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAgents(agentRows);
      setCustomers(userRows);
    } catch (e) {
      console.error('UserManagement fetch error', e);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveAgent = async (id) => {
    setUpdatingId(id);
    setError('');
    try {
      console.log('Approving agent id:', id);
      await updateDoc(doc(db, 'agent', id), { approved: true });
      setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, approved: true } : a)));
      console.log('Agent approved successfully:', id);
    } catch (e) {
      console.error('Approve agent failed', e);
      const msg = e?.message || 'Approval failed.';
      const code = e?.code ? ` (${e.code})` : '';
      setError(`${msg}${code}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = (type, data) => {
    setSelected({ type, data });
    setDetailsOpen(true);
    setEditMode(false);
    setEditedData({ ...data });
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelected(null);
    setEditMode(false);
    setEditedData(null);
  };

  const excludedKeys = useMemo(() => new Set(['id', 'approved', 'password', 'uid']), []);

  const handleFieldChange = (key, val) => {
    setEditedData((prev) => ({ ...prev, [key]: val }));
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    setError('');
    try {
      const col = type === 'agent' ? 'agent' : 'users';
      await deleteDoc(doc(db, col, id));

      // Update local state
      if (type === 'agent') {
        setAgents(prev => prev.filter(a => a.id !== id));
      } else {
        setCustomers(prev => prev.filter(c => c.id !== id));
      }

      // Close details if open for deleted user
      if (selected?.data?.id === id) {
        closeDetails();
      }
    } catch (e) {
      console.error('Delete failed', e);
      setError(`Delete failed: ${e.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const saveEdits = async () => {
    if (!selected || !editedData) return;
    const docId = selected.data.id;
    const col = selected.type === 'agent' ? 'agent' : 'users';
    const payload = { ...editedData };
    // Ensure excluded keys are not saved if changed
    excludedKeys.forEach((k) => delete payload[k]);
    setSaving(true);
    setError('');
    try {
      await updateDoc(doc(db, col, docId), payload);
      // Update local state tables
      if (selected.type === 'agent') {
        setAgents((prev) => prev.map((a) => (a.id === docId ? { ...a, ...payload } : a)));
      } else {
        setCustomers((prev) => prev.map((c) => (c.id === docId ? { ...c, ...payload } : c)));
      }
      // Update selected snapshot
      setSelected((prev) => ({ ...prev, data: { ...prev.data, ...payload } }));
      setEditMode(false);
    } catch (e) {
      console.error('Save edits failed', e);
      const msg = e?.message || 'Save failed.';
      const code = e?.code ? ` (${e.code})` : '';
      setError(`${msg}${code}`);
    } finally {
      setSaving(false);
    }
  };

  // Build display-ready key/value list dynamically, excluding boilerplate keys
  const detailsList = useMemo(() => {
    if (!selected) return [];
    const raw = selected.data || {};
    const exclude = new Set(['id', 'role', 'approved', 'password', 'uid']);
    const entries = Object.entries(raw)
      .filter(([k, _]) => !exclude.has(k))
      .map(([k, v]) => {
        // Firestore Timestamp support
        let value = v;
        if (v && typeof v === 'object' && v.seconds && v.nanoseconds) {
          try {
            value = new Date(v.seconds * 1000).toLocaleString();
          } catch (_) { }
        }
        if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
        if (Array.isArray(value)) value = value.join(', ');
        return [k, String(value ?? '-')];
      });
    // Keep common signup fields near top if present
    const priority = ['name', 'fullName', 'email', 'phone', 'company', 'companyName', 'city', 'address', 'cnic', 'createdAt'];
    entries.sort((a, b) => (priority.indexOf(a[0]) === -1 ? 999 : priority.indexOf(a[0])) - (priority.indexOf(b[0]) === -1 ? 999 : priority.indexOf(b[0])));
    return entries;
  }, [selected]);

  return (
    <div className="p-4 font-jakarta">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1  gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Agents</h2>
            <span className="text-sm text-gray-500">{agents.length} total</span>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading agents...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{a.name || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{a.email || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{a.phone || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className={`px-2 py-2 rounded text-xs ${a.approved ? 'bg-gray text-black' : 'bg-yellow-400 text-black'}`}>
                          {a.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{a.role || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetails('agent', a)}
                            className="px-3 py-1 text-sm bg-Blue text-white rounded hover:bg-gray"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleDelete(a.id, 'agent')}
                            disabled={deletingId === a.id}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-Blue disabled:opacity-50"
                          >
                            {deletingId === a.id ? 'Deleting...' : 'Delete'}
                          </button>
                          {!a.approved ? (
                            <button
                              onClick={() => approveAgent(a.id)}
                              disabled={updatingId === a.id}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-60"
                            >
                              {updatingId === a.id ? 'Approving...' : 'Approve'}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Customers</h2>
            <span className="text-sm text-gray-500">{customers.length} total</span>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading customers...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-2 whitespace-nowrap">{u.name || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{u.email || '-'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{u.role || 'customer'}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDetails('customer', u)}
                            className="px-3 py-1 text-sm bg-Blue text-white rounded hover:bg-gray-200"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, 'customer')}
                            disabled={deletingId === u.id}
                            className="px-3 py-1 text-sm  bg-red-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {deletingId === u.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Slide-over Sidebar */}
      {detailsOpen && selected && (
        <div className="fixed inset-0 z-50 flex" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div className="flex-1 bg-black/50" onClick={closeDetails} />
          {/* Panel */}
          <div className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selected.type === 'agent' ? 'Agent Details' : 'Customer Details'}
                </h3>
                <p className="text-xs text-gray-500">ID: {selected.data.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded">Edit</button>
                ) : (
                  <>
                    <button
                      onClick={saveEdits}
                      disabled={saving}
                      className={`px-3 py-1.5 text-sm rounded text-white ${saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => { setEditMode(false); setEditedData({ ...selected.data }); }} className="px-3 py-1.5 text-sm bg-gray-200 rounded">Cancel</button>
                  </>
                )}
                <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700 text-xl leading-none">✕</button>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-auto p-5 space-y-5">
              {!editMode ? (
                <>
                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DetailItem label="Name" value={selected.data.name || selected.data.fullName || '-'} />
                      <DetailItem label="Email" value={selected.data.email || '-'} />
                      <DetailItem label="Phone" value={selected.data.phone || '-'} />
                      {selected.type === 'agent' && (
                        <DetailItem label="Approved" value={selected.data.approved ? 'Yes' : 'No'} />
                      )}
                      {/* Explicit Front/Back image/URL fields if present */}
                      {selected?.data?.frontUrl && (
                        <DetailItem label="Front Image/URL" value={selected.data.frontUrl} />
                      )}
                      {selected?.data?.backUrl && (
                        <DetailItem label="Back Image/URL" value={selected.data.backUrl} />
                      )}
                      {selected?.data?.frontImage && (
                        <DetailItem label="Front Image/URL" value={selected.data.frontImage} />
                      )}
                      {selected?.data?.backImage && (
                        <DetailItem label="Back Image/URL" value={selected.data.backImage} />
                      )}
                      {selected?.data?.cnicFront && (
                        <DetailItem label="CNIC Front" value={selected.data.cnicFront} />
                      )}
                      {selected?.data?.cnicBack && (
                        <DetailItem label="CNIC Back" value={selected.data.cnicBack} />
                      )}
                    </div>
                  </section>
                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">All Signup Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {detailsList.length === 0 ? (
                        <div className="text-gray-500">No additional fields</div>
                      ) : (
                        detailsList.map(([k, v]) => (
                          <DetailItem key={k} label={k} value={v} />
                        ))
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Edit Fields</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(editedData || {})
                        .filter(([k]) => !excludedKeys.has(k))
                        .map(([k, v]) => (
                          <div key={k} className="flex flex-col border rounded p-2 bg-gray-50">
                            <label className="text-xs font-semibold text-gray-500">{k}</label>
                            {typeof v === 'boolean' ? (
                              <input
                                type="checkbox"
                                checked={Boolean(v)}
                                onChange={(e) => handleFieldChange(k, e.target.checked)}
                                className="mt-1 h-4 w-4"
                              />
                            ) : typeof v === 'number' ? (
                              <input
                                type="number"
                                defaultValue={v}
                                onBlur={(e) => handleFieldChange(k, Number(e.target.value))}
                                className="mt-1 border rounded px-2 py-1"
                              />
                            ) : (
                              <input
                                type="text"
                                defaultValue={v ?? ''}
                                onBlur={(e) => handleFieldChange(k, e.target.value)}
                                className="mt-1 border rounded px-2 py-1"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </section>
                </>
              )}
            </div>
            {/* Footer */}
            <div className="px-5 py-3 border-t bg-gray-50 flex justify-end">
              {!editMode ? (
                <button onClick={closeDetails} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
              ) : (
                <>
                  <button
                    onClick={saveEdits}
                    disabled={saving}
                    className={`px-4 py-2 text-white rounded ${saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col border rounded p-2 bg-gray-50">
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      {renderValue(value)}
    </div>
  );
}

// Helpers to render URLs/images nicely
function isProbablyUrl(v) {
  if (typeof v !== 'string') return false;
  return /^https?:\/\//i.test(v) || v.startsWith('data:image');
}

function isImageUrl(v) {
  if (typeof v !== 'string') return false;
  const lower = v.split('?')[0].toLowerCase();
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.webp') ||
    lower.endsWith('.bmp') ||
    lower.endsWith('.svg') ||
    v.startsWith('data:image')
  );
}

function renderValue(v) {
  // Arrays of URLs or values
  if (Array.isArray(v)) {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {v.map((item, idx) => (
          <div key={idx} className="max-w-full">
            {isProbablyUrl(item) ? (
              isImageUrl(item) ? (
                <a href={item} target="_blank" rel="noreferrer" className="inline-block">
                  <img
                    src={item}
                    alt={`image-${idx}`}
                    className="h-24 w-24 object-cover rounded border"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </a>
              ) : (
                <a href={item} target="_blank" rel="noreferrer" className="text-blue-600 break-all">
                  {item}
                </a>
              )
            ) : (
              <span className="text-sm text-gray-900 break-words">{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Single value
  if (isProbablyUrl(v)) {
    return isImageUrl(v) ? (
      <a href={v} target="_blank" rel="noreferrer" className="mt-1 inline-block">
        <img
          src={v}
          alt="preview"
          className="h-28 w-28 object-cover rounded border"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </a>
    ) : (
      <a href={v} target="_blank" rel="noreferrer" className="text-blue-600 break-all mt-1">
        {v}
      </a>
    );
  }

  // Object with url property
  if (v && typeof v === 'object') {
    const url = v.url || v.href;
    if (isProbablyUrl(url)) {
      return isImageUrl(url) ? (
        <a href={url} target="_blank" rel="noreferrer" className="mt-1 inline-block">
          <img
            src={url}
            alt="preview"
            className="h-28 w-28 object-cover rounded border"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </a>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 break-all mt-1">
          {url}
        </a>
      );
    }
  }

  // Fallback text
  return <span className="text-sm text-gray-900 break-words mt-1">{String(v ?? '-')}</span>;
}
