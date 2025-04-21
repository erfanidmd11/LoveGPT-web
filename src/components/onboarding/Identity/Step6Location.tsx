import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';
import axios from 'axios';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface Coords {
  lat: number | null;
  lng: number | null;
}

export default function Step6Location({ onNext }: { onNext: () => void }) {
  const [location, setLocation] = useState<string>('');
  const [coords, setCoords] = useState<Coords>({ lat: null, lng: null });
  const [geoLoading, setGeoLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    const lat = localStorage.getItem('userLat');
    const lng = localStorage.getItem('userLng');

    if (saved && lat && lng) {
      setLocation(saved);
      setCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setGeoLoading(false);
      return;
    }

    const fetchGeoLocation = async () => {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        if (res.data) {
          const city = res.data.city || '';
          const postal = res.data.postal || '';
          const formatted = city && postal ? `${city}, ${postal}` : city || postal;
          const lat = res.data.latitude;
          const lng = res.data.longitude;

          setLocation(formatted);
          setCoords({ lat, lng });

          localStorage.setItem('userLocation', formatted);
          localStorage.setItem('userLat', lat);
          localStorage.setItem('userLng', lng);
        }
      } catch (err) {
        console.warn('Could not auto-detect location.');
      } finally {
        setGeoLoading(false);
      }
    };

    fetchGeoLocation();
  }, []);

  const handleContinue = async () => {
    if (!location) return;

    try {
      const phone = localStorage.getItem('phoneNumber');
      if (phone) {
        const userRef = doc(db, 'users', phone);
        await setDoc(
          userRef,
          {
            location,
            lat: coords.lat,
            lng: coords.lng,
          },
          { merge: true }
        );
      }

      saveAnswer('userLocation', location);
      saveAnswer('userLat', coords.lat);
      saveAnswer('userLng', coords.lng);
    } catch (err) {
      console.error('🔥 Error saving user geo data:', err);
    } finally {
      onNext(); // Global Nav handles transition
    }
  };

  Step6Location.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={6} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">
        Where are you located?
      </label>

      <input
        type="text"
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          localStorage.setItem('userLocation', e.target.value);
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
        placeholder="City, Zip Code"
        required
      />

      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ValueCue cue="This helps ARIA suggest matches nearby and align timezones and lifestyle." />
        </motion.div>
      )}

      {geoLoading && (
        <p className="text-sm text-gray-500">Detecting your location...</p>
      )}
    </div>
  );
}
