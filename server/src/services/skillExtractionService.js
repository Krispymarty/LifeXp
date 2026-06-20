/**
 * Skill Extraction Service
 * 
 * Extracts skills from experience descriptions using two strategies:
 * 1. Ollama LLM extraction (primary) — constrained to canonical skill names
 * 2. Keyword-based extraction (fallback) — when Ollama is unavailable
 */

const CANONICAL_SKILLS = [
  'Leadership', 'Communication', 'Teamwork', 'Technical',
  'Creativity', 'Adaptability', 'Professional', 'Learning',
  'Empathy', 'Confidence', 'Discipline', 'Self Awareness'
];

const CANONICAL_SET = new Set(CANONICAL_SKILLS.map(s => s.toLowerCase()));

const keywordMapping = {
  // Leadership
  'lead': ['Leadership'], 'led': ['Leadership'], 'managed': ['Leadership'],
  'directed': ['Leadership'], 'supervised': ['Leadership'], 'headed': ['Leadership'],
  'coordinated': ['Leadership'], 'captain': ['Leadership'], 'mentor': ['Leadership'],
  'mentored': ['Leadership'], 'organized': ['Leadership', 'Professional', 'Communication'],
  'drives': ['Leadership', 'Communication'],
  // Communication
  'presented': ['Communication'], 'spoke': ['Communication'], 'communicated': ['Communication'],
  'negotiated': ['Communication'], 'pitched': ['Communication'], 'articulated': ['Communication'],
  'wrote': ['Communication'], 'writing': ['Communication'], 'public speaking': ['Communication'],
  'debate': ['Communication'], 'branding': ['Communication'], 'poster': ['Communication'],
  'students': ['Communication', 'Teamwork'],
  // Teamwork
  'team': ['Teamwork'], 'collaborate': ['Teamwork'], 'collaborated': ['Teamwork'],
  'together': ['Teamwork'], 'group': ['Teamwork'], 'hackathon': ['Teamwork', 'Communication'],
  'partner': ['Teamwork'], 'cooperation': ['Teamwork'],
  // Technical
  'built': ['Technical'], 'developed': ['Technical'], 'coded': ['Technical'],
  'programmed': ['Technical'], 'engineered': ['Technical'], 'implemented': ['Technical'],
  'react': ['Technical'], 'firebase': ['Technical'], 'mongodb': ['Technical'],
  'python': ['Technical'], 'javascript': ['Technical'], 'software': ['Technical'],
  'database': ['Technical'],
  'api': ['Technical'], 'algorithm': ['Technical'], 'automation': ['Technical'],
  // Creativity
  'creative': ['Creativity'], 'design': ['Creativity'], 'designed': ['Creativity'],
  'art': ['Creativity'], 'artistic': ['Creativity'], 'illustration': ['Creativity'],
  'photography': ['Creativity'], 'music': ['Creativity'], 'composed': ['Creativity'],
  'crafted': ['Creativity'], 'innovation': ['Creativity'], 'innovative': ['Creativity'],
  // Adaptability
  'travel': ['Adaptability'], 'travelled': ['Adaptability'], 'traveled': ['Adaptability'],
  'adapted': ['Adaptability'], 'adaptable': ['Adaptability'], 'flexible': ['Adaptability'],
  'new environment': ['Adaptability', 'Confidence'], 'solo': ['Adaptability', 'Confidence'],
  'relocat': ['Adaptability'], 'adjust': ['Adaptability'], 'abroad': ['Adaptability'],
  // Professional
  'planned': ['Professional'], 'project': ['Professional'],
  'strategy': ['Professional'], 'strategic': ['Professional'], 'deadline': ['Professional'],
  'managed project': ['Professional'], 'internship': ['Professional'], 'intern': ['Professional'],
  // Learning
  'studied': ['Learning'], 'learned': ['Learning'], 'course': ['Learning'],
  'certification': ['Learning'], 'research': ['Learning'], 'training': ['Learning'],
  'workshop': ['Learning'], 'tutorial': ['Learning'], 'education': ['Learning'],
  // Empathy
  'helped': ['Empathy'], 'volunteered': ['Empathy'], 'volunteer': ['Empathy'],
  'donated': ['Empathy'], 'donation': ['Empathy'], 'ngo': ['Empathy'],
  'charity': ['Empathy'], 'community': ['Empathy'],
  'compassion': ['Empathy'], 'care': ['Empathy'],
  // Confidence
  'confident': ['Confidence'], 'confidence': ['Confidence'], 'solo trip': ['Confidence', 'Adaptability'],
  'independently': ['Confidence'], 'self-reliant': ['Confidence'], 'bold': ['Confidence'],
  'courage': ['Confidence'], 'overcame': ['Confidence'],
  // Discipline
  'discipline': ['Discipline'], 'consistent': ['Discipline'], 'routine': ['Discipline'],
  'fitness': ['Discipline'], 'sports': ['Discipline'], 'gym': ['Discipline'],
  'marathon': ['Discipline'], 'training regimen': ['Discipline'], 'practice': ['Discipline'],
  // Self Awareness
  'self-aware': ['Self Awareness'], 'reflect': ['Self Awareness'], 'reflection': ['Self Awareness'],
  'journal': ['Self Awareness'], 'meditat': ['Self Awareness'], 'mindful': ['Self Awareness'],
  'introspect': ['Self Awareness'], 'personal growth': ['Self Awareness']
};

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3.5:9b';
const OLLAMA_TIMEOUT_MS = parseInt(process.env.OLLAMA_TIMEOUT_MS, 10) || 15000;

/**
 * Normalize an extracted skill name to match our canonical skill set.
 * Returns the canonical name or null if no match.
 */
function normalizeSkillName(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Direct match (case-insensitive)
  const lower = trimmed.toLowerCase();
  for (const canonical of CANONICAL_SKILLS) {
    if (canonical.toLowerCase() === lower) return canonical;
  }

  // Partial match (the extracted name contains or is contained by a canonical name)
  for (const canonical of CANONICAL_SKILLS) {
    if (lower.includes(canonical.toLowerCase()) || canonical.toLowerCase().includes(lower)) {
      return canonical;
    }
  }

  // Common aliases
  const aliases = {
    'problem solving': 'Technical',
    'problem-solving': 'Technical',
    'critical thinking': 'Learning',
    'public speaking': 'Communication',
    'time management': 'Professional',
    'project management': 'Professional',
    'organization': 'Professional',
    'resilience': 'Adaptability',
    'interpersonal': 'Communication',
    'networking': 'Communication',
    'innovation': 'Creativity',
    'analytical': 'Technical',
    'mentoring': 'Leadership',
    'coaching': 'Leadership',
    'collaboration': 'Teamwork',
    'volunteering': 'Empathy',
    'compassion': 'Empathy',
    'self awareness': 'Self Awareness',
    'self-awareness': 'Self Awareness',
    'decision making': 'Leadership',
    'decision-making': 'Leadership'
  };

  return aliases[lower] || null;
}

async function ollamaExtractor(text) {
  const prompt = `You are a skill classifier for a gamified life experience tracker.

Given the following experience description, identify which skills from this EXACT list are demonstrated:
${CANONICAL_SKILLS.join(', ')}

Rules:
- Return ONLY a comma-separated list using the exact skill names above
- Do not add any skills not in the list
- Do not include explanations or numbering
- If no skills match, return "none"

Description: "${text}"

Skills:`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const resultText = (data.response || '').trim();

    if (!resultText || resultText.toLowerCase() === 'none') {
      throw new Error('No skills extracted by LLM');
    }

    // Clean response: remove markdown fences, bullets, numbering
    const cleaned = resultText
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^\s*[-*•\d.]+\s*/gm, '')
      .replace(/\n/g, ',');

    // Parse comma-separated list and normalize to canonical names
    const skills = cleaned.split(',')
      .map(s => s.trim().replace(/[^a-zA-Z\s-]/g, ''))
      .filter(s => s.length > 0)
      .map(normalizeSkillName)
      .filter(Boolean);

    // Deduplicate
    const unique = [...new Set(skills)];

    if (unique.length === 0) {
      throw new Error('No canonical skills matched from LLM response');
    }

    console.log(`[Skill Extraction] Ollama extracted: ${unique.join(', ')}`);
    return unique.map(name => ({ name, xp: 20 }));
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function keywordExtractor(text) {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set();
  
  // Sort keywords by length (longest first) for better matching
  const sortedKeywords = Object.entries(keywordMapping)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [keyword, skillNames] of sortedKeywords) {
    if (lowerText.includes(keyword)) {
      for (const name of skillNames) {
        foundSkills.add(name);
      }
    }
  }

  const result = Array.from(foundSkills);
  if (result.length > 0) {
    console.log(`[Skill Extraction] Keyword fallback extracted: ${result.join(', ')}`);
  }

  return result.map(name => ({ name, xp: 20 }));
}

export async function extractSkills(text) {
  if (!text || text.trim().length === 0) return [];

  try {
    return await ollamaExtractor(text);
  } catch (error) {
    console.log(`[Skill Extraction] Ollama unavailable (${error.message}), using keyword fallback.`);
    return keywordExtractor(text);
  }
}

export { CANONICAL_SKILLS, keywordExtractor, normalizeSkillName };
