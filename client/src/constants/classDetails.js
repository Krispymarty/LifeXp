import { Crown, Gem, Medal, ScrollText, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Shared Life Class details used by Dashboard and Profile.
 * Maps class names to their icons, descriptions, skills, and styling.
 */
export const classDetails = {
  Commander: {
    skills: ['Leadership', 'Communication'],
    description: 'You excel at organizing, leading, and motivating others.',
    icon: Crown,
    bg: 'bg-rose-100',
    text: 'text-rose-700'
  },
  Engineer: {
    skills: ['Technical', 'Professional'],
    description: 'You turn complex challenges into practical, working solutions.',
    icon: ShieldCheck,
    bg: 'bg-blue-100',
    text: 'text-blue-700'
  },
  Creator: {
    skills: ['Creativity', 'Learning'],
    description: 'You transform ideas into expressive work and original outcomes.',
    icon: Sparkles,
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-700'
  },
  Explorer: {
    skills: ['Adaptability', 'Confidence'],
    description: 'You grow through new places, uncertainty, and bold movement.',
    icon: ScrollText,
    bg: 'bg-amber-100',
    text: 'text-amber-700'
  },
  Wayfinder: {
    skills: ['Self Awareness', 'Empathy'],
    description: 'You learn deeply from reflection, care, and disciplined growth.',
    icon: Gem,
    bg: 'bg-teal-100',
    text: 'text-teal-700'
  },
  Novice: {
    skills: ['Learning', 'Confidence'],
    description: 'Your journey is just beginning. Log experiences to reveal your class.',
    icon: Medal,
    bg: 'bg-slate-100',
    text: 'text-slate-700'
  }
};
