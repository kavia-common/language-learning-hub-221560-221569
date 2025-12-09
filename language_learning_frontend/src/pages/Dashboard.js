import { Card, Badge, Button, Progress } from '../components/ui.js';
import { getLastQuizResult, getVocabStats, loadState } from '../store.js';
import { linkTo } from '../router.js';

/**
 * PUBLIC_INTERFACE
 * DashboardPage
 * Overview page with quick links and recent stats.
 */
export function DashboardPage() {
  const container = document.createElement('div');
  container.className = 'container';

  // Header card
  const head = Card({
    title: 'Welcome to Language Learning Hub',
    body: (() => {
      const d = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = 'Interactive lessons, vocabulary practice, and quizzes — all in one place.';
      const row = document.createElement('div'); row.className = 'row';
      const a = document.createElement('a'); Object.assign(a, linkTo('/lessons')); a.appendChild(Button({ label: 'Go to Lessons' }));
      const b = document.createElement('a'); Object.assign(b, linkTo('/vocabulary')); b.appendChild(Button({ label: 'Practice Vocabulary', variant: 'secondary' }));
      const c = document.createElement('a'); Object.assign(c, linkTo('/quizzes')); c.appendChild(Button({ label: 'Start a Quiz', variant: 'ghost' }));
      row.appendChild(a); row.appendChild(b); row.appendChild(c);
      d.appendChild(p); d.appendChild(row);
      return d;
    })()
  });

  // Stats grid
  const lastQuiz = getLastQuizResult();
  const vocabStats = getVocabStats();
  const lessonProgress = loadState('lessonProgress', {});
  const avgProgress = (() => {
    const vals = Object.values(lessonProgress);
    if (!vals.length) return 0;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  })();

  const grid = document.createElement('div');
  grid.className = 'grid cols-3';

  const card1Body = document.createElement('div');
  card1Body.appendChild(Badge({ text: 'Average Lesson Progress' }));
  card1Body.appendChild(document.createElement('div')).style.height = '8px';
  card1Body.appendChild(Progress({ value: avgProgress }));
  grid.appendChild(Card({ title: 'Lessons', body: card1Body }));

  const card2Body = document.createElement('div');
  card2Body.appendChild(Badge({ text: 'Known vs Unknown' }));
  const c2 = document.createElement('p');
  c2.textContent = `Known: ${vocabStats.known} • Unknown: ${vocabStats.unknown}`;
  card2Body.appendChild(c2);
  grid.appendChild(Card({ title: 'Vocabulary', body: card2Body }));

  const card3Body = document.createElement('div');
  card3Body.appendChild(Badge({ text: 'Last Quiz' }));
  const c3 = document.createElement('p');
  c3.textContent = lastQuiz.total ? `Score: ${lastQuiz.correct}/${lastQuiz.total}` : 'No quiz taken yet';
  card3Body.appendChild(c3);
  grid.appendChild(Card({ title: 'Quizzes', body: card3Body }));

  container.appendChild(head);
  container.appendChild(grid);
  return container;
}
