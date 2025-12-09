/**
 * Tiny hash-based router to avoid extra dependencies.
 * PUBLIC_INTERFACE
 */
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.listeners = [];
    window.addEventListener('hashchange', () => this.notify());
    if (!location.hash) {
      location.replace('#/');
    }
  }
  current() {
    const path = location.hash.slice(1) || '/';
    // Support detail route like /lessons/:id
    for (const r of this.routes) {
      if (typeof r.path === 'string' && !r.path.includes(':')) {
        if (r.path === path) return { route: r, params: {} };
      } else {
        const match = matchPath(r.path, path);
        if (match) return { route: r, params: match };
      }
    }
    // fallback to root
    const root = this.routes.find(r => r.path === '/');
    return { route: root, params: {} };
  }
  to(path) { location.hash = `#${path}`; }
  onChange(cb) { this.listeners.push(cb); }
  notify() { this.listeners.forEach(cb => cb(this.current())); }
}

/**
 * PUBLIC_INTERFACE
 * matchPath
 * Basic pattern matcher for routes with one or more :params
 */
export function matchPath(pattern, path) {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) {
      params[p[i].slice(1)] = decodeURIComponent(s[i]);
    } else if (p[i] !== s[i]) {
      return null;
    }
  }
  return params;
}

/**
 * PUBLIC_INTERFACE
 * linkTo
 * Helper to create accessible nav links highlighting active route.
 */
export function linkTo(path) {
  return {
    href: `#${path}`,
    'aria-current': (location.hash.slice(1) || '/') === path ? 'page' : undefined
  };
}
