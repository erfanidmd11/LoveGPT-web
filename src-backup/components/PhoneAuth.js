// components/PhoneAuth.js
"use client";

import { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { createUserProfile } from "@/lib/createUserProfile";
import { useRouter } from "next/navigation";

export default function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const router = useRouter();
  const recaptchaContainer = useRef(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer.current, {
        size: "invisible",
        callback: () => {},
      });
    }
  }, []);

  const handleSendOTP = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Send Error:", error);
      alert("Failed to send code. Please check number or try again.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Save profile to Firestore
      await createUserProfile(user);

      router.push("/dashboard"); // or your landing page
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Invalid code. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {!otpSent ? (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="w-full p-3 border rounded"
          />
          <button
            onClick={handleSendOTP}
            className="w-full bg-pink-600 text-white py-2 rounded"
          >
            Send Code
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full p-3 border rounded"
          />
          <button
            onClick={handleVerifyOTP}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify & Continue
          </button>
        </>
      )}
      <div ref={recaptchaContainer}></div>
    </div>
  );
}
