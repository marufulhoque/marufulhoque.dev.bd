/* =========================================================
   MD MARUFUL HAQUE — PORTFOLIO
   Main JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   1. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initYear();
  initHeader();
  initMobileNavigation();
  initTypingEffect();
  initScrollReveal();
  initActiveNavigation();
  initBackToTop();
  initProjectModal();
  initContactForm();

});


/* =========================================================
   2. CURRENT YEAR
   ========================================================= */

function initYear() {

  const yearElement = document.getElementById("year");

  if (!yearElement) return;

  yearElement.textContent = new Date().getFullYear();

}


/* =========================================================
   3. HEADER SCROLL EFFECT
   ========================================================= */

function initHeader() {

  const header = document.getElementById("site-header");

  if (!header) return;

  const updateHeader = () => {

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );

}


/* =========================================================
   4. MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

  const toggle = document.getElementById("nav-toggle");
  const navList = document.getElementById("nav-list");

  if (!toggle || !navList) return;


  function openMenu() {

    navList.classList.add("open");

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    const icon = toggle.querySelector("i");

    if (icon) {

      icon.classList.remove(
        "fa-bars"
      );

      icon.classList.add(
        "fa-xmark"
      );

    }

  }


  function closeMenu() {

    navList.classList.remove("open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    const icon = toggle.querySelector("i");

    if (icon) {

      icon.classList.remove(
        "fa-xmark"
      );

      icon.classList.add(
        "fa-bars"
      );

    }

  }


  toggle.addEventListener(
    "click",
    () => {

      const isOpen =
        navList.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    }
  );


  /* Close menu when clicking a navigation link */

  const links =
    navList.querySelectorAll("a");

  links.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        closeMenu();

      }
    );

  });


  /* Close menu when clicking outside */

  document.addEventListener(
    "click",
    event => {

      const clickedInsideNav =
        navList.contains(event.target);

      const clickedToggle =
        toggle.contains(event.target);

      if (
        !clickedInsideNav &&
        !clickedToggle
      ) {

        closeMenu();

      }

    }
  );


  /* Close menu with Escape */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        closeMenu();

        toggle.blur();

      }

    }
  );

}


/* =========================================================
   5. TYPING EFFECT
   ========================================================= */

function initTypingEffect() {

  const typingElement =
    document.getElementById("typing");

  if (!typingElement) return;


  let strings = [];

  try {

    strings = JSON.parse(
      typingElement.dataset.strings || "[]"
    );

  } catch (error) {

    console.warn(
      "Typing strings could not be parsed.",
      error
    );

  }


  if (!Array.isArray(strings) || strings.length === 0) {
    return;
  }


  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (prefersReducedMotion) {

    typingElement.textContent =
      strings[0];

    return;

  }


  let stringIndex = 0;
  let characterIndex = 0;

  let deleting = false;


  const typingSpeed = 75;
  const deletingSpeed = 40;
  const pauseAfterTyping = 1800;
  const pauseAfterDeleting = 500;


  function type() {

    const currentString =
      strings[stringIndex];


    if (!deleting) {

      characterIndex++;

      typingElement.textContent =
        currentString.slice(
          0,
          characterIndex
        );


      if (
        characterIndex >=
        currentString.length
      ) {

        deleting = true;

        setTimeout(
          type,
          pauseAfterTyping
        );

        return;

      }


      setTimeout(
        type,
        typingSpeed
      );

      return;

    }


    characterIndex--;

    typingElement.textContent =
      currentString.slice(
        0,
        characterIndex
      );


    if (characterIndex <= 0) {

      deleting = false;

      stringIndex =
        (stringIndex + 1) %
        strings.length;

      setTimeout(
        type,
        pauseAfterDeleting
      );

      return;

    }


    setTimeout(
      type,
      deletingSpeed
    );

  }


  type();

}


/* =========================================================
   6. SCROLL REVEAL
   ========================================================= */

function initScrollReveal() {

  const elements =
    document.querySelectorAll(
      ".reveal-up, .reveal-left"
    );

  if (!elements.length) return;


  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {

    elements.forEach(
      element => {
        element.classList.add(
          "is-visible"
        );
      }
    );

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );


  elements.forEach(element => {

    observer.observe(element);

  });

}


/* =========================================================
   7. ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );

  const navLinks =
    document.querySelectorAll(
      ".nav-link"
    );


  if (
    !sections.length ||
    !navLinks.length
  ) {
    return;
  }


  const linkMap = new Map();


  navLinks.forEach(link => {

    const href =
      link.getAttribute("href");

    if (
      href &&
      href.startsWith("#")
    ) {

      linkMap.set(
        href.substring(1),
        link
      );

    }

  });


  if (!("IntersectionObserver" in window)) {
    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          const id =
            entry.target.id;

          navLinks.forEach(link => {

            link.classList.remove(
              "active"
            );

          });


          const activeLink =
            linkMap.get(id);


          if (activeLink) {

            activeLink.classList.add(
              "active"
            );

          }

        });

      },
      {
        rootMargin:
          "-30% 0px -60% 0px",

        threshold: 0
      }
    );


  sections.forEach(section => {

    observer.observe(section);

  });

}


/* =========================================================
   8. BACK TO TOP
   ========================================================= */

function initBackToTop() {

  const button =
    document.getElementById(
      "back-to-top"
    );

  if (!button) return;


  const updateVisibility = () => {

    if (window.scrollY > 600) {

      button.classList.add(
        "visible"
      );

    } else {

      button.classList.remove(
        "visible"
      );

    }

  };


  updateVisibility();


  window.addEventListener(
    "scroll",
    updateVisibility,
    { passive: true }
  );


  button.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


/* =========================================================
   9. PROJECT MODAL
   ========================================================= */

function initProjectModal() {

  const modal =
    document.getElementById(
      "project-modal"
    );

  const modalTitle =
    document.getElementById(
      "modal-title"
    );

  const modalSub =
    modal?.querySelector(
      ".modal-sub"
    );

  const modalDesc =
    modal?.querySelector(
      ".modal-desc"
    );

  const modalList =
    modal?.querySelector(
      ".modal-list"
    );

  const modalVisit =
    document.getElementById(
      "modal-visit"
    );

  const closeButton =
    document.getElementById(
      "modal-close"
    );

  const closeButtonTwo =
    document.getElementById(
      "modal-close-2"
    );


  const projectCards =
    document.querySelectorAll(
      ".project-card"
    );


  if (
    !modal ||
    !projectCards.length
  ) {
    return;
  }


  /*
   * Add your actual GitHub project URLs here.
   *
   * Replace the example URLs with your real repositories.
   */

  const projects = {

    "1": {
      title:
        "Premium Portfolio Website",

      subtitle:
        "Portfolio Website — HTML, CSS, JavaScript",

      description:
        "A premium personal portfolio website designed around minimal editorial aesthetics, refined typography, responsive layouts and smooth interactions.",

      role:
        "Designer & Frontend Developer",

      tech:
        "HTML, CSS, JavaScript",

      time:
        "Personal Project",

      github:
        "https://github.com/MUHIB-143"

    },


    "2": {
      title:
        "Python Django Web Application",

      subtitle:
        "Full-Stack Web Application — Python & Django",

      description:
        "A structured full-stack web application prototype developed with Python and Django, focusing on clean architecture, accessibility and usability.",

      role:
        "Full-Stack Developer",

      tech:
        "Python, Django, HTML, CSS",

      time:
        "Personal Project",

      github:
        "https://github.com/MUHIB-143"

    },


    "3": {
      title:
        "Flutter Mobile Application",

      subtitle:
        "Cross-Platform Mobile Application — Flutter",

      description:
        "A cross-platform mobile application created with Flutter, focusing on a clean user experience, responsive layouts and polished interface design.",

      role:
        "Flutter Developer",

      tech:
        "Flutter, Dart, UX",

      time:
        "Personal Project",

      github:
        "https://github.com/MUHIB-143"

    }

  };


  let previouslyFocusedElement = null;


  function openModal(projectId) {

    const project =
      projects[projectId];


    if (!project) {
      return;
    }


    previouslyFocusedElement =
      document.activeElement;


    if (modalTitle) {

      modalTitle.textContent =
        project.title;

    }


    if (modalSub) {

      modalSub.textContent =
        project.subtitle;

    }


    if (modalDesc) {

      modalDesc.textContent =
        project.description;

    }


    if (modalList) {

      modalList.innerHTML = `
        <li>
          <strong>Role:</strong>
          ${escapeHTML(project.role)}
        </li>

        <li>
          <strong>Tech:</strong>
          ${escapeHTML(project.tech)}
        </li>

        <li>
          <strong>Time:</strong>
          ${escapeHTML(project.time)}
        </li>
      `;

    }


    if (modalVisit) {

      modalVisit.href =
        project.github;

    }


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    requestAnimationFrame(() => {

      closeButton?.focus();

    });

  }


  function closeModal() {

    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    if (
      previouslyFocusedElement &&
      typeof previouslyFocusedElement.focus ===
        "function"
    ) {

      previouslyFocusedElement.focus();

    }

  }


  projectCards.forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const projectId =
          card.dataset.project;

        openModal(projectId);

      }
    );


    card.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          const projectId =
            card.dataset.project;

          openModal(projectId);

        }

      }
    );

  });


  closeButton?.addEventListener(
    "click",
    closeModal
  );


  closeButtonTwo?.addEventListener(
    "click",
    closeModal
  );


  /*
   * Close when clicking outside
   */

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeModal();

      }

    }
  );


  /*
   * Escape key
   */

  document.addEventListener(
    "keydown",
    event => {

      const isOpen =
        modal.getAttribute(
          "aria-hidden"
        ) === "false";


      if (
        isOpen &&
        event.key === "Escape"
      ) {

        closeModal();

      }

    }
  );

}


/* =========================================================
   10. HTML ESCAPE HELPER
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   11. CONTACT FORM
   ========================================================= */

function initContactForm() {

  const form =
    document.getElementById(
      "contact-form"
    );

  if (!form) return;


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        document.getElementById(
          "name"
        )?.value.trim();


      const email =
        document.getElementById(
          "email"
        )?.value.trim();


      const message =
        document.getElementById(
          "message"
        )?.value.trim();


      if (
        !name ||
        !email ||
        !message
      ) {

        showFormMessage(
          "Please fill in all fields."
        );

        return;

      }


      if (!isValidEmail(email)) {

        showFormMessage(
          "Please enter a valid email address."
        );

        return;

      }


      /*
       * Since this is a static website,
       * we create a mailto link instead
       * of pretending the form has a backend.
       */

      const subject =
        encodeURIComponent(
          `Portfolio message from ${name}`
        );


      const body =
        encodeURIComponent(
          `Name: ${name}\n\nEmail: ${email}\n\nMessage:\n${message}`
        );


      const mailto =
        `mailto:mhmuhib143@gmail.com?subject=${subject}&body=${body}`;


      window.location.href =
        mailto;


      showFormMessage(
        "Opening your email application..."
      );

    }
  );

}


/* =========================================================
   12. EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

  const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return pattern.test(email);

}


/* =========================================================
   13. FORM MESSAGE
   ========================================================= */

function showFormMessage(message) {

  const form =
    document.getElementById(
      "contact-form"
    );

  if (!form) return;


  let messageElement =
    document.getElementById(
      "form-status"
    );


  if (!messageElement) {

    messageElement =
      document.createElement("p");

    messageElement.id =
      "form-status";

    messageElement.className =
      "form-note small";


    form.appendChild(
      messageElement
    );

  }


  messageElement.textContent =
    message;

}


/* =========================================================
   14. SMOOTH ANCHOR NAVIGATION
   ========================================================= */

function initSmoothAnchors() {

  const anchors =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  anchors.forEach(anchor => {

    anchor.addEventListener(
      "click",
      event => {

        const href =
          anchor.getAttribute(
            "href"
          );


        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            href
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });

}


/* =========================================================
   15. IMAGE ERROR HANDLING
   ========================================================= */

function initImageFallbacks() {

  const images =
    document.querySelectorAll(
      "img"
    );


  images.forEach(image => {

    image.addEventListener(
      "error",
      () => {

        image.classList.add(
          "image-error"
        );

        console.warn(
          `Image could not be loaded: ${image.src}`
        );

      }
    );

  });

}


/* =========================================================
   16. INITIALIZE OPTIONAL FEATURES
   ========================================================= */

initSmoothAnchors();
initImageFallbacks();


/* =========================================================
   END OF FILE
   ========================================================= */
