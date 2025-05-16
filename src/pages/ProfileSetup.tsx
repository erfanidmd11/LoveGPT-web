import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import MediaUploadBlock from '@/components/MediaUploadBlock'; // For media uploads
import UploadGallery from '@/components/UploadGallery'; // Gallery management

export default function ProfileSetup() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [aboutMe, setAboutMe] = useState<string>('');
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState<File | null>(null); // Selected profile picture

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
        profilePhoto: selectedProfilePic ? selectedProfilePic.name : null, // Save file name for profile photo
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

  return (
    <div className="profile-setup">
      <h1>Set Up Your Profile</h1>

      {/* Upload Media Section */}
      <MediaUploadBlock /> {/* Allows users to upload photos and videos */}

      {/* Upload Gallery Section */}
      <UploadGallery /> {/* Users can manage gallery, set profile pic, and delete photos */}

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
