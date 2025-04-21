import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface InvitationModalProps {
  onClose: () => void;
}

export default function InvitationModal({ onClose }: InvitationModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [showApplication, setShowApplication] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    handle: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return toast.error('Please enter a code.');

    try {
      if (inviteCode === 'LOVE2024') {
        toast.success('✅ Invitation code accepted. Welcome!');
        onClose();
        window.location.href = '/onboarding/Step1APhoneOTP';
      } else {
        toast.error('❌ Invalid invitation code.');
      }
    } catch (err) {
      console.error('Code check failed:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleApplicationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, handle } = form;
    if (!firstName || !lastName || !email || !phone || !handle) {
      toast.error('Please complete all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'inviteApplications'), {
        ...form,
        createdAt: Timestamp.now(),
        status: 'pending',
        reviewedBy: 's@joga.im'
      });
      toast.success("🎉 Application received! We'll review and reach out soon.");
      onClose();
    } catch (err) {
      console.error('Application failed:', err);
      toast.error('Error submitting application. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Join LoveGPT</h2>

        {!showApplication ? (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <input
              type="text"
              name="inviteCode"
              placeholder="Enter Invitation Code"
              className="w-full border rounded-lg px-4 py-3"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold"
            >
              Enter
            </button>
            <p className="text-sm text-gray-600 text-center pt-2">
              Don’t have an invite?{' '}
              <button
                type="button"
                onClick={() => setShowApplication(true)}
                className="text-pink-500 underline"
              >
                Apply for access
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                className="border rounded-lg px-4 py-2"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name*"
                className="border rounded-lg px-4 py-2"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email*"
              className="w-full border rounded-lg px-4 py-2"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number*"
              className="w-full border rounded-lg px-4 py-2"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="handle"
              placeholder="Instagram or Facebook Handle*"
              className="w-full border rounded-lg px-4 py-2"
              value={form.handle}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold mt-2"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
