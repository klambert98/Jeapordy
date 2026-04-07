import './style.css';

const STORAGE_KEY = 'jeapordy-board-v1';
const TEAMS_STORAGE_KEY = 'jeapordy-teams-v1';
const VALUES = [100, 200, 300, 400, 500];

const DEFAULT_TEAMS = [
  { name: 'Team 1', score: 0 },
  { name: 'Team 2', score: 0 },
  { name: 'Team 3', score: 0 },
];

const DEFAULT_BOARD = {
  categories: [
    {
      title: 'Favorites',
      clues: [
        { value: 100, question: 'This color is Josie\'s favorite.', answer: 'What is green?', answered: false, isDailyDouble: false },
        { value: 200, question: 'This food is one Josie could always eat.', answer: 'What is cheese?', answered: false, isDailyDouble: false },
        { value: 300, question: 'This genre of music is the bride\'s go-to for listening.', answer: 'What is rock?', answered: false, isDailyDouble: false },
        { value: 400, question: 'This restaurant is one of Josie\'s favorites.', answer: 'What is Zola?', answered: false, isDailyDouble: false },
        { value: 500, question: 'This vacation spot is one of Josie\'s favorites to visit.', answer: 'Where is the Oregon Coast?', answered: false, isDailyDouble: false },
      ],
    },
    {
      title: "Hill's History",
      clues: [
        { value: 100, question: 'These two are Josie\'s parents.', answer: 'Who is Stefani and Dennis?', answered: false, isDailyDouble: false },
        { value: 200, question: 'This extracurricular activity was what she participated in during High School.', answer: 'What is Band?', answered: false, isDailyDouble: false },
        { value: 300, question: 'Not everyone has the same sized feet. This number represents Josie\'s shoe size.', answer: 'What is 11?', answered: false, isDailyDouble: false },
        { value: 400, question: 'If you wanted to get her attention on the playground, you might have called her by this childhood nickname.', answer: 'What is Picke? (Or JoJo)', answered: false, isDailyDouble: false },
        { value: 500, question: 'This celebrity could be found in the posters of the bride\'s bedroom.', answer: 'Who is Ian Somerhalder?', answered: false, isDailyDouble: false },
      ],
    },
    {
      title: "It's a Love Story",
      clues: [
        { value: 100, question: 'This is the specific location is where the bride and groom first crossed paths.', answer: 'Where is Walmart?', answered: false, isDailyDouble: false },
        { value: 200, question: 'The movies are a classic first date activity. This was the name of the movie that the couple saw together.', answer: 'What is Spider-Man?', answered: false, isDailyDouble: false },
        { value: 300, question: '____ was a fine year. It was also the year this couple started dating.', answer: 'What is 2019?', answered: false, isDailyDouble: false },
        { value: 400, question: 'Between the wedding planning, the couple still finds time for dates. This location was where they last went.', answer: 'Where is The Max?', answered: false, isDailyDouble: false },
        { value: 500, question: 'This long-running television show is a favorite of the couple.', answer: 'What is Supernatural?', answered: false, isDailyDouble: false },
      ],
    },
    {
      title: 'Where in the World',
      clues: [
        { value: 100, question: 'Where was this photo taken?', answer: 'Where is ___?', answered: false, isDailyDouble: false, picture: '/pictures/josie_unknown.jpg' },
        { value: 200, question: 'Where was this photo taken?', answer: 'Where is Alaska?', answered: false, isDailyDouble: false, picture: '/pictures/josie_alaska.jpg' },
        { value: 300, question: 'Where was this photo taken?', answer: 'Where is Banff?', answered: false, isDailyDouble: false, picture: '/pictures/josie_banff.png' },
        { value: 400, question: 'Where was this photo taken?', answer: 'Where is ___?', answered: false, isDailyDouble: false },
        { value: 500, question: 'Where was this photo taken?', answer: 'Where is ___?', answered: false, isDailyDouble: false },
      ],
    },
    {
      title: 'The Kids',
      clues: [
        { value: 100, question: 'These are the names of the couple\'s two cats.', answer: 'Who are Goose and Fumi?', answered: false, isDailyDouble: false },
        { value: 200, question: 'Of their feline children, this one can be found gagging all the time.', answer: 'Who is Goose?', answered: false, isDailyDouble: false },
        { value: 300, question: 'This is the show that Fumi\'s namesake is from.', answer: 'What is "The Rising of Shield Hero"?', answered: false, isDailyDouble: false },
        { value: 400, question: 'This kitty loves the Bride the most.', answer: 'Who is Fumi?', answered: false, isDailyDouble: false },
        { value: 500, question: 'This kitty love the Groom the most.', answer: 'Who is Goose?', answered: false, isDailyDouble: false },
      ],
    },
  ],
};

const app = document.querySelector('#app');
const state = {
  board: loadBoard(),
  teams: loadTeams(),
  selected: null,
  showAnswer: false,
  showDailyDoubleAnnouncement: false,
  adminOpen: false,
  adminCategoryIndex: 0,
  adminClueIndex: 0,
  introComplete: localStorage.getItem('jeapordy-intro-complete') === 'true',
  boardFillActive: false,
  selectedTeams: [],
};

init();

function init() {
  if (!hasTwoDailyDoubles(state.board)) {
    placeDailyDoubles(state.board);
    persistBoard();
  }
  render();
}

function render() {
  if (state.boardFillActive) {
    return; // board-fill JS owns the DOM during the sequence
  }

  if (!state.introComplete) {
    renderIntroScene();
    return;
  }

  const board = state.board;

  app.innerHTML = `
    <div class="app-shell">
      <div class="layout ${state.adminOpen ? 'admin-open' : ''}">
        <section class="board-stage">
          <div class="board-frame">
            <div class="grid">
              ${board.categories
                .map((category) => `<div class="category-cell">${escapeHtml(category.title)}</div>`)
                .join('')}

              ${renderClueButtons(board)}
            </div>
          </div>
        </section>

        ${state.adminOpen ? renderAdminPanel() : ''}
      </div>

      ${renderScoreboard()}

      <div class="controls controls-bottom">
        <button class="btn-primary" data-action="reset-progress">Clear Board</button>
        <button class="btn-secondary" data-action="toggle-admin">${state.adminOpen ? 'Close Admin' : 'Open Admin'}</button>
        <button class="btn-secondary" data-action="restart-intro">Restart Intro</button>
      </div>
    </div>

    ${renderDailyDoubleAnnouncement()}
    ${renderModal()}
  `;

  bindUiEvents();
}

function renderBoardFillScene() {
  const board = state.board;

  let clueHtml = '';
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const clue = board.categories[col].clues[row];
      clueHtml += `<div class="clue-btn fill-value-cell">$${clue.value}</div>`;
    }
  }

  app.innerHTML = `
    <div class="board-fill-scene">
      <div class="board-fill-wrapper" id="boardFillWrapper">
        <div class="board-frame">
          <div class="grid">
            ${board.categories
              .map(
                (cat, i) => `
                  <div class="category-cell board-fill-cat" data-col="${i}">
                    <span class="cat-fill-text">${escapeHtml(cat.title)}</span>
                  </div>`,
              )
              .join('')}
            ${clueHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

function runBoardFillSequence() {
  // Timing (ms)
  const FIRST_ZOOM = 350;   // delay before col 0 zooms in
  const COL_STEP   = 1300;  // interval between columns
  const REVEAL_LAG = 420;   // ms after zoom starts before text flashes
  const ZOOM_OUT   = FIRST_ZOOM + 5 * COL_STEP + 500;   // after last reveal
  const DONE       = ZOOM_OUT + 950;                     // hand off to game

  playMp3('/sounds/boardfill.mp3');

  for (let col = 0; col < 5; col += 1) {
    const zoomAt   = FIRST_ZOOM + col * COL_STEP;
    const revealAt = zoomAt + REVEAL_LAG;

    setTimeout(() => {
      const wrapper = document.getElementById('boardFillWrapper');
      if (!wrapper) return;
      const xPct = (((col + 0.5) / 5) * 100).toFixed(1);
      wrapper.style.transformOrigin = `${xPct}% 12%`;
      wrapper.style.transform = 'scale(3.2)';
    }, zoomAt);

    setTimeout(() => {
      const textEl = document.querySelector(
        `.board-fill-cat[data-col="${col}"] .cat-fill-text`,
      );
      if (textEl) textEl.classList.add('cat-revealed');
    }, revealAt);
  }

  // Zoom back out to show the full board and reveal values
  setTimeout(() => {
    const wrapper = document.getElementById('boardFillWrapper');
    if (!wrapper) return;
    wrapper.style.transformOrigin = '50% 50%';
    wrapper.style.transform = 'scale(1)';
    document.querySelectorAll('.fill-value-cell').forEach((el) => {
      el.classList.add('values-visible');
    });
  }, ZOOM_OUT);

  // Transition to the live game board
  setTimeout(() => {
    state.boardFillActive = false;
    state.introComplete = true;
    localStorage.setItem('jeapordy-intro-complete', 'true');
    render();
  }, DONE);
}

function renderIntroScene() {
  app.innerHTML = `
    <div class="app-shell">
      <div class="intro-container">
        <div class="intro-content">
          <h1 class="intro-title" data-text="Josie Jeapordy">Josie Jeapordy</h1>
          <div class="intro-subtitle">Let's Play!</div>
          <button class="btn-primary intro-start-btn" data-action="start-game" style="margin-top: 40px; font-size: 1.2rem; padding: 14px 28px;">Start Game</button>
        </div>
      </div>
    </div>
  `;

  bindUiEvents();
}

function renderClueButtons(board) {
  let html = '';
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const clue = board.categories[col].clues[row];
      html += `
        <button
          class="clue-btn ${clue.answered ? 'answered' : ''}"
          data-action="open-clue"
          data-col="${col}"
          data-row="${row}"
          ${clue.answered ? 'disabled' : ''}
        >
          $${clue.value}
          ${state.adminOpen && clue.isDailyDouble ? '<span class="daily-chip">Daily Double</span>' : ''}
        </button>
      `;
    }
  }
  return html;
}

function renderScoreboard() {
  return `
    <div class="scoreboard">
      ${state.teams
        .map(
          (team, idx) => `
            <div class="score-card">
              <div class="team-name">${escapeHtml(team.name)}</div>
              <div class="team-score">$${team.score}</div>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderAdminPanel() {
  const category = state.board.categories[state.adminCategoryIndex];
  const clue = category.clues[state.adminClueIndex];

  const categoryOptions = state.board.categories
    .map((cat, idx) => `<option value="${idx}" ${idx === state.adminCategoryIndex ? 'selected' : ''}>${idx + 1}. ${escapeHtml(cat.title)}</option>`)
    .join('');

  const clueOptions = category.clues
    .map((item, idx) => `<option value="${idx}" ${idx === state.adminClueIndex ? 'selected' : ''}>$${item.value}</option>`)
    .join('');

  return `
    <aside class="admin-panel">
      <h2>Admin</h2>
      <div class="admin-row">
        <label for="categorySelect">Edit Category</label>
        <select id="categorySelect" data-action="admin-select-category">${categoryOptions}</select>
      </div>

      <div class="admin-row">
        <label for="categoryTitle">Category Name</label>
        <input id="categoryTitle" data-action="admin-category-title" value="${escapeHtml(category.title)}" />
      </div>

      <div class="admin-row">
        <label for="clueSelect">Edit Clue Slot</label>
        <select id="clueSelect" data-action="admin-select-clue">${clueOptions}</select>
      </div>

      <div class="admin-row">
        <label for="questionInput">Question</label>
        <textarea id="questionInput" data-action="admin-question">${escapeHtml(clue.question)}</textarea>
      </div>

      <div class="admin-row">
        <label for="answerInput">Answer</label>
        <input id="answerInput" data-action="admin-answer" value="${escapeHtml(clue.answer)}" />
      </div>

      <div class="admin-row">
        <label for="pictureInput">Picture Path (optional)</label>
        <input id="pictureInput" data-action="admin-picture" value="${escapeHtml(clue.picture || '')}" placeholder="e.g. /pictures/josie_alaska.jpg" />
      </div>

      <div class="admin-actions">
        <button class="btn-primary" data-action="admin-save">Save Changes</button>
        <button class="btn-secondary" data-action="shuffle-dailies">Re-roll Daily Doubles</button>
        <button class="btn-secondary" data-action="reset-progress">Reset Board Progress</button>
        <button class="btn-danger" data-action="reset-all">Restore Default Categories/Questions</button>
      </div>

      <h3>Teams</h3>
      ${state.teams
        .map(
          (team, idx) => `
            <div class="admin-row">
              <label>Team ${idx + 1} Name</label>
              <input type="text" data-action="team-name" data-team="${idx}" value="${escapeHtml(team.name)}" />
              <div style="font-size: 0.9rem; color: var(--muted); margin-top: 4px;">Score: $${team.score}</div>
            </div>
          `,
        )
        .join('')}
      <div class="admin-actions">
        <button class="btn-secondary" data-action="reset-scores">Reset All Scores</button>
      </div>
    </aside>
  `;
}

function renderDailyDoubleAnnouncement() {
  if (!state.showDailyDoubleAnnouncement) {
    return '';
  }

  return `
    <div class="daily-double-overlay">
      <div class="daily-double-announcement">Daily Double!</div>
    </div>
  `;
}

function renderModal() {
  if (!state.selected) {
    return '<div class="modal-backdrop"></div>';
  }

  const { category, clue } = state.selected;
  const dailyStage = clue.isDailyDouble && !state.showAnswer;

  const teamButtons = state.teams
    .map((team, idx) => {
      const teamNum = idx + 1;
      const isSelected = state.selectedTeams.includes(teamNum);
      return `<button
        class="btn-team${isSelected ? ' team-selected' : ''}"
        data-action="toggle-team"
        data-team="${teamNum}"
      >${escapeHtml(team.name)}</button>`;
    })
    .join('');

  const anySelected = state.selectedTeams.length > 0;

  return `
    <div class="modal-backdrop open" data-action="backdrop-close">
      <div class="modal modal-game" role="dialog" aria-modal="true" aria-label="Question panel">
        <div class="modal-header">
          <div class="modal-category">${escapeHtml(category.title)}</div>
        </div>
        ${dailyStage ? '<div class="daily-banner">Daily Double!</div>' : ''}
        <div class="modal-content">
          ${clue.picture ? `<img class="clue-photo" src="${escapeHtml(clue.picture)}" alt="Where in the World clue" />` : ''}
          <div class="clue-text">${escapeHtml(clue.question)}</div>
          ${state.showAnswer ? `<div class="answer">${escapeHtml(clue.answer)}</div>` : ''}
        </div>
        <div class="modal-controls">
          ${!state.showAnswer ? `<button class="btn-primary" data-action="show-answer">Show Answer</button>` : `
            <div class="team-toggle-row">${teamButtons}</div>
            <div class="award-confirm-row">
              <button class="btn-confirm-award" data-action="confirm-award"${anySelected ? '' : ' disabled'}>Award Points</button>
              <button class="btn-team btn-no-points" data-action="no-points">No Points</button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function bindUiEvents() {
  app.querySelectorAll('[data-action]').forEach((element) => {
    element.addEventListener('click', handleClick);
  });

  const categorySelect = document.getElementById('categorySelect');
  const clueSelect = document.getElementById('clueSelect');

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      state.adminCategoryIndex = Number(categorySelect.value);
      state.adminClueIndex = 0;
      render();
    });
  }

  if (clueSelect) {
    clueSelect.addEventListener('change', () => {
      state.adminClueIndex = Number(clueSelect.value);
      render();
    });
  }

  // Team name change listeners
  app.querySelectorAll('[data-action="team-name"]').forEach((input) => {
    input.addEventListener('change', () => {
      const teamIdx = Number(input.dataset.team);
      state.teams[teamIdx].name = input.value.trim() || `Team ${teamIdx + 1}`;
      persistTeams();
      render();
    });
  });
}

function handleClick(event) {
  const action = event.currentTarget.dataset.action;

  if (action === 'start-game') {
    state.boardFillActive = true;
    renderBoardFillScene();
    runBoardFillSequence();
    return;
  }

  if (action === 'open-clue') {
    const col = Number(event.currentTarget.dataset.col);
    const row = Number(event.currentTarget.dataset.row);
    openClue(col, row);
    return;
  }

  if (action === 'toggle-admin') {
    state.adminOpen = !state.adminOpen;
    render();
    return;
  }

  if (action === 'restart-intro') {
    state.introComplete = false;
    localStorage.removeItem('jeapordy-intro-complete');
    render();
    return;
  }

  if (action === 'reset-progress') {
    resetProgress();
    return;
  }

  if (action === 'show-answer') {
    fadeOutCurrentAudio();
    state.showAnswer = true;
    render();
    return;
  }

  if (action === 'toggle-team') {
    const team = Number(event.currentTarget.dataset.team);
    const idx = state.selectedTeams.indexOf(team);
    if (idx === -1) {
      state.selectedTeams.push(team);
    } else {
      state.selectedTeams.splice(idx, 1);
    }
    render();
    return;
  }

  if (action === 'confirm-award') {
    if (state.selected && state.selectedTeams.length > 0) {
      let pointsToAward = state.selected.clue.value;
      if (state.selected.clue.isDailyDouble) {
        pointsToAward *= 2;
      }
      state.selectedTeams.forEach((teamNum) => {
        state.teams[teamNum - 1].score += pointsToAward;
      });
      persistTeams();
      playCorrectSound();
    }
    if (state.selected) {
      state.selected.clue.answered = true;
      persistBoard();
    }
    state.selected = null;
    state.showAnswer = false;
    state.showDailyDoubleAnnouncement = false;
    state.selectedTeams = [];
    render();
    return;
  }

  if (action === 'no-points') {
    playNoPointsSound();
    if (state.selected) {
      state.selected.clue.answered = true;
      persistBoard();
    }
    state.selected = null;
    state.showAnswer = false;
    state.showDailyDoubleAnnouncement = false;
    state.selectedTeams = [];
    render();
    return;
  }

  if (action === 'award-team') {
    const team = Number(event.currentTarget.dataset.team);
    if (state.selected && team > 0) {
      let pointsToAward = state.selected.clue.value;
      if (state.selected.clue.isDailyDouble) {
        pointsToAward *= 2;
      }
      state.teams[team - 1].score += pointsToAward;
      persistTeams();
      playCorrectSound();
    } else {
      playNoPointsSound();
    }
    if (state.selected) {
      state.selected.clue.answered = true;
      persistBoard();
    }
    state.selected = null;
    state.showAnswer = false;
    state.showDailyDoubleAnnouncement = false;
    render();
    return;
  }

  if (action === 'mark-answered') {
    if (state.selected) {
      state.selected.clue.answered = true;
      persistBoard();
    }
    state.selected = null;
    state.showAnswer = false;
    state.selectedTeams = [];
    render();
    return;
  }

  if (action === 'close-preview' || action === 'backdrop-close') {
    if (action === 'backdrop-close' && event.target !== event.currentTarget) {
      return;
    }
    state.selected = null;
    state.showAnswer = false;
    state.selectedTeams = [];
    render();
    return;
  }

  if (action === 'shuffle-dailies') {
    placeDailyDoubles(state.board);
    persistBoard();
    render();
    return;
  }

  if (action === 'reset-all') {
    state.board = deepClone(DEFAULT_BOARD);
    placeDailyDoubles(state.board);
    persistBoard();
    render();
    return;
  }

  if (action === 'admin-save') {
    saveAdminChanges();
  }

  if (action === 'reset-scores') {
    state.teams.forEach((team) => {
      team.score = 0;
    });
    persistTeams();
    render();
    return;
  }
}

function openClue(col, row) {
  const category = state.board.categories[col];
  const clue = category.clues[row];
  if (clue.answered) {
    return;
  }

  state.selected = { category, clue };
  state.showAnswer = false;

  if (clue.isDailyDouble) {
    state.showDailyDoubleAnnouncement = true;
    state.selectedTeams = [];
    render();
    playDailyDoubleSound();

    // Auto-hide the announcement after 3 seconds
    setTimeout(() => {
      state.showDailyDoubleAnnouncement = false;
      render();
    }, 3000);
  } else {
    playClueSound();
    render();
  }
}

function saveAdminChanges() {
  const categoryTitleInput = document.getElementById('categoryTitle');
  const questionInput = document.getElementById('questionInput');
  const answerInput = document.getElementById('answerInput');

  const category = state.board.categories[state.adminCategoryIndex];
  const clue = category.clues[state.adminClueIndex];

  const pictureInput = document.getElementById('pictureInput');

  category.title = (categoryTitleInput?.value || '').trim() || category.title;
  clue.question = (questionInput?.value || '').trim() || clue.question;
  clue.answer = (answerInput?.value || '').trim() || clue.answer;
  const pictureValue = (pictureInput?.value || '').trim();
  if (pictureValue) {
    clue.picture = pictureValue;
  } else {
    delete clue.picture;
  }

  persistBoard();
  render();
}

function resetProgress() {
  state.board.categories.forEach((category) => {
    category.clues.forEach((clue) => {
      clue.answered = false;
    });
  });
  state.teams.forEach((team) => {
    team.score = 0;
  });
  persistBoard();
  persistTeams();
  render();
}

function hasTwoDailyDoubles(board) {
  let count = 0;
  board.categories.forEach((cat) => {
    cat.clues.forEach((clue) => {
      if (clue.isDailyDouble) {
        count += 1;
      }
    });
  });
  return count === 2;
}

function placeDailyDoubles(board) {
  const positions = [];
  board.categories.forEach((category, col) => {
    category.clues.forEach((_, row) => positions.push({ col, row }));
  });

  board.categories.forEach((category) => {
    category.clues.forEach((clue) => {
      clue.isDailyDouble = false;
    });
  });

  shuffleArray(positions);
  const chosen = positions.slice(0, 2);
  chosen.forEach(({ col, row }) => {
    board.categories[col].clues[row].isDailyDouble = true;
  });
}

function loadBoard() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const next = deepClone(DEFAULT_BOARD);
    placeDailyDoubles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.categories || parsed.categories.length !== 5) {
      throw new Error('Invalid board shape');
    }
    const merged = deepClone(DEFAULT_BOARD);

    merged.categories.forEach((category, colIdx) => {
      const storedCategory = parsed.categories[colIdx];
      if (!storedCategory || !Array.isArray(storedCategory.clues) || storedCategory.clues.length !== 5) {
        throw new Error(`Invalid clues in column ${colIdx}`);
      }

      category.clues.forEach((clue, rowIdx) => {
        const storedClue = storedCategory.clues[rowIdx] || {};
        clue.value = VALUES[rowIdx];
        clue.answered = typeof storedClue.answered === 'boolean' ? storedClue.answered : false;
        clue.isDailyDouble = typeof storedClue.isDailyDouble === 'boolean' ? storedClue.isDailyDouble : false;
        // Preserve admin-edited content fields from stored state
        if (typeof storedClue.question === 'string' && storedClue.question) clue.question = storedClue.question;
        if (typeof storedClue.answer === 'string' && storedClue.answer) clue.answer = storedClue.answer;
        if (typeof storedClue.picture === 'string' && storedClue.picture) clue.picture = storedClue.picture;
        else if (storedClue.picture === null || storedClue.picture === '') delete clue.picture;
      });
      if (typeof storedCategory.title === 'string' && storedCategory.title) {
        category.title = storedCategory.title;
      }
    });

    if (!hasTwoDailyDoubles(merged)) {
      placeDailyDoubles(merged);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    const fallback = deepClone(DEFAULT_BOARD);
    placeDailyDoubles(fallback);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function persistBoard() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.board));
}

function deepClone(value) {
  return structuredClone(value);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let _currentAudio = null;
let _fadeInterval = null;

function playMp3(src) {
  // Cancel any in-progress fade
  if (_fadeInterval) {
    clearInterval(_fadeInterval);
    _fadeInterval = null;
  }
  if (_currentAudio) {
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
  }
  const audio = new Audio(src);
  _currentAudio = audio;
  audio.play().catch(() => {});
}

function fadeOutCurrentAudio(durationMs = 600) {
  if (!_currentAudio || _currentAudio.paused) return;
  if (_fadeInterval) {
    clearInterval(_fadeInterval);
    _fadeInterval = null;
  }
  const audio = _currentAudio;
  const startVol = audio.volume;
  const steps = 20;
  const stepTime = durationMs / steps;
  const stepSize = startVol / steps;
  _fadeInterval = setInterval(() => {
    if (audio.volume > stepSize) {
      audio.volume = Math.max(0, audio.volume - stepSize);
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(_fadeInterval);
      _fadeInterval = null;
    }
  }, stepTime);
}

function playClueSound() {
  playMp3('/sounds/theme.mp3');
}

function playDailyDoubleSound() {
  playMp3('/sounds/dailydouble.mp3');
}

function playCorrectSound() {
  playMp3('/sounds/correct.mp3');
}

function playNoPointsSound() {
  playMp3('/sounds/nopoints.mp3');
}

function playToneSequence(sequence) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const audioCtx = new AudioContextClass();
  let cursor = audioCtx.currentTime;

  sequence.forEach((note) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(note.freq, cursor);

    gainNode.gain.setValueAtTime(0, cursor);
    gainNode.gain.linearRampToValueAtTime(0.18, cursor + 0.01);
    gainNode.gain.linearRampToValueAtTime(0.001, cursor + note.duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(cursor);
    oscillator.stop(cursor + note.duration + 0.02);

    cursor += note.duration + 0.025;
  });

  setTimeout(() => {
    audioCtx.close();
  }, 1200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function loadTeams() {
  const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
  if (!raw) {
    const next = deepClone(DEFAULT_TEAMS);
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      throw new Error('Invalid teams shape');
    }
    parsed.forEach((team) => {
      if (typeof team.name !== 'string') {
        team.name = 'Team';
      }
      if (typeof team.score !== 'number') {
        team.score = 0;
      }
    });
    return parsed;
  } catch {
    const fallback = deepClone(DEFAULT_TEAMS);
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function persistTeams() {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(state.teams));
}
