import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus } from 'lucide-react';

const ROOMS = ['Gaming Room', 'Bedroom', 'Hallway', 'Bathroom'];
const LOCATIONS = {
  'Gaming Room': ['Main Wall (Above Desk)', 'Side Wall (Near Door)'],
  'Bedroom': ['Above Bed', 'Side Wall'],
  'Hallway': ['Corridor Left', 'Corridor Right'],
  'Bathroom': ['Mirror Adjacent', 'Wall Opposite'],
};

export function AddPosterModal({ onClose, onAdd }: { onClose: () => void; onAdd: (poster: any) => void }) {
  const [selectedRoom, setSelectedRoom] = useState('Gaming Room');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS['Gaming Room'][0]);
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
          setError('');
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image');
      return;
    }

    const newPoster = {
      id: Date.now(),
      room: selectedRoom,
      location: selectedLocation,
      image,
      status: 'Active',
    };

    onAdd(newPoster);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add Poster</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => {
                setSelectedRoom(e.target.value);
                setSelectedLocation(LOCATIONS[e.target.value as keyof typeof LOCATIONS][0]);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            >
              {ROOMS.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            >
              {LOCATIONS[selectedRoom as keyof typeof LOCATIONS].map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Image</label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-500 transition-colors">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <div className="py-8">
                  <Plus size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
