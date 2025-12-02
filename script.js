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

// ===== ANIMATION DU TEXTE (Style GSAP.com) =====
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

  // Animation des cartes projet avec parallaxe
  gsap.utils.toArray(".project-card").forEach((card, index) => {
    const speed = parseFloat(card.getAttribute("data-speed")) || 1;

    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Effet parallaxe
    gsap.to(card, {
      y: (i, target) => -ScrollTrigger.maxScroll(window) * (speed - 1) * 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: ".projects-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Animation des catégories de compétences
  gsap.utils.toArray(".skill-category").forEach((category, index) => {
    gsap.to(category, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: index * 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: category,
        start: "top 80%",
        toggleActions: "play none none none",
        onEnter: () => animateSkillBars(category),
      },
    });
  });

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

// ===== ANIMATION DES BARRES DE COMPÉTENCES =====
function animateSkillBars(category) {
  const bars = category.querySelectorAll(".skill-progress");

  bars.forEach((bar, index) => {
    const progress = bar.getAttribute("data-progress");

    gsap.to(bar, {
      width: progress + "%",
      duration: 1.5,
      delay: index * 0.1,
      ease: "power3.out",
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

// ===== INITIALISATION =====
window.addEventListener("DOMContentLoaded", () => {
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
}); // ===== ANIMATION DU GLOBE TOURNANT =====
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
