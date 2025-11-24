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
