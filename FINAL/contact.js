const main = document.querySelector("main");

gsap.set(main, { perspective: 650 });

const outerRX = gsap.quickTo(".contact-page-logo-outer", "rotationX", {
  ease: "power3",
  duration: 0.6
});
const outerRY = gsap.quickTo(".contact-page-logo-outer", "rotationY", {
  ease: "power3",
  duration: 0.6
});

// 底層（慢）
const bgX = gsap.quickTo(".parallax-bg", "x", { ease: "power3" });
const bgY = gsap.quickTo(".parallax-bg", "y", { ease: "power3" });

// 上層（快）
const wordX = gsap.quickTo(".parallax-word", "x", { ease: "power3" });
const wordY = gsap.quickTo(".parallax-word", "y", { ease: "power3" });

main.addEventListener("pointermove", (e) => {
  const x = e.x / window.innerWidth;
  const y = e.y / window.innerHeight;

  // 整體 tilt
  outerRX(gsap.utils.interpolate(10, -10, y));
  outerRY(gsap.utils.interpolate(-10, 10, x));

  // 兩層視差
  bgX(gsap.utils.interpolate(-8, 8, x));
  bgY(gsap.utils.interpolate(-8, 8, y));

  wordX(gsap.utils.interpolate(-22, 22, x));
  wordY(gsap.utils.interpolate(-22, 22, y));
});

main.addEventListener("pointerleave", () => {
  outerRX(0);
  outerRY(0);
  bgX(0); bgY(0);
  wordX(0); wordY(0);
});

//避免手機抖動
if (window.matchMedia("(pointer: fine)").matches) {
  main.addEventListener("pointermove", onMove);
  main.addEventListener("pointerleave", onLeave);
}
