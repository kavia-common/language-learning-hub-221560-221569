import { getVocabulary } from '../apiClient.js';
import { Card, Button, Badge } from '../components/ui.js';
import { getVocabStats, updateVocabStats } from '../store.js';

/**
 * PUBLIC_INTERFACE
 * VocabularyPage
 * Flashcard-style practice with reveal/know/don't know.
 */
export async function VocabularyPage() {
  const wrap = document.createElement('div');
  wrap.className = 'container';

  const words = await getVocabulary();
  let index = 0;
  let revealed = false;

  const stats = getVocabStats();

  const headBody = document.createElement('div');
  headBody.appendChild(Badge({ text: `Known: ${stats.known} • Unknown: ${stats.unknown}` }));

  wrap.appendChild(Card({ title: 'Vocabulary Practice', body: headBody }));

  const deckCardBody = document.createElement('div');

  const card = document.createElement('div');
  card.className = 'flashcard';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Flashcard, press to reveal translation');
  card.addEventListener('click', () => reveal());
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });

  const controls = document.createElement('div');
  controls.className = 'row';
  const btnReveal = Button({ label: 'Reveal', onClick: () => reveal(), variant: 'ghost' });
  const btnKnown = Button({ label: 'I knew it', onClick: () => rate(true) });
  const btnUnknown = Button({ label: "I didn't know", onClick: () => rate(false), variant: 'secondary' });
  controls.appendChild(btnReveal);
  controls.appendChild(btnKnown);
  controls.appendChild(btnUnknown);

  deckCardBody.appendChild(card);
  deckCardBody.appendChild(document.createElement('div')).style.height = '10px';
  deckCardBody.appendChild(controls);

  wrap.appendChild(Card({ title: 'Flashcards', body: deckCardBody }));

  function render() {
    const item = words[index];
    if (!item) {
      card.textContent = 'All done! 🎉';
      btnReveal.disabled = true;
      btnKnown.disabled = true;
      btnUnknown.disabled = true;
      return;
    }
    card.textContent = revealed ? `${item.translation} (${item.term})` : item.term;
  }

  function reveal() { revealed = true; render(); }

  function rate(known) {
    const s = updateVocabStats(known ? 1 : 0, known ? 0 : 1);
    headBody.innerHTML = '';
    headBody.appendChild(Badge({ text: `Known: ${s.known} • Unknown: ${s.unknown}` }));
    index = (index + 1);
    revealed = false;
    render();
  }

  render();
  return wrap;
}
