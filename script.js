// ===== FONCTION POUR DIVISER LE TEXTE EN LETTRES =====
function splitTextToChars(element) {
  // Traiter chaque ligne séparément pour préserver les sauts de ligne
  const lines = element.querySelectorAll(".title-line");

  lines.forEach((line) => {
    const text = line.textContent.trim();
    line.innerHTML = "";

    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char === " " ? "\u00A0" : char;
      line.appendChild(span);
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

  // Animation horizontale des compétences au scroll
  const skillsContainer = document.querySelector(
    ".skills-horizontal-container"
  );
  const skillsWrapper = document.querySelector(".skills-horizontal-wrapper");

  if (skillsContainer && skillsWrapper) {
    // Calculer la largeur totale du container
    const getScrollAmount = () => {
      const containerWidth = skillsContainer.scrollWidth;
      const wrapperWidth = skillsWrapper.offsetWidth;
      return -(containerWidth - wrapperWidth);
    };

    // Animation de scroll horizontal
    gsap.to(skillsContainer, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
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
      // Rotation légère et scale au passage
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
  }

  // Animation du ver dans la section contact
  const pathContact = document.getElementById("wormPathContact");
  const circleContact = document.getElementById("movingCircleContact");
  const sectionContact = document.querySelector(".contact-section");
  const svgContact = document.querySelector(".worm-path-svg-contact");

  if (pathContact && circleContact && sectionContact && svgContact) {
    const pathLength = pathContact.getTotalLength();
    const viewBox = svgContact.viewBox.baseVal;

    gsap.to(circleContact, {
      scrollTrigger: {
        trigger: sectionContact,
        start: "top-=300px top",
        end: "bottom+=50px bottom",
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
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: target,
            offsetY: 80,
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

  // Obtenir les dimensions réelles du SVG et du viewBox
  const svgRect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const scaleX = svgRect.width / viewBox.width;
  const scaleY = svgRect.height / viewBox.height;

  console.log("SVG dimensions:", svgRect.width, svgRect.height);
  console.log("ViewBox:", viewBox.width, viewBox.height);
  console.log("Scale:", scaleX, scaleY);
  console.log("SVG position:", svgRect.left, svgRect.top);

  // Position initiale du cercle au début du chemin
  const startPoint = path.getPointAtLength(0);
  const startX = svgRect.left + startPoint.x * scaleX;
  const startY = svgRect.top + startPoint.y * scaleY;

  gsap.set(circle, {
    left: startX + "px",
    top: startY + "px",
    xPercent: -50,
    yPercent: -50,
  });

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

        // Obtenir la position actuelle du SVG (peut changer au scroll)
        const currentSvgRect = svg.getBoundingClientRect();

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

  // Lancer l'animation des éléments flottants
  animateFloatingElements();

  // Setup des animations scroll
  setupScrollAnimations();

  // Setup smooth scroll
  setupSmoothScroll();
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
    // Attendre un peu pour que le layout soit stable
    setTimeout(() => {
      // Obtenir la position de la section hero et du "o"
      const heroRect = document.querySelector(".hero").getBoundingClientRect();
      const charRect = targetChar.getBoundingClientRect();

      // Calculer position relative à .hero au lieu du viewport
      const starX = charRect.left - heroRect.left + charRect.width / 2 - 40; // -40 car étoile fait 80px
      const starY = charRect.top - heroRect.top - 100; // 100px au-dessus

      gsap.set(star, {
        position: "absolute",
        left: starX + "px",
        top: starY + "px",
      });

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
  }
}
