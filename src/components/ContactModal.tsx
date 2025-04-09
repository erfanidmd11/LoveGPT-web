import React, { useState } from "react";

interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    fetch("https://formspree.io/f/meoavqvn", {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.ok) setSubmitted(true);
      })
      .catch(() => alert("Submission failed. Please try again."));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-indigo-700">Message Sent 💌</h2>
            <p className="text-gray-600 text-md">
              Thank you for reaching out. We’re honored you’re exploring LoveGPT as an opportunity. Our team will follow up with next steps shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
              Connect With Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-200"
              >
                Submit Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
