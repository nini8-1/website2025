const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const fullscreenNav = document.getElementById("fullscreenNav");

menuBtn.addEventListener("click", () => {
  fullscreenNav.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  fullscreenNav.classList.remove("active");
  document.body.style.overflow = "";
});

gsap.registerPlugin(ScrollTrigger, Draggable);

let iteration = 0;

// 設定卡片初始狀態
gsap.set(".cards li", {
  xPercent: -50,
  yPercent: -50
});

const spacing = 0.1,
      snapTime = gsap.utils.snap(spacing),
      cards = gsap.utils.toArray(".cards li");

const animateFunc = (el) => {
  const tl = gsap.timeline();
  tl.fromTo(
    el,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }
  )
  .fromTo(
    el,
    { x: 600 },
    { x: -600, duration: 1, ease: "none", immediateRender: false },
    0
  );
  return tl;
};

// 建立無縫循環
const seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
      playhead = { offset: 0 },
      wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()),
      scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() { seamlessLoop.time(wrapTime(playhead.offset)); },
        duration: 0.5,
        ease: "power3",
        paused: true
      }),
      trigger = ScrollTrigger.create({
        start: 0,
        end: "+=3000",
        pin: ".gallery",
        onUpdate(self) {
          let scroll = self.scroll();
          if (scroll > self.end - 1) wrap(1, 2);
          else if (scroll < 1 && self.direction < 0) wrap(-1, self.end - 2);
          else {
            scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
            scrub.invalidate().restart();
          }
        }
      });

const progressToScroll = (progress) => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end);

function wrap(iterationDelta, scrollTo) {
  iteration += iterationDelta;
  trigger.scroll(scrollTo);
  trigger.update();
}

function scrollToOffset(offset) {
  const snappedTime = snapTime(offset),
        progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration(),
        scroll = progressToScroll(progress);

  if (progress >= 1 || progress < 0) return wrap(Math.floor(progress), scroll);
  trigger.scroll(scroll);
}

// 按鈕控制
document.querySelector(".next").addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));
document.querySelector(".prev").addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));

// --- 拖拽與點擊判定 ---
let startX = 0, startY = 0, dragged = false;

Draggable.create(".drag-proxy", {
  type: "x",
  trigger: ".cards",
  inertia: true,
  allowEventDefault: true,
  allowClicks: true,

  onPress(e) {
    dragged = false;
    startX = e.clientX;
    startY = e.clientY;
    this.startOffset = scrub.vars.offset;
  },

  onDrag(e) {
    const dx = Math.abs(e.clientX - startX);
    const dy = Math.abs(e.clientY - startY);
    if (dx > 8 || dy > 8) dragged = true;

    scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
    scrub.invalidate().restart();
  },

  onRelease(e) {
    const card = e.target.closest(".card");
    if (card && !dragged) openProjectModal(card);
    else scrollToOffset(scrub.vars.offset);
  }
});

// --- Modal ---
const modal = document.querySelector(".project-modal");
const modalImg = modal.querySelector(".modal-left img");
const modalTitle = modal.querySelector(".modal-right h2");
const modalText = modal.querySelector(".modal-right p");

function openProjectModal(card) {
  const bg = window.getComputedStyle(card).backgroundImage;
  const url = bg.slice(5, -2);

  modalImg.src = url;
  modalTitle.textContent = "Project Title";
  modalText.textContent = "這裡放你的作品說明文字。";

  modal.classList.add("active");

  ScrollTrigger.disable();
  Draggable.get(".drag-proxy")?.disable();
  document.body.style.overflow = "hidden";
}

// 點 X 或背景關閉
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.closest(".modal-close")) closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  ScrollTrigger.enable();
  Draggable.get(".drag-proxy")?.enable();
  document.body.style.overflow = "";
}

// --- 無縫循環函數 ---
function buildSeamlessLoop(items, spacing, animateFunc) {
  const overlap = Math.ceil(1 / spacing),
        startTime = items.length * spacing + 0.5,
        loopTime = (items.length + overlap) * spacing + 1,
        rawSequence = gsap.timeline({ paused: true }),
        seamlessLoop = gsap.timeline({ paused: true, repeat: -1, onRepeat() {
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        }});

  const l = items.length + overlap * 2;
  for (let i = 0; i < l; i++) {
    const index = i % items.length;
    const time = i * spacing;
    rawSequence.add(animateFunc(items[index]), time);
    i <= items.length && seamlessLoop.add("label" + i, time);
  }

  rawSequence.time(startTime);
  seamlessLoop.to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: "none" })
            .fromTo(rawSequence, { time: overlap * spacing + 1 }, { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: "none" });

  return seamlessLoop;
}
