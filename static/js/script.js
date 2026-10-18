const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

if (menuToggle && navLinks) {
  // Open and close the mobile navigation menu.
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after choosing a section.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Reveal cards and headings when they scroll into view.
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  // Fallback for browsers that do not support IntersectionObserver.
  revealItems.forEach((item) => item.classList.add("visible"));
}


// Footer copyright year and accessible legal-information dialog.
const yearElement = document.querySelector("#copyrightYear");
if (yearElement) yearElement.textContent = new Date().getFullYear();

const legalDialog = document.querySelector("#legalDialog");
const legalTitle = document.querySelector("#legalTitle");
const legalBody = document.querySelector("#legalBody");
const legalClose = document.querySelector("#legalClose");

const legalContent = {
  privacy: {
    title: "Privacy notice",
    body: `<p><strong>Sus or Safe?</strong> is an educational website intended to help visitors learn about online safety.</p>
      <h3>Information you share</h3><p>This demo site does not currently provide account creation or forms that ask for personal information. Do not send private or sensitive information through a website unless you understand how it will be handled.</p>
      <h3>Third-party services</h3><p>If analytics, embedded content, hosting tools, or other third-party services are added later, this notice should be updated to explain what they collect and why.</p>
      <h3>Contact</h3><p>Add a website owner or project contact method here before publishing this site publicly.</p>`
  },
  terms: {
    title: "Terms of use",
    body: `<p>Content on Sus or Safe? is provided for general educational purposes to help visitors recognize common online risks.</p>
      <h3>Use your judgment</h3><p>Examples and tips are not a guarantee that a message, website, job offer, or link is safe. Verify important requests through official channels and never share passwords or verification codes with someone who contacts you unexpectedly.</p>
      <h3>Ownership and reuse</h3><p>Unless otherwise stated, do not assume that site text, branding, or other materials may be copied or reused without permission.</p>
      <h3>Updates</h3><p>These terms may need to be revised as the website and its features change.</p>`
  },
  cookies: {
    title: "Cookie notice",
    body: `<p>This version of the site does not intentionally set cookies or use a cookie preference system.</p>
      <h3>Future changes</h3><p>If you add analytics, advertising, sign-in, or other tools that use cookies or similar technologies, update this notice and add any consent controls required for your audience and location.</p>`
  }
};

// Function to apply the selected age mode
function setAgeMode(mode) {
  if (!['kid', 'teen', 'adult'].includes(mode)) return;
  if (typeof window.setSusOrSafeMode === 'function') {
    window.setSusOrSafeMode(mode);
    return;
  }
  if (typeof window.applySusOrSafeMode === 'function') {
    window.applySusOrSafeMode(mode);
    return;
  }

  // Fallback if engines are not loaded
  document.body.dataset.mode = mode;
  document.body.classList.remove('theme-kid', 'theme-teen', 'theme-adult', 'theme-kids', 'theme-teens', 'theme-adults');
  document.body.classList.add(`theme-${mode}`);
  const themeColors = { kid: '#fff8df', teen: '#080b1c', adult: '#f8f5f0' };
  document.documentElement.style.colorScheme = mode === 'teen' ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[mode]);
  document.querySelectorAll('.mode-pill').forEach(btn => {
    const isCurrent = btn.getAttribute('data-mode') === mode;
    btn.classList.toggle('is-active', isCurrent);
    btn.setAttribute('aria-pressed', String(isCurrent));
  });
  try {
    const savedState = JSON.parse(localStorage.getItem('susorsafe.v2') || '{}');
    savedState.mode = mode;
    localStorage.setItem('susorsafe.v2', JSON.stringify(savedState));
  } catch (e) {}
  localStorage.setItem('susorsafe_mode', mode);
}

