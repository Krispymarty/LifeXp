/**
 * AI Skill Extraction Validation Tests
 * 
 * Tests the keyword extraction fallback against 5 predefined test cases.
 * Run: node server/src/tests/testSkillExtraction.js
 */

import { keywordExtractor, CANONICAL_SKILLS } from '../services/skillExtractionService.js';

const testCases = [
  {
    id: 1,
    input: 'Led a team of 5 students during a hackathon.',
    expected: ['Leadership', 'Communication', 'Teamwork'],
    description: 'Hackathon leadership'
  },
  {
    id: 2,
    input: 'Built a React application using Firebase and MongoDB.',
    expected: ['Technical'],
    description: 'Technical app development'
  },
  {
    id: 3,
    input: 'Designed posters and branding for a college event.',
    expected: ['Creativity', 'Communication'],
    description: 'Creative design work'
  },
  {
    id: 4,
    input: 'Volunteered at an NGO and organized donation drives.',
    expected: ['Empathy', 'Leadership', 'Communication'],
    description: 'Volunteering and organization'
  },
  {
    id: 5,
    input: 'Travelled solo and adapted to new environments.',
    expected: ['Adaptability', 'Confidence'],
    description: 'Solo travel adaptation'
  }
];

function runTests() {
  console.log('='.repeat(70));
  console.log('LIFE XP — SKILL EXTRACTION VALIDATION');
  console.log('Testing keyword-based extraction (fallback mode)');
  console.log('='.repeat(70));
  console.log();

  let totalPassed = 0;
  let totalFailed = 0;
  const results = [];

  for (const test of testCases) {
    const extracted = keywordExtractor(test.input);
    const extractedNames = extracted.map(s => s.name);
    
    const matched = test.expected.filter(e => extractedNames.includes(e));
    const missed = test.expected.filter(e => !extractedNames.includes(e));
    const extra = extractedNames.filter(e => !test.expected.includes(e));
    
    const accuracy = test.expected.length > 0 
      ? Math.round((matched.length / test.expected.length) * 100) 
      : 100;
    
    const passed = missed.length === 0;
    if (passed) totalPassed++; else totalFailed++;

    console.log(`Test ${test.id}: ${test.description}`);
    console.log(`  Input:    "${test.input}"`);
    console.log(`  Expected: [${test.expected.join(', ')}]`);
    console.log(`  Got:      [${extractedNames.join(', ')}]`);
    console.log(`  Matched:  [${matched.join(', ')}]`);
    if (missed.length > 0) console.log(`  Missed:   [${missed.join(', ')}] ⚠️`);
    if (extra.length > 0) console.log(`  Extra:    [${extra.join(', ')}] (bonus, not errors)`);
    console.log(`  Accuracy: ${accuracy}%`);
    console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log();

    results.push({
      id: test.id,
      description: test.description,
      expected: test.expected,
      extracted: extractedNames,
      matched,
      missed,
      extra,
      accuracy,
      passed
    });
  }

  console.log('='.repeat(70));
  console.log(`RESULTS: ${totalPassed}/${testCases.length} passed, ${totalFailed} failed`);
  console.log('='.repeat(70));
  console.log();

  // Additional checks
  console.log('CANONICAL SKILL SET:');
  console.log(`  ${CANONICAL_SKILLS.join(', ')}`);
  console.log(`  Total: ${CANONICAL_SKILLS.length} skills`);
  console.log();

  // Test edge cases
  console.log('EDGE CASE TESTS:');
  
  const emptyResult = keywordExtractor('');
  console.log(`  Empty string:       ${emptyResult.length === 0 ? '✅ PASS' : '❌ FAIL'} (got ${emptyResult.length} skills)`);
  
  const noMatchResult = keywordExtractor('Hello world how are you today');
  console.log(`  No match text:      ${noMatchResult.length === 0 ? '✅ PASS' : '❌ FAIL'} (got ${noMatchResult.length} skills)`);
  
  const specialCharsResult = keywordExtractor('Built <script>alert("xss")</script> a React app');
  const specialNames = specialCharsResult.map(s => s.name);
  console.log(`  Special characters: ${specialNames.includes('Technical') ? '✅ PASS' : '❌ FAIL'} (got: [${specialNames.join(', ')}])`);
  
  const longText = 'Led the team and built a creative application while volunteering and traveling solo to learn new things with discipline and adapted to environments while designing innovative solutions and presented the project confidently with empathy towards users';
  const longResult = keywordExtractor(longText);
  const longNames = longResult.map(s => s.name);
  console.log(`  All-skills text:    Got ${longNames.length} skills: [${longNames.join(', ')}]`);
  
  console.log();
  console.log('Validation complete.');
  
  return results;
}

runTests();
