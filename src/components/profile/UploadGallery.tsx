import React, { useState, ChangeEvent } from 'react';

export default function UploadGallery() {
  const [files, setFiles] = useState<File[]>([]);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDelete = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-pink-600 mb-4">📸 Media Uploads</h2>

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      <div className="grid grid-cols-3 gap-4">
        {files.map((file, index) => {
          const previewURL = URL.createObjectURL(file);
          const isVideo = file.type.includes('video');

          return (
            <div key={index} className="relative group border rounded overflow-hidden">
              {isVideo ? (
                <video src={previewURL} className="w-full h-auto object-cover" controls />
              ) : (
                <img src={previewURL} alt={`Upload ${index}`} className="w-full h-32 object-cover" />
              )}

              <button
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full p-1"
              >
                ✕
              </button>

              <div className="absolute bottom-1 left-1">
                <label className="text-xs text-white bg-black bg-opacity-50 px-2 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="profilePic"
                    onChange={() => setProfilePic(file)}
                    className="mr-1"
                    checked={file === profilePic}
                  />
                  Set as Profile
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {profilePic && (
        <p className="text-sm mt-4 text-green-600">✅ Profile photo selected!</p>
      )}
    </div>
  );
}
