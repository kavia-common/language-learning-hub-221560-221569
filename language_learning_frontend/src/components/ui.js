/**
 * PUBLIC_INTERFACE
 * Button
 * Renders a themed button with variants and accessible labeling.
 */
export function Button({ label, onClick, variant = 'primary', type = 'button', attrs = {} }) {
  const btn = document.createElement('button');
  btn.className = `btn ${variant === 'ghost' ? 'ghost' : variant === 'secondary' ? 'secondary' : variant === 'error' ? 'error' : ''}`.trim();
  btn.type = type;
  btn.textContent = label;
  btn.setAttribute('aria-label', label);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) btn.setAttribute(k, String(v));
  });
  btn.addEventListener('click', (e) => {
    if (typeof onClick === 'function') onClick(e);
  });
  return btn;
}

/**
 * PUBLIC_INTERFACE
 * Card
 */
export function Card({ title, body }) {
  const w = document.createElement('section');
  w.className = 'card';
  if (title) {
    const h = document.createElement('h3');
    h.className = 'card-title';
    h.textContent = title;
    w.appendChild(h);
  }
  if (body && typeof body === 'object' && 'nodeType' in body) {
    w.appendChild(body);
  } else if (typeof body === 'string') {
    const p = document.createElement('p');
    p.textContent = body;
    w.appendChild(p);
  }
  return w;
}

/**
 * PUBLIC_INTERFACE
 * Progress
 */
export function Progress({ value = 0 }) {
  const wrap = document.createElement('div');
  wrap.className = 'progress';
  const inner = document.createElement('div');
  inner.className = 'progress-inner';
  inner.style.width = `${Math.max(0, Math.min(1, value)) * 100}%`;
  wrap.appendChild(inner);
  wrap.setValue = (v) => { inner.style.width = `${Math.max(0, Math.min(1, v)) * 100}%`; };
  return wrap;
}

/**
 * PUBLIC_INTERFACE
 * Badge
 */
export function Badge({ text }) {
  const b = document.createElement('span');
  b.className = 'badge';
  b.textContent = text;
  return b;
}

/**
 * PUBLIC_INTERFACE
 * Modal
 * Very small modal utility.
 */
export function Modal({ title, content, actions = [] }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const modal = document.createElement('div');
  modal.className = 'modal';

  const h = document.createElement('h3');
  h.className = 'card-title';
  h.textContent = title;

  const body = document.createElement('div');
  if (content && typeof content === 'object' && 'nodeType' in content) body.appendChild(content);
  else { const p = document.createElement('p'); p.textContent = content; body.appendChild(p); }

  const footer = document.createElement('div');
  footer.className = 'row';
  footer.style.marginTop = '12px';

  actions.forEach(a => footer.appendChild(Button(a)));

  modal.appendChild(h);
  modal.appendChild(body);
  modal.appendChild(footer);
  backdrop.appendChild(modal);

  backdrop.close = () => backdrop.remove();
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.close(); });

  return backdrop;
}
