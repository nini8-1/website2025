gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = gsap.utils.toArray(".scene");

/* Scene 2：scroll motion */
gsap.fromTo(".scene-2 .box",
  { x: -200 },
  {
    x: 200,
    scrollTrigger: {
      trigger: ".scene-2",
      start: "top 70%",
      end: "top 30%",
      scrub: true
    }
  }
);

/* Snap（排除 scene-2） */
sections.forEach(section => {
  if (section.classList.contains("scene-2")) return;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "bottom top",
    snap: {
      snapTo: 1,
      duration: 0.6,
      ease: "power2.inOut"
    }
  });
});
