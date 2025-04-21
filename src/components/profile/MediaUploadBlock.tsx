import React, { useState, ChangeEvent } from 'react';

export default function MediaUploadBlock() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [introVideo, setIntroVideo] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'profile' | 'video' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);

    if (type === 'profile') {
      setProfilePic(fileURL);
    } else if (type === 'video') {
      setIntroVideo(fileURL);
    } else if (type === 'gallery') {
      setGallery((prev) => [...prev, fileURL]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-pink-600">🎬 Media Uploads</h2>

      {/* Profile Photo */}
      <div>
        <label className="block mb-1 font-medium">Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'profile')}
        />
        {profilePic && (
          <img
            src={profilePic}
            alt="Profile Preview"
            className="mt-2 w-32 h-32 rounded-full object-cover"
          />
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className="block mb-1 font-medium">Gallery Photos</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'gallery')}
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {gallery.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-24 object-cover rounded"
            />
          ))}
        </div>
      </div>

      {/* Intro Video */}
      <div>
        <label className="block mb-1 font-medium">📹 Profile Intro Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(e, 'video')}
        />
        {introVideo && (
          <video controls className="mt-2 w-full rounded">
            <source src={introVideo} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}
