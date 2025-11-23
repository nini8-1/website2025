gsap.from(".hero-title span", {
  y: 40,
  opacity: 0,
  stagger: 0.3,
  duration: 1.2,
  ease: "power3.out"
});
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
