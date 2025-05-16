import onboardingMemory from '../onboardingMemory'; // adjust path if needed
import zodiacPersonalityMap from '../zodiacProfiles'; // adjust path if needed

export const generateMergedSWOTInsight = () => {
  const { zodiacSign = '', chineseZodiac = '', gender = 'male' } = onboardingMemory;
  const zodiacKey = `${zodiacSign}_${chineseZodiac}_${gender}`;
  const zodiacProfile = zodiacPersonalityMap?.[zodiacKey] || {};

  const readiness = onboardingMemory.readinessLevel || '';
  const traits = onboardingMemory.personalityTraits || [];
  const values = onboardingMemory.onboardingCoreValues || [];
  const communication = onboardingMemory.communicationStyle || '';
  const attachment = onboardingMemory.attachmentStyle || '';
  const intention = onboardingMemory.relationshipGoals || 'unspecified';

  let story = '🧠 **ARIA’s Integrated Insight Map**\n\n';

  if (zodiacProfile?.summary) {
    const isWeb = typeof window !== 'undefined';
    const safeSummary = isWeb
      ? zodiacProfile.summary.replace(/_/g, '') // ✅ Fixes web crash
      : zodiacProfile.summary;

    story += `♈ "What the Stars Whisper About You:" ${safeSummary}\n\n`;
  }

  // ✨ What You Shine At
  story += '✨ **What You Shine At**\n';

  if (traits.includes('Loyal') || values.includes('Loyalty')) {
    story += '- Creating unwavering emotional safety through loyalty.\n';
  }

  if (traits.includes('Empathetic')) {
    story += '- Intuitively sensing emotional needs others miss.\n';
  }

  if (communication === 'Assertive') {
    story += '- Expressing boundaries with clarity and grace.\n';
  }

  if (attachment === 'Secure') {
    story += '- Anchoring others with calm, confident presence.\n';
  }

  if (readiness.includes('green')) {
    story += '- Emotionally prepared for deeper love, not just dating.\n';
  }

  // ⚡ Your Edges (Growth Points)
  story += '\n⚡ **Your Edges (Growth Points)**\n';

  if (communication === 'Passive') {
    story += '- Speaking up before tension turns to distance.\n';
  }

  if (attachment === 'Anxious') {
    story += '- Learning to self-soothe without external proof.\n';
  }

  if (traits.includes('Guarded')) {
    story += "- Letting love in before it’s 'earned' through silence tests.\n";
  }

  if (readiness === 'yellow') {
    story += '- Exploring clarity instead of clinging to comfort.\n';
  }

  // 🌱 What's Waiting to Bloom
  story += "\n🌱 **What's Waiting to Bloom**\n";

  if (values.includes('Independence') && attachment === 'Avoidant') {
    story += '- Trusting that real connection doesn’t cage you — it frees you.\n';
  }

  if (traits.includes('Empathetic') && communication === 'Passive') {
    story += '- Sharing your truth before the resentment builds.\n';
  }

  if (readiness === 'red') {
    story += '- Healing in private — but preparing to let love *in*, not just hold it off.\n';
  }

  // 🚨 What to Watch For
  story += '\n🚨 **What to Watch For**\n';

  if (traits.includes('Overthinker')) {
    story += '- Analyzing your feelings instead of expressing them.\n';
  }

  if (attachment === 'Avoidant') {
    story += "- Disconnecting when you're actually longing for deeper connection.\n";
  }

  // 🔭 How ARIA Helps
  story += '\n🧭 **How ARIA Will Support Your Path**\n';

  if (intention.toLowerCase().includes('relationship')) {
    story += '- Matching your inner growth to outer readiness.\n';
    story += '- Reflecting back clarity when emotions feel cloudy.\n';
  } else if (intention.toLowerCase().includes('marriage')) {
    story += '- Guiding you to filter immaturity and find aligned partnership.\n';
    story += '- Strengthening your values-first emotional compass.\n';
  } else {
    story += '- Helping you recognize your readiness before rushing.\n';
    story += '- Building your relational identity — before merging with someone else.\n';
  }

  return story;
};
