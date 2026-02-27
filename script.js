/* =====================================================
   HREDOY PORTFOLIO — script.js
   Features:
   1. Preloader
   2. Navbar scroll effect + active link highlight
   3. Smooth scroll
   4. Scroll-to-top button
   5. Animated counter (stats)
   6. Skill bars animation (IntersectionObserver)
   7. Scroll reveal / fade-in animations
   8. Portfolio filter
   9. Testimonial slider (auto + manual)
   10. Contact form validation
   11. Typed text effect (hero name)
   12. Navbar mobile close on link click
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. PRELOADER ── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  });

  /* ── 2. NAVBAR SCROLL EFFECT ── */
  const navbar = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
    toggleScrollTopBtn();
  });

  /* ── 3. ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.btn-contact)');

  function updateActiveNavLink() {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active-link');
      }
    });
  }

  /* ── 4. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 5. SCROLL-TO-TOP BUTTON ── */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  function toggleScrollTopBtn() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 6. NAVBAR MOBILE — CLOSE ON LINK CLICK ── */
  const navCollapse = document.getElementById('navMenu');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  /* ── 7. ANIMATED COUNTER (stats) ── */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1400;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current);
        }, 16);
      });
    }
  }
  window.addEventListener('scroll', startCounters);
  startCounters(); // run immediately in case already in view

  /* ── 8. SKILL BARS — INTERSECTION OBSERVER ── */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(bar => skillObserver.observe(bar));

  /* ── 9. SCROLL REVEAL ANIMATIONS ── */
  const revealElements = document.querySelectorAll(
    '.process-card, .portfolio-card, .blog-card, .service-list-card, .about-card, .contact-card, .stat-box'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger each element slightly
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  /* ── 10. PORTFOLIO FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          // re-trigger reveal animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── 11. TESTIMONIAL SLIDER ── */
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('#testiDots .dot');
  let currentSlide = 0;
  let autoSlideTimer;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => { d.classList.remove('active-dot'); d.classList.add('inactive'); d.style.width = '6px'; });

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.remove('inactive');
    dots[currentSlide].classList.add('active-dot');
    dots[currentSlide].style.width = '24px';
  }

  // dot click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.getAttribute('data-index')));
      resetAutoSlide();
    });
  });

  // prev / next buttons
  document.getElementById('testiPrev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
    resetAutoSlide();
  });
  document.getElementById('testiNext').addEventListener('click', () => {
    showSlide(currentSlide + 1);
    resetAutoSlide();
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }
  startAutoSlide();

  /* ── 12. CONTACT FORM VALIDATION ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // helper
      function validate(fieldId, errorId, condition) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (!condition(field.value.trim())) {
          error.classList.add('show');
          field.style.borderBottomColor = '#ef4444';
          isValid = false;
        } else {
          error.classList.remove('show');
          field.style.borderBottomColor = '#7c3aed';
        }
      }

      validate('f-name',    'err-name',    v => v.length >= 2);
      validate('f-email',   'err-email',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      validate('f-budget',  'err-budget',  v => v.length >= 1);
      validate('f-subject', 'err-subject', v => v.length >= 2);
      validate('f-message', 'err-message', v => v.length >= 10);

      if (isValid) {
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

        // Simulate async send
        setTimeout(() => {
          btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Message Sent!';
          btn.style.background = '#16a34a';
          document.getElementById('form-success').style.display = 'block';
          contactForm.reset();

          // Reset button after 4s
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = 'Send Message <i class="bi bi-send-fill"></i>';
            btn.style.background = '';
            document.getElementById('form-success').style.display = 'none';
          }, 4000);
        }, 1800);
      }
    });

    // Clear error on input
    ['f-name','f-email','f-budget','f-subject','f-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          el.style.borderBottomColor = '#e5e7eb';
          const errEl = document.getElementById('err-' + id.replace('f-',''));
          if (errEl) errEl.classList.remove('show');
        });
      }
    });
  }

  /* ── 13. TYPED TEXT EFFECT (Hero name) ── */
  const typedEl = document.getElementById('typed-name');
  if (typedEl) {
    const fullName = typedEl.textContent;
    typedEl.textContent = '';
    let charIndex = 0;
    // Wait for hero fade-in before typing
    setTimeout(() => {
      const typeTimer = setInterval(() => {
        if (charIndex < fullName.length) {
          typedEl.textContent += fullName.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeTimer);
        }
      }, 60);
    }, 900);
  }

  /* ── 14. SERVICE CARD CLICK ACTIVE ── */
  document.querySelectorAll('.service-list-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-list-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  /* ── 15. TOOLTIP on social icons ── */
  const tooltipTriggers = document.querySelectorAll('[title]');
  tooltipTriggers.forEach(el => {
    new bootstrap.Tooltip(el, { trigger: 'hover', placement: 'top' });
  });

}); // end DOMContentLoaded
