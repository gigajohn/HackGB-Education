(() => {
  'use strict';

  const modes = ['kid', 'teen', 'adult'];
  const themeColors = { kid: '#fff8df', teen: '#080b1c', adult: '#172321' };
  let mode = document.body.dataset.mode || 'kid';

  try {
    const savedState = JSON.parse(localStorage.getItem('susorsafe.v2') || '{}');
    if (modes.includes(savedState.mode)) mode = savedState.mode;
  } catch (error) {
    console.warn('Could not load the saved SusOrSafe theme.', error);
  }

  window.applySusOrSafeMode = (nextMode) => {
    if (!modes.includes(nextMode)) return;
    mode = nextMode;
    document.body.dataset.mode = mode;
    document.documentElement.style.colorScheme = mode === 'kid' ? 'light' : 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[mode]);
    document.querySelectorAll('[data-age-copy-kid], [data-age-copy-teen], [data-age-copy-adult]').forEach((element) => {
      const copy = element.getAttribute(`data-age-copy-${mode}`);
      if (copy) element.textContent = copy;
    });
    document.querySelectorAll('.mode-pill[data-mode]').forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  window.applySusOrSafeMode(mode);

  if (document.body.classList.contains('support-body') || document.body.classList.contains('auth-body')) {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.mode-pill[data-mode]');
      if (!button || !modes.includes(button.dataset.mode)) return;
      try {
        const savedState = JSON.parse(localStorage.getItem('susorsafe.v2') || '{}');
        savedState.mode = button.dataset.mode;
        localStorage.setItem('susorsafe.v2', JSON.stringify(savedState));
        window.applySusOrSafeMode(savedState.mode);
      } catch (error) {
        console.error('Could not save the selected SusOrSafe age mode.', error);
        throw error;
      }
    });
  }

  const legalContent = {
    privacy: {
      title: 'Privacy notice',
      body: `<p>SusOrSafe is a learning demo. Lesson progress, coins, avatar choices, and your selected age mode are stored in this browser using local storage.</p>
        <h3>Information you provide</h3><p>You can use the lessons without an account. If you choose to sign in or create an account, the information you submit is used to provide that account feature. Do not enter sensitive personal details into lesson activities.</p>
        <h3>Third-party sign-in</h3><p>If you choose Google or Microsoft sign-in, those services handle their own authentication data under their privacy notices.</p>
        <h3>Questions</h3><p>Contact the SusOrSafe site owner with privacy questions before sharing personal information.</p>`
    },
    terms: {
      title: 'Terms of use',
      body: `<p>SusOrSafe provides general online-safety education for practice and discussion. The lessons are not professional security, legal, financial, or emergency advice.</p>
        <h3>Use the guidance carefully</h3><p>Examples cannot prove that a real message, website, offer, or caller is safe. Independently verify important requests through contact details you already trust. Never share passwords or verification codes with an unexpected contact.</p>
        <h3>Respectful and lawful use</h3><p>Use the site for learning. Do not disrupt the service, misuse another person's account, or use lesson examples to deceive or harm people.</p>
        <h3>Content and changes</h3><p>Site text, branding, and materials are provided for this demo; do not assume they may be copied or reused without permission. Features and these terms may change as the site develops.</p>`
    },
    cookies: {
      title: 'Cookies and browser storage',
      body: `<p>The learning app does not use advertising or analytics cookies. It stores your mode, lessons, coins, and avatar choices in local storage on this browser so your progress remains available here.</p>
        <h3>Essential site cookies</h3><p>When account or form features are used, Django may set session and CSRF-protection cookies needed for sign-in and secure form submissions. These are not used for advertising.</p>
        <h3>Your choices</h3><p>You can clear site data in your browser settings; doing so removes locally saved learning progress and may sign you out. Google or Microsoft sign-in may involve their own cookies under their notices.</p>`
    }
  };

  const legalDialog = document.querySelector('#legalDialog');
  const legalTitle = document.querySelector('#legalTitle');
  const legalBody = document.querySelector('#legalBody');

  if (legalDialog && legalTitle && legalBody) {
    document.querySelectorAll('[data-legal]').forEach((button) => {
      button.addEventListener('click', () => {
        const notice = legalContent[button.dataset.legal];
        if (!notice) return;
        legalTitle.textContent = notice.title;
        legalBody.innerHTML = notice.body;
        legalDialog.showModal();
      });
    });

    document.querySelectorAll('[data-legal-close]').forEach((button) => {
      button.addEventListener('click', () => legalDialog.close());
    });

    legalDialog.addEventListener('click', (event) => {
      if (event.target === legalDialog) legalDialog.close();
    });
  }

  document.querySelectorAll('.site-footer').forEach((footer) => {
    if (!('IntersectionObserver' in window)) {
      footer.classList.add('is-visible');
      return;
    }
    footer.classList.add('footer-reveal-ready');
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    observer.observe(footer);
  });
})();
