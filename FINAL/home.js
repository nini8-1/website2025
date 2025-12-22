const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const fullscreenNav = document.getElementById("fullscreenNav");

let menuOpen = false;

menuBtn.addEventListener("click", () => {
  fullscreenNav.classList.add("active");
  document.body.style.overflow = "hidden";
  menuOpen = true;
});

closeBtn.addEventListener("click", () => {
  fullscreenNav.classList.remove("active");
  document.body.style.overflow = "";
  menuOpen = false;
});

function playAnimation(shape) {
  let tl = gsap.timeline();

  tl.fromTo(
    shape,
    { opacity: 0, scale: 0.2 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out(1.7)"
    }
  ).to(shape, {
    opacity: 0,
    scale: 0.2,
    duration: 0.8,
    ease: "power2.in",
    delay: 0.1
  });
}


/* --------------------------------
  
The other stuff...

------------------------------------*/
let flair = gsap.utils.toArray(".flair");
let gap = 100;
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);

let mousePos = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let cachedMousePos = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  if (menuOpen) return; // 🔴 fullscreen 開啟時不跑
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});

gsap.ticker.add(() => {
  if (menuOpen) return;
  ImageTrail();
});

function ImageTrail() {
  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y,
    mousePos.y,
    0.1
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos.x = mousePos.x;
    lastMousePos.y = mousePos.y;
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
