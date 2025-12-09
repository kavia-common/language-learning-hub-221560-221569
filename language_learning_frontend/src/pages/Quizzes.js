import { getQuiz } from '../apiClient.js';
import { Card, Button, Badge, Modal } from '../components/ui.js';
import { setLastQuizResult } from '../store.js';

/**
 * PUBLIC_INTERFACE
 * QuizzesPage
 * Multiple-choice quiz with scoring and review.
 */
export async function QuizzesPage() {
  const wrap = document.createElement('div');
  wrap.className = 'container';

  const questions = await getQuiz();
  let current = 0;
  let correct = 0;
  const chosen = new Map(); // index -> optionIndex

  const headBody = document.createElement('div');
  headBody.appendChild(Badge({ text: `Questions: ${questions.length}` }));
  wrap.appendChild(Card({ title: 'Quiz', body: headBody }));

  const quizBody = document.createElement('div');

  const qCard = Card({ title: '', body: quizBody });

  wrap.appendChild(qCard);

  function render() {
    const q = questions[current];
    quizBody.innerHTML = '';
    if (!q) {
      const summary = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = `Score: ${correct}/${questions.length}`;
      const again = Button({ label: 'Retake Quiz', onClick: () => restart() });
      summary.appendChild(p);
      summary.appendChild(again);
      qCard.querySelector('.card-title').textContent = 'Completed';
      quizBody.appendChild(summary);
      setLastQuizResult({ total: questions.length, correct });
      return;
    }
    qCard.querySelector('.card-title').textContent = `Question ${current + 1} of ${questions.length}`;

    const qText = document.createElement('p');
    qText.textContent = q.question;
    quizBody.appendChild(qText);

    q.options.forEach((opt, idx) => {
      const btn = Button({
        label: opt,
        variant: chosen.get(current) === idx ? 'secondary' : 'ghost',
        onClick: () => select(idx),
        attrs: { 'aria-pressed': chosen.get(current) === idx ? 'true' : 'false' }
      });
      quizBody.appendChild(btn);
    });

    const actions = document.createElement('div');
    actions.className = 'row';
    actions.style.marginTop = '10px';

    const next = Button({ label: current < questions.length - 1 ? 'Next' : 'Finish', onClick: () => confirmAndNext() });
    const review = Button({ label: 'Review', variant: 'ghost', onClick: () => showReview() });
    actions.appendChild(next);
    actions.appendChild(review);
    quizBody.appendChild(actions);
  }

  function select(idx) {
    chosen.set(current, idx);
    render();
  }

  function confirmAndNext() {
    const q = questions[current];
    const pick = chosen.get(current);
    const isCorrect = pick === q.answerIndex;
    if (isCorrect) correct += 1;

    const content = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = isCorrect ? 'Correct!' : `Incorrect. ${q.explanation || ''}`;
    content.appendChild(p);
    const m = Modal({
      title: isCorrect ? 'Great job!' : 'Keep going!',
      content,
      actions: [
        { label: current < questions.length - 1 ? 'Next Question' : 'See Results', onClick: () => { m.close(); current += 1; render(); } },
        { label: 'Close', variant: 'ghost', onClick: () => m.close() }
      ]
    });
    document.body.appendChild(m);
  }

  function showReview() {
    const q = questions[current];
    const picked = chosen.get(current);
    const content = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = `You chose: ${picked != null ? q.options[picked] : 'No selection'}`;
    const a = document.createElement('p');
    a.textContent = `Correct answer: ${q.options[q.answerIndex]}`;
    const ex = document.createElement('p');
    ex.textContent = q.explanation || '';
    content.appendChild(p);
    content.appendChild(a);
    content.appendChild(ex);
    const m = Modal({
      title: 'Review',
      content,
      actions: [{ label: 'Close', variant: 'ghost', onClick: () => m.close() }]
    });
    document.body.appendChild(m);
  }

  function restart() {
    current = 0; correct = 0; chosen.clear(); render();
  }

  render();
  return wrap;
}
