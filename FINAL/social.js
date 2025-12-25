const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const fullscreenNav = document.getElementById("fullscreenNav");

menuBtn.addEventListener("click", () => {
  fullscreenNav.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  fullscreenNav.classList.remove("active");
});


// 註冊插件
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {
  
  if (window.innerWidth > 992) {
    // 1. 固定左側區域 (Pinning)
    ScrollTrigger.create({
      trigger: ".contact-page-logo-outer",
      start: "top 100px", // 當圖片頂部到達視窗 100px 的位置時
      endTrigger: ".contact-wrap", // 到右側內容結束為止
      end: "bottom bottom",
      pin: true, // 核心功能：釘住它
      pinSpacing: false // 不要因為釘住而產生額外空白
    });

    // 2. 視差效果 (Parallax)
    // 讓內部的 SVG 本體在滾動時有輕微的 y 軸位移
    gsap.to(".contact-page-logo-outer", {
      y: 50, // 往下移動 50px
      ease: "none",
      scrollTrigger: {
        trigger: ".contact-wrap",
        start: "top top",
        end: "bottom bottom",
        scrub: true // 關鍵：讓動畫跟隨捲軸進度同步
      }
    });

    // 3. SVG 旋轉視差
    gsap.to(".contact-pagesvg-logo", {
      rotation: 15,
      scrollTrigger: {
        trigger: ".contact-wrap",
        start: "top top",
        end: "bottom bottom",
        scrub: 1 // 增加一點平滑感
      }
    });
  }
});