import { getLessons } from '../apiClient.js';
import { Card, Button, Progress, Badge } from '../components/ui.js';
import { linkTo } from '../router.js';
import { getProgressForLesson, setProgressForLesson } from '../store.js';

/**
 * PUBLIC_INTERFACE
 * LessonsListPage
 * Lists available lessons and links to detail views.
 */
export async function LessonsListPage() {
  const wrap = document.createElement('div');
  wrap.className = 'container';

  const list = await getLessons();

  const head = Card({
    title: 'Lessons',
    body: (() => {
      const d = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = 'Choose a lesson to continue learning.';
      d.appendChild(p);
      return d;
    })()
  });

  const grid = document.createElement('div');
  grid.className = 'grid cols-3';

  list.forEach(l => {
    const b = document.createElement('div');
    const title = document.createElement('div');
    title.className = 'row';
    const t = document.createElement('h4');
    t.style.margin = '0';
    t.textContent = l.title;
    title.appendChild(t);
    title.appendChild(Badge({ text: `${Math.round((getProgressForLesson(l.id) || l.progress || 0) * 100)}%` }));

    const desc = document.createElement('p');
    desc.textContent = l.description;

    const prog = Progress({ value: getProgressForLesson(l.id) || l.progress || 0 });

    const footer = document.createElement('div');
    footer.className = 'row';
    const link = document.createElement('a');
    Object.assign(link, linkTo(`/lessons/${encodeURIComponent(l.id)}`));
    link.appendChild(Button({ label: 'Open Lesson' }));
    footer.appendChild(link);

    b.appendChild(title);
    b.appendChild(desc);
    b.appendChild(prog);
    b.appendChild(document.createElement('div')).style.height = '8px';
    b.appendChild(footer);

    grid.appendChild(Card({ title: '', body: b }));
  });

  wrap.appendChild(head);
  wrap.appendChild(grid);
  return wrap;
}

/**
 * PUBLIC_INTERFACE
 * LessonDetailPage
 * Show sections and allow progress updates.
 */
export async function LessonDetailPage({ id }) {
  const wrap = document.createElement('div');
  wrap.className = 'container';

  const all = await getLessons();
  const lesson = all.find(l => l.id === id) || all[0];

  const head = Card({
    title: lesson ? lesson.title : 'Lesson',
    body: (() => {
      const d = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = lesson?.description || '';
      d.appendChild(p);
      return d;
    })()
  });

  const body = document.createElement('div');
  body.className = 'grid cols-2';

  const sectionsCard = (() => {
    const list = document.createElement('div');
    lesson.sections.forEach((s, idx) => {
      const row = document.createElement('div');
      row.className = 'card';
      row.style.padding = '12px';
      const h = document.createElement('strong');
      h.textContent = `Section ${idx + 1}: ${s}`;
      row.appendChild(h);
      list.appendChild(row);
    });
    return Card({ title: 'Sections', body: list });
  })();

  const progressCard = (() => {
    const c = document.createElement('div');
    const current = getProgressForLesson(lesson.id) || lesson.progress || 0;
    const prog = Progress({ value: current });
    const label = document.createElement('p');
    label.textContent = `Progress: ${Math.round(current * 100)}%`;
    const row = document.createElement('div'); row.className = 'row';
    const less = Button({ label: 'Mark -10%', variant: 'ghost', onClick: () => update(-0.1) });
    const more = Button({ label: 'Mark +10%', onClick: () => update(0.1) });
    c.appendChild(label);
    c.appendChild(prog);
    c.appendChild(document.createElement('div')).style.height = '8px';
    row.appendChild(less); row.appendChild(more);
    c.appendChild(row);

    function update(delta) {
      const next = Math.max(0, Math.min(1, (getProgressForLesson(lesson.id) || 0) + delta));
      setProgressForLesson(lesson.id, next);
      prog.setValue(next);
      label.textContent = `Progress: ${Math.round(next * 100)}%`;
    }

    return Card({ title: 'Your Progress', body: c });
  })();

  body.appendChild(sectionsCard);
  body.appendChild(progressCard);

  wrap.appendChild(head);
  wrap.appendChild(body);
  return wrap;
}
