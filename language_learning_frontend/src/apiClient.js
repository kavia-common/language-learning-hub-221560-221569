/**
 * PUBLIC_INTERFACE
 * getApiBase
 * Returns the base URL for API calls using VITE_API_BASE or VITE_BACKEND_URL if present.
 */
export function getApiBase() {
  const base = import.meta?.env?.VITE_API_BASE || import.meta?.env?.VITE_BACKEND_URL || '';
  return typeof base === 'string' ? base.trim() : '';
}

/**
 * PUBLIC_INTERFACE
 * apiFetch
 * Fetch using configured API base. If not configured or on failure, throw to allow fallbacks.
 */
export async function apiFetch(path, options = {}) {
  const base = getApiBase();
  if (!base) {
    throw new Error('API base not configured');
  }
  const url = `${base.replace(/\/$/, '')}/${String(path || '').replace(/^\//, '')}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

/**
 * PUBLIC_INTERFACE
 * apiOrMock
 * Attempt API call using fetcher; on error or missing base, return provided mock data.
 */
export async function apiOrMock(fetcher, mockData) {
  try {
    return await fetcher();
  } catch {
    return mockData;
  }
}

/**
 * PUBLIC_INTERFACE
 * mock repository for lessons, vocabulary, and quizzes
 */
export const mockData = {
  lessons: [
    { id: 'l1', title: 'Basics 1', description: 'Greetings and introductions', progress: 0.6, sections: ['Hello', 'Goodbye', 'Please & Thank you'] },
    { id: 'l2', title: 'Basics 2', description: 'Numbers and colors', progress: 0.35, sections: ['Numbers 1-10', 'Primary Colors', 'Mix & Match'] },
    { id: 'l3', title: 'Travel', description: 'Directions and transport', progress: 0.1, sections: ['Airport', 'Taxi', 'Metro'] }
  ],
  vocabulary: [
    { id: 'v1', term: 'Hola', translation: 'Hello' },
    { id: 'v2', term: 'Adiós', translation: 'Goodbye' },
    { id: 'v3', term: 'Gracias', translation: 'Thank you' },
    { id: 'v4', term: 'Por favor', translation: 'Please' }
  ],
  quiz: [
    { id: 'q1', question: 'How do you say "Hello" in Spanish?', options: ['Adiós', 'Gracias', 'Hola', 'Por favor'], answerIndex: 2, explanation: '"Hola" is "Hello".' },
    { id: 'q2', question: 'What is "Thank you" in Spanish?', options: ['Gracias', 'Por favor', 'Hola', 'Sí'], answerIndex: 0, explanation: '"Gracias" is "Thank you".' },
    { id: 'q3', question: 'Translate "Please".', options: ['Adiós', 'No', 'Por favor', 'Buenos días'], answerIndex: 2, explanation: '"Por favor" is "Please".' },
    { id: 'q4', question: '"Adiós" means…', options: ['Hello', 'Goodbye', 'Thanks', 'Morning'], answerIndex: 1, explanation: '"Adiós" is "Goodbye".' },
    { id: 'q5', question: 'Pick the primary color in Spanish.', options: ['Rojo', 'Casa', 'Mesa', 'Perro'], answerIndex: 0, explanation: '"Rojo" is "Red".' }
  ]
};

/**
 * PUBLIC_INTERFACE
 * getLessons
 * Gets lessons via API or mock fallback.
 */
export async function getLessons() {
  return apiOrMock(() => apiFetch('/lessons'), mockData.lessons);
}

/**
 * PUBLIC_INTERFACE
 * getVocabulary
 * Gets vocabulary via API or mock fallback.
 */
export async function getVocabulary() {
  return apiOrMock(() => apiFetch('/vocabulary'), mockData.vocabulary);
}

/**
 * PUBLIC_INTERFACE
 * getQuiz
 * Gets quiz questions via API or mock fallback.
 */
export async function getQuiz() {
  return apiOrMock(() => apiFetch('/quiz'), mockData.quiz);
}
