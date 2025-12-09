import { Router, linkTo } from './router.js';
import { DashboardPage } from './pages/Dashboard.js';
import { LessonsListPage, LessonDetailPage } from './pages/Lessons.js';
import { VocabularyPage } from './pages/Vocabulary.js';
import { QuizzesPage } from './pages/Quizzes.js';

/**
 * PUBLIC_INTERFACE
 * createApp
 * Initializes the application, router, and renders layout with routes.
 */
export function createApp(root) {
  // Define routes
  const routes = [
    { path: '/', component: DashboardPage },
    { path: '/lessons', component: LessonsListPage },
    { path: '/lessons/:id', component: LessonDetailPage },
    { path: '/vocabulary', component: VocabularyPage },
    { path: '/quizzes', component: QuizzesPage }
  ];
  const router = new Router(routes);

  root.innerHTML = '';
  const shell = document.createElement('div');
  shell.className = 'app-shell';

  // Topbar
  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  const title = document.createElement('div');
  title.className = 'topbar-title';
  title.textContent = 'Language Learning Hub';
  topbar.appendChild(title);

  // Sidebar
  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  const sec = document.createElement('div');
  sec.className = 'nav-section-title';
  sec.textContent = 'Navigate';
  sidebar.appendChild(sec);

  const items = [
    { path: '/lessons', label: 'Lessons' },
    { path: '/vocabulary', label: 'Vocabulary' },
    { path: '/quizzes', label: 'Quizzes' }
  ];

  const list = document.createElement('div');
  items.forEach(i => {
    const a = document.createElement('a');
    Object.assign(a, linkTo(i.path));
    a.className = 'nav-item';
    a.setAttribute('role', 'link');
    const span = document.createElement('span');
    span.className = 'nav-label';
    span.textContent = i.label;
    a.appendChild(span);
    a.addEventListener('click', (e) => {
      e.preventDefault();
      router.to(i.path);
    });
    list.appendChild(a);
  });
  sidebar.appendChild(list);

  // Main
  const main = document.createElement('main');
  main.className = 'main';
  main.setAttribute('role', 'main');

  shell.appendChild(sidebar);
  shell.appendChild(topbar);
  shell.appendChild(main);
  root.appendChild(shell);

  async function renderRoute() {
    // Highlight active links
    Array.from(list.querySelectorAll('a.nav-item')).forEach(a => {
      const props = linkTo(a.getAttribute('href').slice(1));
      if (props['aria-current'] === 'page') a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    const { route, params } = router.current();
    main.innerHTML = '';
    const comp = await route.component(params || {});
    main.appendChild(comp);
  }

  router.onChange(() => renderRoute());
  renderRoute();
}
