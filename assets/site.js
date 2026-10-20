// Progressive enhancement: the complete catalogue remains available without JS.
(() => {
  const tools = document.querySelector('.game-tools');
  if (!tools) return;

  const cards = [...document.querySelectorAll('.play-card, .directory-card')];
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const search = document.getElementById('game-search');
  const englishOnly = document.getElementById('english-only');
  const status = document.getElementById('filter-status');
  const empty = document.querySelector('.empty-results');
  const storageKey = `taamoo:catalogue:v1:${location.pathname}`;
  const state = { category: 'all', query: '', english: false };
  const catalogue = cards.map(card => ({
    card,
    text: card.textContent.toLocaleLowerCase(),
    category: card.dataset.category,
    language: card.dataset.language
  }));

  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && typeof saved === 'object') {
      if (['all', 'puzzle', 'arcade'].includes(saved.category)) state.category = saved.category;
      if (typeof saved.query === 'string') state.query = saved.query.slice(0, 100);
      state.english = saved.english === true;
    }
  } catch { /* Filtering also works when storage is blocked or unavailable. */ }

  function render() {
    const terms = state.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const item of catalogue) {
      item.card.hidden = !(
        (state.category === 'all' || item.category === state.category) &&
        (!state.english || item.language === 'en') &&
        terms.every(term => item.text.includes(term))
      );
      if (!item.card.hidden) count++;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === state.category));
    }
    search.value = state.query;
    englishOnly.checked = state.english;
    status.textContent = `${count} ${count === 1 ? 'game' : 'games'} of ${cards.length}`;
    empty.hidden = count !== 0;
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Optional. */ }
  }

  function reset() {
    Object.assign(state, { category: 'all', query: '', english: false });
    render();
  }

  function revealLinkedGame() {
    // An explicit guide link wins over an earlier saved filter.
    const target = cards.find(card => `#${card.id}` === location.hash && card.id);
    if (target) {
      reset();
      target.scrollIntoView({ block: 'start' });
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      state.category = button.dataset.filter;
      render();
    });
  }
  search.addEventListener('input', () => {
    state.query = search.value;
    render();
  });
  englishOnly.addEventListener('change', () => {
    state.english = englishOnly.checked;
    render();
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    reset();
    search.focus();
  });
  window.addEventListener('hashchange', revealLinkedGame);
  window.addEventListener('pageshow', event => { if (event.persisted) render(); });

  render();
  tools.hidden = false;
  document.querySelector('.filters')?.removeAttribute('hidden');
  revealLinkedGame();
})();
