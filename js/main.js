/* BuildFlow — interactions only.
   1. Mobile nav toggle (progressive enhancement — nav stays visible without JS)
   2. Scroll-reveal for .reveal elements (skipped if reduced motion is requested)
   3. Waitlist form -> Supabase REST insert
*/

const SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  nav.hidden = true;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.hidden = isOpen;
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 767px)').matches) {
        nav.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

function initWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const success = document.getElementById('waitlist-success');
  const status = form ? form.querySelector('.waitlist-form__status') : null;
  if (!form || !success || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      trade: String(data.get('trade') || '').trim(),
    };

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    status.dataset.state = '';
    status.textContent = 'Sending...';

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Waitlist signup failed with status ${response.status}`);
      }

      status.textContent = "Thanks — you're on the list!";
      status.dataset.state = 'success';
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = 'Something went wrong — please try again, or email hello@buildflow.app.';
      submitButton.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initScrollReveal();
  initWaitlistForm();
});
