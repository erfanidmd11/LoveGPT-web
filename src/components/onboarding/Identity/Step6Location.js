import React, { useState, useEffect } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';
import axios from 'axios';

export default function Step6Location({ onNext, onBack }) {
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || '');
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(true);

  // Auto-detect location from IP on mount
  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        if (res.data) {
          const city = res.data.city || '';
          const postal = res.data.postal || '';
          const fallback = city || postal;

          const formatted = city && postal ? `${city}, ${postal}` : fallback;

          setLocation(formatted);
          localStorage.setItem('userLocation', formatted);
        }
      } catch (err) {
        console.warn('Could not auto-detect location.');
      } finally {
        setGeoLoading(false);
      }
    };

    fetchGeoLocation();
  }, []);

  const handleContinue = () => {
    if (!location) return;

    setLoading(true);
    setTimeout(() => {
      saveAnswer('userLocation', location);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={6} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">Where are you located?</label>

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
        placeholder="City, Zip Code"
        required
      />

      <ValueCue cue="This helps ARIA suggest matches nearby and align timezones and lifestyle." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading || geoLoading}
        disabledNext={!location || geoLoading}
        nextLabel={
          geoLoading ? 'Detecting...' : loading ? 'Saving...' : 'Continue →'
        }
      />
    </div>
  );
}
