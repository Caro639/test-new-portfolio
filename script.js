// ===== ENREGISTRER LES PLUGINS GSAP =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== FONCTION POUR DIVISER LE TEXTE EN LETTRES =====
function splitTextToChars(element) {
  // Traiter chaque mot séparément pour préserver les retours à la ligne
  const words = element.querySelectorAll(".word");

  words.forEach((word) => {
    const text = word.textContent.trim();
    word.innerHTML = "";

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char;
      word.appendChild(span);
    });
  });
}

// ===== ANIMATION DU TEXTE =====
function animateHeroText() {
  const heroTitle = document.getElementById("heroTitle");

  // Diviser le texte en lettres individuelles (ligne par ligne)
  splitTextToChars(heroTitle);

  const chars = document.querySelectorAll(".hero-title .char");

  // Animation d'apparition de chaque lettre avec effet 3D subtil
  gsap.to(chars, {
    duration: 1,
    opacity: 1,
    y: 0,
    rotationX: 0,
    ease: "power3.out",
    stagger: {
      each: 0.03,
      from: "start",
    },
    onComplete: () => {
      // Une fois les lettres animées, positionner et animer l'étoile
      animateFloatingStar();

      // Activer le menu sticky maintenant que l'animation est terminée
      enableStickyMenu();
    },
  });

  // Effet de hover sur les lettres au survol
  chars.forEach((char) => {
    char.addEventListener("mouseenter", () => {
      gsap.to(char, {
        y: -10,
        color: "#ad45c6",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    char.addEventListener("mouseleave", () => {
      gsap.to(char, {
        y: 0,
        color: "#ffffff",
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

// ===== ANIMATIONS SCROLLTRIGGER =====
function setupScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Animation des titres de section
  gsap.utils.toArray(".section-title").forEach((title) => {
    gsap.to(title, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none none",
      },
    });
  });

  // Animation section À propos
  gsap.to(".about-text", {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  gsap.to(".about-stats", {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-stats",
      start: "top 75%",
      toggleActions: "play none none none",
      onEnter: () => animateCounters(),
    },
  });

  // Animation des projets avec effet "mesmerising"
  gsap.utils.toArray(".project-item").forEach((item, index) => {
    const imageReveal = item.querySelector(".project-reveal-image");
    const content = item.querySelector(".project-content");
    const number = item.querySelector(".project-number");

    // Timeline pour chaque projet
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 70%",
        end: "top 20%",
        scrub: 1,
        // markers: true,
      },
    });

    // Animation de révélation de l'image avec clip-path
    tl.to(imageReveal, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "power2.inOut",
    })
      // Animation du contenu en parallèle
      .from(
        content,
        {
          opacity: 0,
          x: index % 2 === 0 ? 50 : -50,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.5"
      )
      // Animation du numéro
      .from(
        number,
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.8"
      );
  });

  // Animation horizontale des compétences au scroll (uniquement desktop)
  const skillsContainer = document.querySelector(
    ".skills-horizontal-container"
  );
  const skillsWrapper = document.querySelector(".skills-horizontal-wrapper");
  const isDesktop = window.innerWidth > 768;

  if (skillsContainer && skillsWrapper && isDesktop) {
    // Calculer la largeur totale du container
    const getScrollAmount = () => {
      const containerWidth = skillsContainer.scrollWidth;
      const wrapperWidth = skillsWrapper.offsetWidth;
      return -(containerWidth - wrapperWidth);
    };

    // Animation de scroll horizontal
    const skillsScrollTrigger = gsap.to(skillsContainer, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        id: "skills-horizontal",
        trigger: ".skills-section",
        start: "top top",
        end: () => `+=${skillsContainer.scrollWidth * 0.4}`,
        pin: true,
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });

    // Animation des cartes individuelles au scroll
    gsap.utils.toArray(".skill-card").forEach((card, index) => {
      // Rotation légère et scale au passage (desktop uniquement)
      gsap.fromTo(
        card,
        {
          rotateY: 15,
          opacity: 0.6,
          scale: 0.9,
        },
        {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById(
              ScrollTrigger.getAll().find(
                (st) => st.vars.trigger === ".skills-section"
              )
            ),
            start: "left center",
            end: "right center",
            scrub: 1,
          },
        }
      );
    });
  } else if (skillsContainer) {
    // Animations modernes pour mobile : fade-in + slide-up
    gsap.utils.toArray(".skill-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }

  // Animation du ver dans la section contact
  const pathContact = document.getElementById("wormPathContact");
  const circleContact = document.getElementById("movingCircleContact");
  const wormWrapContact = document.querySelector(".worm-wrap-contact");
  const svgContact = document.querySelector(".worm-path-svg-contact");

  if (pathContact && circleContact && wormWrapContact && svgContact) {
    const pathLength = pathContact.getTotalLength();
    const viewBox = svgContact.viewBox.baseVal;

    gsap.to(circleContact, {
      scrollTrigger: {
        trigger: wormWrapContact,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        toggleActions: "play none none reset",
        onUpdate: (self) => {
          const progress = self.progress;
          const point = pathContact.getPointAtLength(progress * pathLength);

          // Recalculer à chaque frame pour avoir la position actuelle
          const currentSvgRect = svgContact.getBoundingClientRect();
          const scaleX = currentSvgRect.width / viewBox.width;
          const scaleY = currentSvgRect.height / viewBox.height;

          const realX = currentSvgRect.left + point.x * scaleX;
          const realY = currentSvgRect.top + point.y * scaleY;

          let opacity = 0;
          let circleScale = 1;
          let holeOpacity = 0;
          let holeScale = 1;

          // Masquer complètement si hors de la zone
          if (progress <= 0 || progress >= 1) {
            opacity = 0;
            holeOpacity = 0;
          } else if (progress < 0.25) {
            opacity = progress / 0.25;
            holeOpacity = 0;
          } else if (progress > 0.75) {
            // Phase de disparition : le trou apparaît et le cercle rétrécit
            const fadeProgress = (progress - 0.75) / 0.25;
            opacity = 1 - fadeProgress;
            circleScale = 1 - fadeProgress * 0.5; // Le cercle rétrécit de 50%
            holeOpacity = fadeProgress * 0.8; // Le trou apparaît progressivement
            holeScale = 1 + fadeProgress * 1.5; // Le trou grandit de 150%
          } else {
            opacity = 1;
            holeOpacity = 0;
          }

          console.log("Position:", { realX, realY, progress, opacity });

          // Animer le cercle
          gsap.set(circleContact, {
            left: realX + "px",
            top: realY + "px",
            rotation: progress * 360 * 2,
            opacity: opacity,
            scale: circleScale,
            display: opacity > 0 ? "block" : "none",
            visibility: opacity > 0 ? "visible" : "hidden",
          });

          // Animer le trou noir
          const blackHole = document.getElementById("blackHole");
          if (blackHole && holeOpacity > 0) {
            gsap.set(blackHole, {
              left: realX + "px",
              top: realY + "px",
              opacity: holeOpacity,
              scale: holeScale,
              display: "block",
              visibility: "visible",
            });
          } else if (blackHole) {
            gsap.set(blackHole, {
              display: "none",
              visibility: "hidden",
            });
          }
        },
        onLeave: () => gsap.set(circleContact, { opacity: 0, display: "none" }),
        onEnterBack: () => gsap.set(circleContact, { display: "block" }),
        onLeaveBack: () =>
          gsap.set(circleContact, { opacity: 0, display: "none" }),
      },
    });
  }

  // Bouton retour en haut
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (scrollToTopBtn) {
    // Afficher/masquer le bouton au scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    });

    // Retour en haut au clic
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Animation section contact
  gsap.to(".contact-info", {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-info",
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  gsap.to(".contact-form", {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });

  // Parallaxe sur le hero au scroll
  gsap.to(".hero-title", {
    y: 200,
    opacity: 0.3,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.to(".floating-star", {
    y: 150,
    rotation: 720,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

// ===== ANIMATION DES COMPTEURS =====
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2;

    gsap.to(counter, {
      innerHTML: target,
      duration: duration,
      ease: "power2.out",
      snap: { innerHTML: 1 },
      onUpdate: function () {
        counter.innerHTML = Math.ceil(counter.innerHTML);
      },
    });
  });
}

// ===== SMOOTH SCROLL POUR NAVIGATION =====
function setupSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        // Offset adapté selon la section
        const offset = target.id === "skills" ? 0 : 80;

        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: target,
            offsetY: offset,
          },
          ease: "power3.inOut",
        });
      }
    });
  });
}

// ===== ANIMATION DU CERCLE 3D LE LONG DU VER =====
function animateWormPath() {
  const path = document.getElementById("wormPath");
  const circle = document.getElementById("movingCircle");
  const section = document.querySelector(".worm-animation-section");
  const svg = document.querySelector(".worm-path-svg");

  if (!path || !circle || !section || !svg) {
    console.log("Éléments manquants:", { path, circle, section, svg });
    return;
  }

  const pathLength = path.getTotalLength();
  const viewBox = svg.viewBox.baseVal;

  gsap.to(circle, {
    scrollTrigger: {
      trigger: section,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        // Calculer la position le long du chemin
        const progress = self.progress;
        const point = path.getPointAtLength(progress * pathLength);

        // Recalculer les échelles à chaque frame pour supporter le redimensionnement
        const currentSvgRect = svg.getBoundingClientRect();
        const scaleX = currentSvgRect.width / viewBox.width;
        const scaleY = currentSvgRect.height / viewBox.height;

        // Convertir les coordonnées SVG en coordonnées absolues de la page
        const realX = currentSvgRect.left + point.x * scaleX;
        const realY = currentSvgRect.top + point.y * scaleY;

        // Calculer l'opacity en fonction de la progression
        // Disparaît aux extrémités (0-10% et 90-100%)
        let opacity = 1;
        if (progress < 0.1) {
          opacity = progress / 0.1; // Fade in
        } else if (progress > 0.9) {
          opacity = (1 - progress) / 0.1; // Fade out
        }

        // Positionner le cercle (centré sur le point)
        gsap.set(circle, {
          left: realX + "px",
          top: realY + "px",
          xPercent: -50,
          yPercent: -50,
          rotation: progress * 360 * 2,
          opacity: opacity,
          display: "block",
        });
      },
      onLeave: () => gsap.set(circle, { opacity: 0, display: "none" }),
      onEnterBack: () => gsap.set(circle, { opacity: 1, display: "block" }),
      onLeaveBack: () => gsap.set(circle, { opacity: 0, display: "none" }),
    },
  });
}

// ===== ANIMATION DES ÉLÉMENTS FLOTTANTS =====
function animateFloatingElements() {
  const floatGlobe = document.querySelector(".float-globe");
  const circle1 = document.querySelector(".circle-1");
  const circle2 = document.querySelector(".circle-2");
  const shapeO = document.querySelector(".float-shape");

  // Timeline pour les éléments flottants
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onEnter: () => {
        // Animer l'apparition des éléments
        gsap.to([floatGlobe, circle1, circle2, shapeO], {
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        });
      },
    },
  });

  // Animation du globe - déplacement horizontal
  gsap.to(floatGlobe, {
    x: "120vw",
    rotation: 360,
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
  });

  // Animation cercle 1 - déplacement diagonal
  gsap.to(circle1, {
    x: "-120vw",
    y: -200,
    rotation: 180,
    scale: 1.5,
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
  });

  // Animation cercle 2 - déplacement vertical
  gsap.to(circle2, {
    y: 400,
    x: -100,
    scale: 0.5,
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
  });

  // Animation du O - rotation et déplacement
  gsap.to(shapeO, {
    x: -300,
    y: 500,
    rotation: 720,
    scale: 0.5,
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
    },
  });
}

// ===== CURSEUR PERSONNALISÉ AVEC EFFET NÉON =====
function initCustomCursor() {
  // Désactiver le curseur personnalisé sur les appareils tactiles
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    console.log("Appareil tactile détecté - curseur personnalisé désactivé");
    return;
  }

  console.log("Initialisation du curseur personnalisé...");

  // Créer les éléments du curseur avec effet 3D
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.style.cssText =
    "position: fixed; width: 28px; height: 28px; border-radius: 50%; pointer-events: none; z-index: 99999; " +
    "background: radial-gradient(circle at 30% 30%, #ff69d4, #ad45c6 40%, #8a2be2 70%, #4b0082); " +
    "box-shadow: 0 0 20px rgba(173, 69, 198, 1), 0 0 40px rgba(173, 69, 198, 0.6), " +
    "inset -5px -5px 10px rgba(0, 0, 0, 0.5), inset 5px 5px 10px rgba(255, 255, 255, 0.3); " +
    "opacity: 1; transition: transform 0.2s ease;";

  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  cursorGlow.style.cssText =
    "position: fixed; width: 180px; height: 180px; background: radial-gradient(circle, rgba(173, 69, 198, 0.18) 0%, transparent 70%); border-radius: 50%; pointer-events: none; z-index: 99998; mix-blend-mode: screen; opacity: 1;";

  document.body.appendChild(cursor);
  document.body.appendChild(cursorGlow);

  console.log("Éléments curseur créés:", cursor, cursorGlow);

  // Variables pour suivi fluide de la souris
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Capturer la position de la souris
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Utiliser requestAnimationFrame pour un suivi ultra-fluide et précis
  function updateCursorPosition() {
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
    cursor.style.transform = "translate(-50%, -50%)";

    cursorGlow.style.left = mouseX + "px";
    cursorGlow.style.top = mouseY + "px";
    cursorGlow.style.transform = "translate(-50%, -50%)";

    requestAnimationFrame(updateCursorPosition);
  }

  requestAnimationFrame(updateCursorPosition);

  // Effet hover sur les éléments interactifs
  const interactiveElements = document.querySelectorAll(
    "a, button, .project-item, .skill-card, input, textarea"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
    });
  });

  // Masquer le curseur quand la souris quitte la fenêtre
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorGlow.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorGlow.style.opacity = "1";
  });
}

// ===== INITIALISATION =====
window.addEventListener("DOMContentLoaded", () => {
  // Initialiser le curseur personnalisé
  initCustomCursor();

  // Animation de fade-in de la page
  gsap.from("body", {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  });

  // Lancer l'animation du texte hero
  animateHeroText();

  // Lancer l'animation du globe tournant
  animateRotatingGlobe();

  // Lancer l'animation du ver avec cercle 3D
  animateWormPath();

  // Initialiser le formulaire de contact
  initContactForm();

  // Lancer l'animation des éléments flottants
  animateFloatingElements();

  // Setup des animations scroll
  setupScrollAnimations();

  // Setup smooth scroll
  setupSmoothScroll();

  // Initialiser le menu mobile
  initMobileMenu();

  // Activer le suivi de section active dans le menu
  updateActiveMenuLink();
});

// ===== ANIMATION DU GLOBE TOURNANT =====
function animateRotatingGlobe() {
  const globe = document.getElementById("rotatingGlobe");
  const globeContainer = document.getElementById("globeContainer");
  const heroTitle = document.querySelector(".hero-title");

  // Timeline pour l'apparition du globe
  const globeTimeline = gsap.timeline({
    delay: 1.5,
  });

  // Apparition du globe (taille normale)
  gsap.set(globeContainer, {
    scale: 1,
  });

  globeTimeline.to(globeContainer, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power3.out",
  });

  // Rotation continue du globe
  gsap.to(globe, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none",
  });

  // Animation au scroll : le globe passe devant le texte avec clip-path
  gsap.to(globeContainer, {
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Le globe se déplace vers le bas et grossit progressivement
        gsap.to(globeContainer, {
          y: progress * 400,
          scale: 1 + progress * 1.5,
          duration: 0.1,
        });

        // Créer un effet de clip-path sur le texte (réversible)
        // Le texte se révèle progressivement au scroll
        const clipPercent = progress * 100;
        heroTitle.style.clipPath = `inset(0 ${100 - clipPercent}% 0 0)`;
      },
      onLeaveBack: () => {
        // Quand on remonte complètement en haut, afficher le texte entièrement
        heroTitle.style.clipPath = `inset(0 0% 0 0)`;
      },
    },
  });

  // Effet de parallaxe supplémentaire
  gsap.to(globe, {
    rotationY: 180,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 2,
    },
  });
}

// ===== ANIMATION DE L'ÉTOILE FLOTTANTE =====
function animateFloatingStar() {
  const star = document.getElementById("floatingStar");
  // Chercher le "o" uniquement dans la première ligne
  const firstLine = document.querySelector(
    ".hero-title .title-line:first-child"
  );
  const chars = firstLine.querySelectorAll(".char");

  // Trouver le "o" de "Développement" (D-é-v-e-l-o = index 5)
  const targetChar = chars[5];

  if (targetChar) {
    // Fonction pour calculer et mettre à jour la position
    function updateStarPosition() {
      const hero = document.querySelector(".hero");

      // Utiliser offsetLeft/offsetTop pour position stable
      let charLeft = targetChar.offsetLeft;
      let charTop = targetChar.offsetTop;

      // Ajouter les offsets des parents jusqu'à .hero
      let parent = targetChar.offsetParent;
      while (parent && parent !== hero) {
        charLeft += parent.offsetLeft;
        charTop += parent.offsetTop;
        parent = parent.offsetParent;
      }

      // Position: centre du "o", 100px au-dessus, -40px pour centrer l'étoile
      const starX = charLeft + targetChar.offsetWidth / 2 - 40;
      const starY = charTop - 100;

      gsap.set(star, {
        position: "absolute",
        left: starX + "px",
        top: starY + "px",
      });
    }

    // Position initiale après un court délai
    setTimeout(() => {
      updateStarPosition();

      // Timeline d'animation de l'étoile
      const starTimeline = gsap.timeline();

      // Apparition de l'étoile
      starTimeline
        .to(star, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        })
        // Rotation continue
        .to(
          star,
          {
            rotation: 360,
            duration: 3,
            repeat: -1,
            ease: "none",
          },
          "-=0.3"
        )
        // Effet de flottement vertical
        .to(
          star,
          {
            y: -10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          "-=3"
        );
    }, 100);

    // Recalculer la position quand on scroll vers le hero
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      onEnter: updateStarPosition,
      onEnterBack: updateStarPosition,
    });
  }
}

// ===== GESTION DU FORMULAIRE DE CONTACT =====
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoader = submitBtn.querySelector(".btn-loader");
    const formMessage = form.querySelector(".form-message");

    // Récupérer les données
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
      honeypot: document.getElementById("honeypot").value,
    };

    // Validation basique côté client
    if (formData.name.length < 2) {
      showFormMessage("Le nom doit contenir au moins 2 caractères", "error");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showFormMessage("Veuillez entrer un email valide", "error");
      return;
    }

    if (formData.message.length < 10) {
      showFormMessage(
        "Le message doit contenir au moins 10 caractères",
        "error"
      );
      return;
    }

    // État de chargement
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    formMessage.style.display = "none";

    try {
      const response = await fetch("contact.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showFormMessage(result.message, "success");
        form.reset();
      } else {
        showFormMessage(result.message || "Une erreur est survenue", "error");
      }
    } catch (error) {
      console.error("Erreur:", error);
      showFormMessage("Erreur de connexion. Veuillez réessayer.", "error");
    } finally {
      submitBtn.disabled = false;
      btnText.style.display = "inline";
      btnLoader.style.display = "none";
    }
  });

  function showFormMessage(message, type) {
    const formMessage = form.querySelector(".form-message");
    formMessage.textContent = message;
    formMessage.style.display = "block";
    formMessage.style.background =
      type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)";
    formMessage.style.color = type === "success" ? "#22c55e" : "#ef4444";
    formMessage.style.border = `1px solid ${
      type === "success" ? "#22c55e" : "#ef4444"
    }`;

    // Animation d'apparition
    gsap.fromTo(
      formMessage,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    // Masquer après 5 secondes si succès
    if (type === "success") {
      setTimeout(() => {
        gsap.to(formMessage, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => {
            formMessage.style.display = "none";
          },
        });
      }, 5000);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ===== MENU MOBILE RESPONSIVE =====
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMobileOverlay = document.getElementById("navMobileOverlay");
  const closeMenu = document.getElementById("closeMenu");
  const navMobileLinks = document.querySelectorAll(".nav-mobile a");

  if (!hamburger || !navMobileOverlay) return;

  // Fonction pour fermer le menu
  function closeMenuMobile() {
    hamburger.classList.remove("active");
    navMobileOverlay.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  // Toggle menu au clic du hamburger
  hamburger.addEventListener("click", () => {
    const isActive = hamburger.classList.toggle("active");
    navMobileOverlay.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive);

    // Bloquer le scroll quand le menu est ouvert
    document.body.style.overflow = isActive ? "hidden" : "";
  });

  // Fermer le menu au clic sur le bouton de fermeture
  if (closeMenu) {
    closeMenu.addEventListener("click", closeMenuMobile);
  }

  // Fermer le menu au clic sur un lien
  navMobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenuMobile);
  });

  // Fermer le menu avec la touche Échap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMobileOverlay.classList.contains("active")) {
      closeMenuMobile();
    }
  });
}

// ===== ACTIVER LE MENU STICKY =====
function enableStickyMenu() {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  // Observer le scroll pour rendre le menu sticky
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 0) {
          menu.classList.add("sticky");
        } else {
          menu.classList.remove("sticky");
        }

        ticking = false;
      });

      ticking = true;
    }
  });
}

// ===== ACTIVER LE LIEN DU MENU SELON LA SECTION =====
function updateActiveMenuLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-desktop a, .nav-mobile a");

  window.addEventListener("scroll", () => {
    // Si on est tout en haut de la page, activer Accueil
    if (window.scrollY < 100) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === "/") {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
      return;
    }

    // Trouver la section actuellement visible (celle la plus proche du centre de l'écran)
    let currentSection = "";
    let minDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      // Si la section est visible dans le viewport et plus proche du centre
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (distance < minDistance) {
          minDistance = distance;
          currentSection = section.getAttribute("id");
        }
      }
    });

    // Mettre à jour la classe active sur les liens
    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");

      if (currentSection && href === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });
}
