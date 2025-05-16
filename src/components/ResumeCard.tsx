import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function ProfileSetup() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState<string>('');
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState<string[]>([]); // Array for multiple photos
  const [videos, setVideos] = useState<string[]>([]); // Array for videos

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const userRef = doc(db, 'users', user?.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      setZodiac(userData.zodiac);
      setAboutMe(userData.aboutMe || '');
      setPhoto(userData.profilePhoto);
      setProfilePhotos(userData.profilePhotos || []);
      setVideos(userData.videos || []);
    }
  };

  const handleSave = async () => {
    if (!aboutMe || aboutMe.length < 10) {
      alert('Please provide a more detailed description!');
      return;
    }
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user?.uid);
      await updateDoc(userRef, {
        aboutMe,
        profilePhoto: photo,
        profilePhotos,
        videos,
        zodiac,
        lastUpdated: serverTimestamp(),
      });
      alert('Profile Updated Successfully!');
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving profile', error);
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photoArray = [...profilePhotos];
      for (let i = 0; i < files.length; i++) {
        photoArray.push(URL.createObjectURL(files[i]));
      }
      setProfilePhotos(photoArray);
    }
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const videoArray = [...videos];
      for (let i = 0; i < files.length; i++) {
        videoArray.push(URL.createObjectURL(files[i]));
      }
      setVideos(videoArray);
    }
  };

  const handleSelectProfilePhoto = (selectedPhoto: string) => {
    setPhoto(selectedPhoto);
  };

  return (
    <div className="profile-setup">
      <h1>Set Up Your Profile</h1>
      <div className="photo-upload">
        <h2>Upload Your Photos</h2>
        <input type="file" multiple onChange={handleUploadPhoto} />
        <div className="photo-preview">
          {profilePhotos.map((photoUrl, index) => (
            <img
              key={index}
              src={photoUrl}
              alt={`Profile Photo ${index}`}
              onClick={() => handleSelectProfilePhoto(photoUrl)}
              style={{ width: '100px', height: '100px', cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      <div className="video-upload">
        <h2>Upload Your Videos</h2>
        <input type="file" accept="video/*" multiple onChange={handleUploadVideo} />
        <div className="video-preview">
          {videos.map((videoUrl, index) => (
            <video key={index} width="200" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
      </div>

      <div className="about-me">
        <h2>About Me</h2>
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Tell us about yourself"
        />
      </div>

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  );
}
