/* ============================================================
   AFSHAN PORTFOLIO — MAIN JS
   ============================================================ */

// ── Navbar scroll effect ──────────────────────────────────
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
})();

// ── Mobile menu ───────────────────────────────────────────
(function () {
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn   = document.querySelector('.mobile-close');

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger)  hamburger.addEventListener('click', openMenu);
  if (closeBtn)   closeBtn.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }
})();

// ── Active nav link ───────────────────────────────────────
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Scroll-triggered animations ───────────────────────────
(function () {
  const targets = document.querySelectorAll('.animate-fade-up');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => observer.observe(el));
})();

// ── Skill bar animation ───────────────────────────────────
(function () {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const pct = bar.dataset.pct;
        bar.style.width = pct + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ── Counter animation ─────────────────────────────────────
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current  = 0;
        const step   = Math.ceil(target / 50);
        const timer  = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ── Portfolio filter ──────────────────────────────────────
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? 'flex' : 'none';
        if (match) {
          card.style.animation = 'fadeUp 0.4s ease forwards';
        }
      });
    });
  });
})();

// ── Contact form ──────────────────────────────────────────
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn    = form.querySelector('button[type="submit"]');
    const status = document.getElementById('form-status');

    // Disable button & show loading
    btn.disabled    = true;
    const originalText = btn.innerHTML;
    btn.textContent = 'Sending...';

    // -------------------------------------------------------------
    // SUPABASE INTEGRATION SETUP
    // 1. Create a Supabase project at https://supabase.com
    // 2. Go to SQL Editor and run this query to create the table:
    //    create table contacts (
    //      id bigint generated by default as identity primary key,
    //      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    //      name text,
    //      email text,
    //      subject text,
    //      message text
    //    );
    // 3. Replace the URL and KEY below with your project API details
    // -------------------------------------------------------------
    const SUPABASE_URL = 'https://mzlhrsdogrzsfdgurpvk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bGhyc2RvZ3J6c2ZkZ3VycHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjY0OTQsImV4cCI6MjA5MzQwMjQ5NH0.RDxNVKlS7Kf23mT-Vzz8peEloUFKvKpQwXfeHo5iQmM';

    const payload = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        throw new Error('Supabase URL/Key not configured. Please add them in js/main.js');
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.hint || 'Failed to send message. Check console for details.');
      }

      status.className = 'form-status success';
      status.style.color = '#10b981'; // Green for success
      status.style.background = 'rgba(16, 185, 129, 0.1)';
      status.style.border = '1px solid rgba(16, 185, 129, 0.2)';
      status.textContent = '✓ Message sent successfully! I will get back to you soon.';
      status.style.display = 'flex';
      form.reset();

    } catch (error) {
      status.className = 'form-status error';
      status.style.color = '#ef4444'; // Red for error
      status.style.background = 'rgba(239, 68, 68, 0.1)';
      status.style.border = '1px solid rgba(239, 68, 68, 0.2)';
      status.textContent = '⚠ ' + error.message;
      status.style.display = 'flex';
    }

    btn.disabled = false;
    btn.innerHTML = originalText;

    setTimeout(() => { status.style.display = 'none'; }, 6000);
  });
})();

// ── Cursor glow ───────────────────────────────────────────
(function () {
  const glow = document.createElement('div');
  glow.id    = 'cursor-glow';
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  function loop() {
    glow.style.transform = `translate(${mx}px, ${my}px)`;
    requestAnimationFrame(loop);
  }
  loop();
})();
