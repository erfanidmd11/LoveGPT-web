import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export default function ResumePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('You');
  const [mbtiType, setMbtiType] = useState('');
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [nlpAnswers, setNlpAnswers] = useState<string[]>([]);
  const [enneagramAnswers, setEnneagramAnswers] = useState<string[]>([]);
  const [relationshipAnswers, setRelationshipAnswers] = useState<string[]>([]);
  const [readinessScores, setReadinessScores] = useState<any>({});
  const [ariaSummary, setAriaSummary] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (typeof window !== 'undefined') {
      setZodiac(localStorage.getItem('onboardingZodiac'));
      setUserName(localStorage.getItem('onboardingName') || 'You');
    }
    const fetchResume = async () => {
      const ref = doc(db, 'userResumes', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setMbtiType(data.mbti || '');
        setCoreValues(data.coreValues?.selected || []);
        setNlpAnswers(data.nlpStyle?.answers || []);
        setEnneagramAnswers(data.enneagram?.answers || []);
        setRelationshipAnswers(data.relationshipReadiness?.answers || []);
        setReadinessScores(data.readinessScores || {});
        setAriaSummary(data.ariaSummary || 'ARIA is still preparing your personalized summary...');
      }
    };
    fetchResume();
  }, [user, router]);

  const triggerSummary = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      // Generate Summary using Firebase Cloud Functions
      const generateSummary = httpsCallable(functions, 'generateResumeSummary');
      const result = await generateSummary({ uid: user.uid });
      setAriaSummary(result.data.summary);
      alert('✨ ARIA summary refreshed!');
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      alert('❌ Failed to generate summary.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="resume-page">
        <h1>{userName}'s Resume</h1>
        <button onClick={triggerSummary} disabled={generating}>
          {generating ? 'Generating Summary...' : 'Generate ARIA Summary'}
        </button>
        
        <h2>Your Zodiac: {zodiac}</h2>
        <div className="core-values">
          <h3>Your Core Values</h3>
          <ul>
            {coreValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>

        <h3>Personality Insights</h3>
        <p>MBTI: {mbtiType}</p>
        <p>NLP Answers: {nlpAnswers.join(', ')}</p>
        <p>Enneagram: {enneagramAnswers.join(', ')}</p>
        <p>Relationship Readiness: {relationshipAnswers.join(', ')}</p>

        {/* Display Radar Chart for Readiness */}
        {readinessScores && Object.keys(readinessScores).length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={Object.entries(readinessScores).map(([key, value]) => ({ subject: key, A: value }))}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Readiness" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {/* ARIA Summary */}
        <div className="aria-summary">
          <h3>ARIA Summary</h3>
          <p>{ariaSummary}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
