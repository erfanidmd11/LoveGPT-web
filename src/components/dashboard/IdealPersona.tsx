import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function IdealPersona() {
  const [user] = useAuthState(auth);
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [relationshipGoals, setRelationshipGoals] = useState<string[]>([]);
  const [maritalStatus, setMaritalStatus] = useState<string | null>(null);
  const [kids, setKids] = useState<boolean | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [idealPersona, setIdealPersona] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setAge(data.age || null);
      setGender(data.gender || null);
      setRelationshipGoals(data.relationshipGoals || []);
      setMaritalStatus(data.maritalStatus || null);
      setKids(data.kids || null);
    }
  };

  const evaluatePersona = () => {
    setIsEvaluating(true);

    // ARIA's Evaluation Logic
    const persona = {
      goal: relationshipGoals[0] || 'Find a partner',
      idealPartner: 'Someone who aligns with my goals',
    };

    let adviceMessage = '';

    if (age && maritalStatus === 'single') {
      if (relationshipGoals.includes('marriage') && !kids) {
        if (age > 40) {
          adviceMessage = `ARIA suggests: Your desire to get married and have kids is important. However, at age ${age}, it may be important to focus on building connections before jumping into those big commitments. It's never too late, but you may need to adjust the pace of your goals.`;
        } else {
          adviceMessage = `ARIA suggests: You’re on track! Take it one step at a time, and trust that love will come when you are truly ready for it. Keep nurturing connections that align with your desires.`;
        }
      } else if (relationshipGoals.includes('marriage') && kids) {
        adviceMessage = `ARIA suggests: You may want to focus on your ideal partner’s desire for family. If you’re in your 30s or 40s, now’s the time to be more intentional in finding a partner who shares your vision.`;
      }
    }

    setIdealPersona(persona);
    setAdvice(adviceMessage);
    setIsEvaluating(false);
  };

  return (
    <div className="ideal-persona">
      <h2>Your Ideal Persona</h2>
      <button onClick={evaluatePersona} disabled={isEvaluating}>
        {isEvaluating ? 'Evaluating...' : 'Evaluate My Persona'}
      </button>

      {idealPersona && (
        <div className="persona-details">
          <h3>Persona Overview</h3>
          <p>Goal: {idealPersona.goal}</p>
          <p>Ideal Partner: {idealPersona.idealPartner}</p>
        </div>
      )}

      {advice && (
        <div className="advice-section">
          <h3>ARIA's Advice</h3>
          <p>{advice}</p>
        </div>
      )}
      
      <style jsx>{`
        .ideal-persona {
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        .persona-details {
          margin-top: 20px;
          background-color: #e6f7ff;
          padding: 15px;
          border-radius: 8px;
        }
        .advice-section {
          margin-top: 20px;
          padding: 15px;
          background-color: #fff4e6;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
