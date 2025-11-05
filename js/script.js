// Rockback Media - Main JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('header')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Header scroll effect
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Active navigation link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage.includes('services') && linkPage.includes('services')) ||
        (currentPage.includes('projects') && linkPage.includes('projects'))) {
      link.classList.add('active');
    }
  });

  // Form validation and submission
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Basic validation
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#FF00FF';
        } else {
          field.style.borderColor = '#00FF9D';
        }
      });

      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          isValid = false;
          emailField.style.borderColor = '#FF00FF';
        }
      }

      if (isValid) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-black border-2 border-[#00FF9D] text-white px-8 py-4 rounded-lg z-50';
        successMessage.innerHTML = '<p class="font-semibold">✓ Thank you! We\'ll be in touch soon.</p>';
        successMessage.style.boxShadow = '0 0 30px rgba(0, 255, 157, 0.3)';
        document.body.appendChild(successMessage);

        // Reset form
        form.reset();
        requiredFields.forEach(field => {
          field.style.borderColor = '#333';
        });

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);

        console.log('Form submitted:', data);
      }
    });

    // Reset border color on input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(255, 0, 255)') {
          this.style.borderColor = '#333';
        }
      });
    });
  });

  // Lazy loading for images
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('loading-image');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Client logo slider (if exists on page)
  const clientSlider = document.querySelector('.client-slider');
  if (clientSlider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    clientSlider.addEventListener('mousedown', (e) => {
      isDown = true;
      clientSlider.style.cursor = 'grabbing';
      startX = e.pageX - clientSlider.offsetLeft;
      scrollLeft = clientSlider.scrollLeft;
    });

    clientSlider.addEventListener('mouseleave', () => {
      isDown = false;
      clientSlider.style.cursor = 'grab';
    });

    clientSlider.addEventListener('mouseup', () => {
      isDown = false;
      clientSlider.style.cursor = 'grab';
    });

    clientSlider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - clientSlider.offsetLeft;
      const walk = (x - startX) * 2;
      clientSlider.scrollLeft = scrollLeft - walk;
    });
  }

  // Lightbox for project galleries
  const galleryImages = document.querySelectorAll('.gallery-image');

  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      const lightbox = document.createElement('div');
      lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
      lightbox.onclick = function() { this.remove(); };

      const lightboxImg = document.createElement('img');
      lightboxImg.src = this.src;
      lightboxImg.className = 'max-w-full max-h-full object-contain';
      lightboxImg.onclick = function(e) { e.stopPropagation(); };

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.className = 'absolute top-4 right-4 text-white text-4xl hover:text-[#00FF9D] transition-colors';
      closeBtn.onclick = function() { lightbox.remove(); };

      lightbox.appendChild(lightboxImg);
      lightbox.appendChild(closeBtn);
      document.body.appendChild(lightbox);
    });
  });

  // Scroll reveal animations (simple fade-in)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
  });
});

// Utility function to get current year for copyright
function updateCopyrightYear() {
  const yearElements = document.querySelectorAll('.copyright-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

updateCopyrightYear();
