// ✅ Full Web-Compatible Replacement for Step10CoreValues
// Replaces `react-native-draggable-flatlist` with `@dnd-kit/sortable`
// Retains all logic and styling as close as possible for production testing

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRouter } from 'next/router';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { saveAnswer, getAnswer, saveAnswerToFirestore } from '@/lib/saveAnswer';
import onboardingMemory from '@/lib/onboardingMemory';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const initialValues = [
  'Family', 'Faith', 'Career', 'Adventure', 'Stability',
  'Creativity', 'Growth', 'Freedom', 'Kindness', 'Health',
  'Wisdom', 'Service',
];

export default function Step10CoreValues({ phone, onNext, onBack }) {
  const router = useRouter();
  const uid = router.query.uid as string;

  const [values, setValues] = useState<{ key: string; label: string }[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step10CoreValues').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }

    const fetchValues = async () => {
      if (!phone) return;
      if (onboardingMemory.coreValuesRanked.length) {
        setValues(onboardingMemory.coreValuesRanked);
        return;
      }

      try {
        const userRef = doc(db, 'users', phone);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data?.coreValuesRanked) {
            const sorted = data.coreValuesRanked
              .sort((a, b) => a.rank - b.rank)
              .map((item) => ({ key: item.value, label: item.value }));
            setValues(sorted);
            onboardingMemory.coreValuesRanked = sorted;
            return;
          }
        }
        const defaults = initialValues.map(v => ({ key: v, label: v }));
        setValues(defaults);
        onboardingMemory.coreValuesRanked = defaults;
      } catch (err) {
        console.error('Error loading core values:', err);
      }
    };
    fetchValues();
  }, [phone, uid]);

  const handleContinue = async () => {
    if (!phone) return;
    const rankedCoreValues = values.map((item, index) => ({
      value: item.label,
      rank: index + 1,
    }));

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', phone), {
        coreValuesRanked: rankedCoreValues,
        onboardingStep: 10,
      }, { merge: true });

      onboardingMemory.coreValuesRanked = values;

      if (uid) {
        saveAnswer('Step10CoreValues', values);
        await saveAnswerToFirestore(uid, 'Step10CoreValues', values);
      }

      onNext();
    } catch (error) {
      console.error('Error saving core values:', error);
      alert('Could not save your core values. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <ProgressBar step={10} totalSteps={32} />
      <h2 className="text-xl font-bold text-center text-pink-600 mb-2">Step 10 of 32 — Core Values</h2>
      <p className="text-center text-gray-700 mb-3">
        💡 <strong>Drag and drop</strong> to reorder your values.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = values.findIndex(v => v.key === active.id);
            const newIndex = values.findIndex(v => v.key === over?.id);
            const reordered = arrayMove(values, oldIndex, newIndex);
            setValues(reordered);
          }
        }}
      >
        <SortableContext items={values.map(v => v.key)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {values.map((item) => (
              <SortableItem key={item.key} id={item.key} label={item.label} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {values.length > 0 && (
        <div className="my-4 bg-gray-100 p-3 rounded">
          <AnimatedValueCue message={
            `🌟 You treasure "${values[0]?.label}" most${values[1] ? `, closely followed by "${values[1].label}".` : '.'}`
          } />
        </div>
      )}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={saving}
        nextLabel="Next"
      />
    </div>
  );
}

function SortableItem({ id, label }: { id: string; label: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`px-4 py-3 bg-white border rounded-lg shadow-sm ${isDragging ? 'ring-2 ring-pink-400' : ''}`}
    >
      <span className="font-medium text-gray-800">{label}</span>
    </li>
  );
}
