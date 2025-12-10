const menuBtn = document.getElementById("menuBtn");
const fullscreenNav = document.getElementById("fullscreenNav");
const closeBtn = document.getElementById("closeBtn");

// 打開全螢幕選單
menuBtn.addEventListener("click", () => {
  fullscreenNav.classList.add("active");
});

// 關閉選單
closeBtn.addEventListener("click", () => {
  fullscreenNav.classList.remove("active");
});

// 確保所有程式碼在網頁的 DOM 結構載入完成後才執行
window.addEventListener('DOMContentLoaded', () => {

  // ======================================
  // 1. 手機全螢幕選單開關邏輯
  // ======================================
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const fullscreenNav = document.getElementById('fullscreenNav');

  if (menuBtn && fullscreenNav && closeBtn) {
      // 開啟選單
      menuBtn.addEventListener('click', () => {
          fullscreenNav.classList.add('active');
      });

      // 關閉選單
      closeBtn.addEventListener('click', () => {
          fullscreenNav.classList.remove('active');
      });
      
      // 點擊選單連結後也關閉選單
      const navLinks = fullscreenNav.querySelectorAll('a');
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              fullscreenNav.classList.remove('active');
          });
      });
  }


  // ======================================
  // GSAP 滾動觸發圖片進場動畫
  // ======================================
  
  // 註冊 ScrollTrigger 插件 (如果沒有這個，滾動動畫不會運作)
  gsap.registerPlugin(ScrollTrigger);
  
  // 使用 gsap.from() 來製作圖片進場動畫
  gsap.from(".image-container", { // 目標：選取所有 class 為 .image-container 的元素
    // 動畫起始狀態
    y: 50,              // 從下方 50px 的位置開始
    opacity: 0,         // 從完全透明開始
    
    // 動畫參數
    duration: 1.2,      // 動畫持續時間
    ease: "power3.out", // 緩和曲線
    stagger: 0.2,       // 讓三個圖片容器依序延遲 0.2 秒進場
    
    // ScrollTrigger 設置
    scrollTrigger: {
      trigger: ".about-images", // 以包裹圖片的父層區塊 (.about-images) 作為觸發點
      start: "top 80%",         // 當觸發點的頂部滾動到視窗的 80% 高度時開始動畫
      toggleActions: "play none none none", // 滾入時播放一次
      once: true                // 確保動畫只觸發一次
    }
  });

});

// scripts.js

function playAnimation(shape) {
 // the timeline
  let tl = gsap.timeline();
  tl.from(shape,{
    opacity: 0,
    scale: 0,
    ease: "elastic.out(1,0.3)",
  })
  .to(shape,{
    rotation: "random([-360, 360])",
  }, "<")
  .to(shape,{
    y: "120vh",
    ease: "back.in(.4)",
    duration: 1,
  },0)
  
}

/* --------------------------------

The other stuff...

------------------------------------*/
let flair = gsap.utils.toArray(".flair");
let gap = 100; // if you're nosy though, this number spaces the 'lil shapes out
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);
gsap.defaults({duration: 1})

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;
let cachedMousePos = mousePos;

window.addEventListener("mousemove", (e) => {
  mousePos = {
    x: e.x,
    y: e.y
  };
});

gsap.ticker.add(ImageTrail);

function ImageTrail() {
  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  // keep the previous mouse position for animation
  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.1
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos = mousePos;
  }
}

function animateImage() {
  let wrappedIndex = wrapper(index);

  console.log(index, flair.length);

  let img = flair[wrappedIndex];
  gsap.killTweensOf(img);
  
  gsap.set(img, {
    clearProps: "all",
  });
  

  gsap.set(img, {
    opacity: 1,
    left: mousePos.x,
    top: mousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  playAnimation(img);

  index++;
}


const main = document.querySelector("main");

gsap.set("main", { perspective: 650 });

const outerRX = gsap.quickTo(".contact-page-logo-outer", "rotationX", { ease: "power3" });
const outerRY = gsap.quickTo(".contact-page-logo-outer", "rotationY", { ease: "power3" });
const innerX = gsap.quickTo(".contact-pagesvg-logo", "x", { ease: "power3" });
const innerY = gsap.quickTo(".contact-pagesvg-logo", "y", { ease: "power3" });

main.addEventListener("pointermove", (e) => {
  outerRX(gsap.utils.interpolate(15, -15, e.y / window.innerHeight));
  outerRY(gsap.utils.interpolate(-15, 15, e.x / window.innerWidth));
  innerX(gsap.utils.interpolate(-30, 30, e.x / window.innerWidth));
  innerY(gsap.utils.interpolate(-30, 30, e.y / window.innerHeight));
});

main.addEventListener("pointerleave", (e) => {
  outerRX(0);
  outerRY(0);
  innerX(0);
  innerY(0);
});
