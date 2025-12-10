/* GSAP quick setters */
const baseX = gsap.quickTo(".svg-base", "x");
const baseY = gsap.quickTo(".svg-base", "y");

const eeX = gsap.quickTo(".svg-ee", "x");
const eeY = gsap.quickTo(".svg-ee", "y");

const bbX = gsap.quickTo(".svg-bb", "x");
const bbY = gsap.quickTo(".svg-bb", "y");

/* 視差幅度（會隨螢幕大小調整） */
function getParallaxRange() {
  const base = Math.min(window.innerWidth, window.innerHeight);

  return {
    base: base * 0.005,  // ew 超級輕微視差
    ee:   base * 0.05,   // ee 最大
    bb:   base * 0.015   // bb 次小
  };
}

let PARALLAX = getParallaxRange();

window.addEventListener("resize", () => {
  PARALLAX = getParallaxRange();
});

/* 滑鼠視差 */
window.addEventListener("pointermove", (e) => {
  const cx = (e.clientX / window.innerWidth - 0.5) * 2; 
  const cy = (e.clientY / window.innerHeight - 0.5) * 2;

  // ew 背景微視差（優雅、幾乎察覺不到）
  baseX(cx * PARALLAX.base);
  baseY(cy * PARALLAX.base);

  // ee 最大視差
  eeX(cx * PARALLAX.ee);
  eeY(cy * PARALLAX.ee);

  // bb 中等視差
  bbX(cx * PARALLAX.bb);
  bbY(cy * PARALLAX.bb);
});

/* 滑鼠離開歸零 */
window.addEventListener("pointerleave", () => {
  baseX(0); baseY(0);
  eeX(0); eeY(0);
  bbX(0); bbY(0);
});
