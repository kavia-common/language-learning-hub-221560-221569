/**
 * PUBLIC_INTERFACE
 * loadState
 * Safely load persisted state from localStorage with a namespace.
 */
export function loadState(key, defaultValue) {
  try {
    const raw = localStorage.getItem(`llh:${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * PUBLIC_INTERFACE
 * saveState
 * Persist state to localStorage with a namespace.
 */
export function saveState(key, value) {
  try {
    localStorage.setItem(`llh:${key}`, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

/**
 * PUBLIC_INTERFACE
 * getProgressForLesson / setProgressForLesson
 * Track per-lesson progress (0..1)
 */
export function getProgressForLesson(id) {
  const map = loadState('lessonProgress', {});
  return typeof map[id] === 'number' ? map[id] : 0;
}
export function setProgressForLesson(id, value) {
  const map = loadState('lessonProgress', {});
  map[id] = Math.max(0, Math.min(1, Number(value) || 0));
  saveState('lessonProgress', map);
}

/**
 * PUBLIC_INTERFACE
 * getVocabStats / updateVocabStats
 * Track known/unknown counts for vocab practice.
 */
export function getVocabStats() {
  return loadState('vocabStats', { known: 0, unknown: 0 });
}
export function updateVocabStats(deltaKnown = 0, deltaUnknown = 0) {
  const s = getVocabStats();
  const next = { known: Math.max(0, s.known + deltaKnown), unknown: Math.max(0, s.unknown + deltaUnknown) };
  saveState('vocabStats', next);
  return next;
}

/**
 * PUBLIC_INTERFACE
 * getLastQuizResult / setLastQuizResult
 */
export function getLastQuizResult() {
  return loadState('lastQuiz', { total: 0, correct: 0, timestamp: 0 });
}
export function setLastQuizResult(result) {
  saveState('lastQuiz', { ...result, timestamp: Date.now() });
}
