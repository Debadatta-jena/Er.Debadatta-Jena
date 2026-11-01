/**
 * ============================================================================
 * ER. DEBADATTAA JENA — EXECUTIVE PORTFOLIO INTERACTION ENGINE
 * Zero-dependency, 60fps high-performance runtime
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorSpotlight();
  initFluidHeroCanvas();
  initScrollProgress();
  initNavbarBehavior();
  initHeroTyping();
  initScrollReveal();
  initTiltGlare();
  initProjectFilters();
  initCollapsiblePanels();
  initWhatsAppTerminal();
  initChatbot();
  initScrollToTop();
});

/* ----------------------------------------------------------------------------
 * 1. DYNAMIC CURSOR SPOTLIGHT
 * ---------------------------------------------------------------------------- */
function initCursorSpotlight() {
  const spotlight = document.getElementById('cursorSpotlight');
  if (!spotlight || window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let curX = mouseX;
  let curY = mouseY;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(updateSpotlight);
  });

  function updateSpotlight() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    spotlight.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;

    if (Math.abs(mouseX - curX) > 0.1 || Math.abs(mouseY - curY) > 0.1) {
      rafId = requestAnimationFrame(updateSpotlight);
    } else {
      rafId = null;
    }
  }
}

/* ----------------------------------------------------------------------------
 * 2. FLUID AI PARTICLE CONSTELLATION CANVAS
 * ---------------------------------------------------------------------------- */
function initFluidHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: -1000, y: -1000, radius: 140 };
  let animId = null;
  let isVisible = true;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle repel
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 2;
        this.y -= (dy / dist) * force * 2;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(165, 180, 252, ${this.alpha})`;
      ctx.fill();
    }
  }

  const count = Math.min(75, Math.floor((width * height) / 16000));
  const particles = Array.from({ length: count }, () => new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 125) {
          const alpha = (1 - dist / 125) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawLines();
    if (isVisible) {
      animId = requestAnimationFrame(render);
    }
  }
  render();

  // Pause off-screen to preserve battery & CPU
  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !animId) {
      render();
    } else if (!isVisible && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });

  const heroSection = document.getElementById('home');
  if (heroSection) observer.observe(heroSection);
}

/* ----------------------------------------------------------------------------
 * 3. READING PROGRESS BAR
 * ---------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ----------------------------------------------------------------------------
 * 4. NAVBAR BEHAVIOR & ACTIVE SECTION HIGHLIGHT
 * ---------------------------------------------------------------------------- */
function initNavbarBehavior() {
  const navbar = document.querySelector('.site-nav');
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header blur/solidify on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Active link tracker on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + 180;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

/* ----------------------------------------------------------------------------
 * 5. HERO TYPING EFFECT
 * ---------------------------------------------------------------------------- */
function initHeroTyping() {
  const el = document.getElementById('heroTypedText');
  if (!el) return;

  const phrases = [
    "Founder & CEO at PRYONX & CLYVEXA",
    "AI Architect & Systems Engineer",
    "Custom AI Solutions & Intelligent Automation",
    "AI Voice Agents & Full-Stack Engineering"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 50;

  function typeCycle() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2200; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(typeCycle, typingSpeed);
  }

  setTimeout(typeCycle, 500);
}

/* ----------------------------------------------------------------------------
 * 6. SCROLL REVEAL (INTERSECTION OBSERVER)
 * ---------------------------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  items.forEach((item, idx) => {
    item.style.setProperty('--delay', `${(idx % 4) * 0.08}s`);
    observer.observe(item);
  });
}

/* ----------------------------------------------------------------------------
 * 7. 3D TILT & SPECULAR GLARE
 * ---------------------------------------------------------------------------- */
function initTiltGlare() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ----------------------------------------------------------------------------
 * 8. PROJECT CATEGORY FILTERS
 * ---------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-item-card-wrapper');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ----------------------------------------------------------------------------
 * 9. COLLAPSIBLE PANELS (PROJECT SPECS & CERTIFICATIONS)
 * ---------------------------------------------------------------------------- */
function initCollapsiblePanels() {
  // Project specs toggle
  document.querySelectorAll('.btn-toggle-specs').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const isOpen = panel.classList.toggle('open');
      btn.innerHTML = isOpen
        ? '<span>Hide Architecture Specs</span> <i class="fas fa-chevron-up"></i>'
        : '<span>View Architecture Specs</span> <i class="fas fa-chevron-down"></i>';
    });
  });

  // All certifications toggle
  const certsToggleBtn = document.getElementById('toggleAllCertsBtn');
  const certsPanel = document.getElementById('allCertsShelf');

  if (certsToggleBtn && certsPanel) {
    certsToggleBtn.addEventListener('click', () => {
      const isOpen = certsPanel.classList.toggle('open');
      certsToggleBtn.innerHTML = isOpen
        ? '<i class="fas fa-chevron-up"></i> Collapse Certifications'
        : '<i class="fas fa-certificate"></i> View All 20+ Verified Certifications';
    });
  }
}

/* ----------------------------------------------------------------------------
 * 10. DIRECT WHATSAPP CONSULTATION HANDLER
 * ---------------------------------------------------------------------------- */
function initWhatsAppTerminal() {
  // Quick chip click handlers: launch WhatsApp directly with prefilled message
  document.querySelectorAll('.whatsapp-chip-btn').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const msg = chip.getAttribute('data-msg');
      if (msg) {
        e.preventDefault();
        const waUrl = `https://wa.me/917683886320?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* ----------------------------------------------------------------------------
 * 11. SCROLL-TO-TOP BUTTON
 * ---------------------------------------------------------------------------- */
function initScrollToTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------------------------------------------
 * 12. STATIC FAQ CHATBOT (click-to-answer · fully client-side · no backend)
 *   All content is scripted below. Nothing a visitor taps is sent anywhere —
 *   no network calls, no storage, resets on refresh.
 * ---------------------------------------------------------------------------- */
function initChatbot() {
  const toggle = document.getElementById('chatbotToggle');
  const panel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const body = document.getElementById('chatbotBody');
  const quick = document.getElementById('chatbotQuick');
  if (!toggle || !panel || !closeBtn || !body || !quick) return;

  const TOPICS = [
    {
      icon: '👤', name: 'About me',
      questions: [
        { q: 'Who is Er. Debadattaa Jena?', a: "I'm an AI & Machine Learning developer, Python full-stack engineer, and cyber-security practitioner — and the Founder & CEO of <a href='#ventures'>PRYONX and CLYVEXA</a>. I build practical, production-ready AI that solves real business problems." },
        { q: 'What do you specialize in?', a: 'Custom AI solutions, intelligent automation, AI voice agents, and full-stack web & mobile platforms — grounded in secure, scalable backend engineering.' },
        { q: 'Where are you based?', a: 'Bhubaneswar, Odisha, India — working remote-first with clients everywhere.' }
      ]
    },
    {
      icon: '🚀', name: 'My ventures',
      questions: [
        { q: 'What is PRYONX?', a: "PRYONX is my AI company — “Your Business Problem. Our AI Solution.” We build custom AI solutions, intelligent automation, AI-powered products, and AI voice agents, designed around real business requirements (problem-first, not AI-first). <a href='https://pryonx.in' target='_blank' rel='noopener noreferrer'>pryonx.in</a>" },
        { q: 'What is CLYVEXA?', a: "CLYVEXA — “Code. Create. Elevate.” — is an AI & software studio delivering conversational AI, autonomous agents, and modern web, mobile, and cloud platforms. <a href='https://clyvexa-ten.vercel.app' target='_blank' rel='noopener noreferrer'>clyvexa.tech</a>" }
      ]
    },
    {
      icon: '🛠️', name: 'What I build',
      questions: [
        { q: 'What services do you offer?', a: 'AI Automation, Custom AI Solutions, AI Product Development, AI Voice Agents & Integration — plus full-stack web/mobile apps, ERP/CRM business systems, and backend & cybersecurity architecture. See <a href="#services">Capabilities</a>.' },
        { q: 'Can you build an AI voice agent?', a: 'Yes — inbound/outbound AI voice agents that answer calls 24/7, qualify leads, book appointments, and route conversations, with sub-180ms response targets.' },
        { q: 'What are some systems you have built?', a: 'Flagship projects include <strong>BusinessMate</strong> (an AI-powered ERP/CRM for MSMEs), computer-vision attendance systems, and desktop voice assistants. Browse them under <a href="#projects">Engineered Systems</a>.' }
      ]
    },
    {
      icon: '⚙️', name: 'How I work',
      questions: [
        { q: 'How do you work on a project?', a: 'A six-step process: Discover → Analyze → Design → Build → Deploy → Improve. I start with your business problem, then choose the right technology — even if that means no AI at all.' },
        { q: 'Do you offer a free consultation?', a: 'Yes. Sharing your problem and the initial assessment are free — you get clarity on whether AI is even the right answer for you.' }
      ]
    },
    {
      icon: '🎓', name: 'Experience',
      questions: [
        { q: 'What is your experience?', a: 'Full-Stack & Voice AI Engineer at StaxTech, AI/ML roles at 3Skill Training, an AI Solutions developer on the Microsoft Initiative + Edunet + AICTE, a cybersecurity audit at Edureka, and Python full-stack work at Seeree Services — plus 20+ certifications. Full detail in <a href="#experience">Experience</a>.' },
        { q: 'What are your tech skills?', a: 'Python, Django, React, Node.js, PostgreSQL/MySQL/MongoDB, TensorFlow, scikit-learn, NLP, Azure AI, REST APIs, Linux, and cyber-security.' }
      ]
    },
    {
      icon: '💬', name: 'Work with me',
      questions: [
        { q: 'How do I start a project with you?', a: "Easy — tap the green WhatsApp button (bottom-right) to start a chat instantly, or email <a href='mailto:info@pryonx.in'>info@pryonx.in</a>." },
        { q: 'How can I contact you?', a: "WhatsApp: <a href='https://wa.me/917683886320' target='_blank' rel='noopener noreferrer'>+91 7683 886 320</a> · Email: <a href='mailto:debdebadatta7@gmail.com'>debdebadatta7@gmail.com</a> · <a href='https://www.linkedin.com/in/er-debadattaa-jena-a13a72300/' target='_blank' rel='noopener noreferrer'>LinkedIn</a>" }
      ]
    }
  ];

  let isOpen = false;

  function addMsg(role, content) {
    const div = document.createElement('div');
    div.className = 'cb-msg ' + (role === 'user' ? 'cb-user' : 'cb-bot');
    if (role === 'user') {
      div.textContent = content;
    } else {
      div.innerHTML = content;
    }
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function renderQuick(items) {
    quick.innerHTML = '';
    items.forEach(it => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cb-chip';
      btn.textContent = it.label;
      btn.addEventListener('click', it.onClick);
      quick.appendChild(btn);
    });
  }

  function renderHome() {
    body.innerHTML = '';
    addMsg('bot', "<p>Hi! I'm the DJ Assistant 👋 — I can answer quick questions about me and my work. Nothing you tap leaves your browser. Pick a topic:</p>");
    renderQuick(TOPICS.map(t => ({ label: t.icon + ' ' + t.name, onClick: () => renderTopic(t) })));
  }

  function renderTopic(t) {
    addMsg('bot', '<p>' + t.name + ' — pick a question:</p>');
    const chips = t.questions.map(q => ({ label: q.q, onClick: () => answer(t, q) }));
    chips.push({ label: '← Back to topics', onClick: renderHome });
    renderQuick(chips);
  }

  function answer(t, q) {
    addMsg('user', q.q);
    addMsg('bot', '<p>' + q.a + '</p>');
    const chips = t.questions.filter(x => x !== q).map(x => ({ label: x.q, onClick: () => answer(t, x) }));
    chips.push({ label: '🏠 Topics', onClick: renderHome });
    renderQuick(chips);
  }

  function setOpen(state) {
    isOpen = state;
    panel.classList.toggle('open', state);
    toggle.classList.toggle('active', state);
    toggle.setAttribute('aria-expanded', String(state));
    panel.setAttribute('aria-hidden', String(!state));
    if (state) {
      renderHome();
      closeBtn.focus();
    } else {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => setOpen(!isOpen));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });
}
