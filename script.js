document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      navigation.classList.remove("is-open");
    });
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const startTypewriter = (element, delay, speed) => {
  const fragments = Array.from(element.querySelectorAll("[data-typing-text]"));
  if (!fragments.length) return delay;

  const characterCount = fragments.reduce((total, fragment) => total + fragment.dataset.typingText.length, 0);
  element.classList.add("typewriter-pending");

  window.setTimeout(() => {
    element.classList.remove("typewriter-pending");
    element.classList.add("is-typing");
    fragments.forEach((fragment) => {
      fragment.textContent = "";
    });

    let fragmentIndex = 0;
    let characterIndex = 0;

    const typeNextCharacter = () => {
      const fragment = fragments[fragmentIndex];
      if (!fragment) {
        element.classList.remove("is-typing");
        element.classList.add("is-typed");
        return;
      }

      const text = fragment.dataset.typingText;
      fragment.textContent += text.charAt(characterIndex);
      characterIndex += 1;

      if (characterIndex >= text.length) {
        fragmentIndex += 1;
        characterIndex = 0;
      }

      window.setTimeout(typeNextCharacter, speed);
    };

    typeNextCharacter();
  }, delay);

  return delay + characterCount * speed;
};

if (!prefersReducedMotion) {
  const heroDescription = document.querySelector(".hero-description");
  if (heroDescription) startTypewriter(heroDescription, 1400, 16);
}

const scrollRevealElements = document.querySelectorAll(".scroll-reveal");
const revealElement = (element) => {
  element.classList.add("is-visible");

  if (!prefersReducedMotion && element.matches(".intro-copy")) {
    let delay = 250;
    element.querySelectorAll(".intro-text .typewriter").forEach((paragraph) => {
      delay = startTypewriter(paragraph, delay, 14) + 180;
    });
  }
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -48px 0px" });

  scrollRevealElements.forEach((element) => revealObserver.observe(element));
} else {
  scrollRevealElements.forEach(revealElement);
}
