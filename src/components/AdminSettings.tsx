import { useState } from 'react';
import { Settings, Save } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Grandson Official Store',
    supportEmail: 'support@grandson.com',
    storeDescription: 'Official merchandise store for Grandson.',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem('storeSettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Store Settings</h3>
          <p className="text-sm text-gray-500">Manage your store's general configuration and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-700 transition-colors shadow-sm shadow-cyan-500/20 shrink-0 disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Settings size={18} className="text-gray-400" />
                General Information
              </h4>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Support Email</label>
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Store Description</label>
                <textarea
                  name="storeDescription"
                  value={settings.storeDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all font-medium text-gray-900 resize-none"
                />
              </div>
            </div>
          </div>


        </div>

          <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6">
            <h4 className="font-bold text-cyan-900 mb-4">💡 Settings Info</h4>
            <div className="space-y-3 text-sm text-cyan-800">
              <p>
                <strong>Store Name:</strong> Displayed in the shop header and emails
              </p>
              <p>
                <strong>Support Email:</strong> Used for customer inquiries
              </p>
              <p>
                <strong>Store Description:</strong> Information about your store
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}
