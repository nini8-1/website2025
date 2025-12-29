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

gsap.registerPlugin(ScrollTrigger, Draggable);

// 當我們滾動到最末端或最開頭時，這個變數會增加/減少並封裝（wrap），
// 這讓我們能朝正確的方向平滑地持續移動播放頭。
let iteration = 0; 

// 設定項目的初始狀態
gsap.set(".cards li", {
  xPercent: -50,
  yPercent: -50
});

const spacing = 0.1, // 卡片之間的間隔（交錯時間）
    snapTime = gsap.utils.snap(spacing), // 用於將播放頭對齊到 seamlessLoop 上的特定時間點點
    cards = gsap.utils.toArray('.cards li'),
    // buildSeamlessLoop() 會為每個元素呼叫此函數。
    // 我們只需要回傳一個動畫，它會被插入到主時間軸中並排好間隔。
    animateFunc = element => {
  const tl = gsap.timeline();

  tl.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      zIndex: 100,
      duration: 0.5,
      yoyo: true, // 像悠悠球一樣往返播放
      repeat: 1,
      ease: "power1.in",
      immediateRender: false
    }
  )
  .fromTo(
    element,
    { x: 600 },
    { x: -600, duration: 1, ease: "none", immediateRender: false },
    0 // 與上面的動畫同時開始
  );

  return tl;
};

    // 建立無縫循環的主時間軸
    seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
    // playhead 是一個「代理物件」，用來模擬播放頭位置。
    // 它可以往任何方向無限延伸，我們會透過 onUpdate 將其轉換為 seamlessLoop 對應的時間。
    playhead = {offset: 0}, 
    // 輸入任何 offset（時間），它會回傳對應的封裝時間（介於 0 到 seamlessLoop 持續時間之間的安全值）
    wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()), 
    // 我們重複使用這個補間動畫（tween），來平滑地移動 seamlessLoop 的播放頭
    scrub = gsap.to(playhead, { 
        offset: 0,
        onUpdate() {
            // 將 offset 轉換為 seamlessLoop 時間軸上「安全」的對應時間
            seamlessLoop.time(wrapTime(playhead.offset)); 
        },
        duration: 0.5,
        ease: "power3",
        paused: true
    }),
    trigger = ScrollTrigger.create({
        start: 0,
        onUpdate(self) {
            let scroll = self.scroll();
            // 如果滾動到最底部：
            if (scroll > self.end - 1) {
                wrap(1, 2);
            // 如果滾動到最頂部且繼續往上：
            } else if (scroll < 1 && self.direction < 0) {
                wrap(-1, self.end - 2);
            } else {
                // 計算當前的 offset 並重啟平滑滑動（scrub）
                scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
                // 為了提高效能，我們直接讓同一個補間動畫失效並重啟。
                // 這樣不需要處理覆寫（overwrite）或在每次更新時建立新的補間動畫。
                scrub.invalidate().restart(); 
            }
        },
        end: "+=3000",
        pin: ".gallery" // 固定畫廊容器
    }),
    // 將進度值（0-1，但在封裝時可能超出範圍）轉換為「安全」的滾動值。
    // 該值至少距離起點或終點 1 像素，因為我們預留了邊界來感應何時需要進行循環封裝。
    progressToScroll = progress => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end),
    wrap = (iterationDelta, scrollTo) => {
        iteration += iterationDelta;
        trigger.scroll(scrollTo);
        trigger.update(); // 預設情況下，trigger.scroll() 會等待 1 個 tick 才執行 update()，這裡強制立即更新。
    };

// 當使用者停止滾動時，對齊到最近的項目。
ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(scrub.vars.offset));

// 輸入一個 offset（例如無縫循環時間軸上的時間，可以超過 0 或持續時間，會自動封裝），
// 並相應地設置滾動位置。如果有變動，會觸發 trigger 的 onUpdate()。
function scrollToOffset(offset) { 
    let snappedTime = snapTime(offset),
        progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration(),
        scroll = progressToScroll(progress);
    if (progress >= 1 || progress < 0) {
        return wrap(Math.floor(progress), scroll);
    }
    trigger.scroll(scroll);
}

// 按鈕控制
document.querySelector(".next").addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));
document.querySelector(".prev").addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));


// 以下是拖拽功能（支援行動裝置）...
Draggable.create(".drag-proxy", {
  type: "x",
  trigger: ".cards",
  onPress() {
    this.startOffset = scrub.vars.offset;
  },
  onDrag() {
    // 根據拖拽距離計算新的 offset
    scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
    scrub.invalidate().restart(); // 與 ScrollTrigger 的 onUpdate 邏輯相同
  },
  onDragEnd() {
    scrollToOffset(scrub.vars.offset);
  }
});


/**
 * 核心函數：建立無縫循環時間軸
 * 這個函數會建立一個「假」的時間軸，實際上是在操作另一個包含所有卡片動畫的「真」時間軸。
 */
function buildSeamlessLoop(items, spacing, animateFunc) {
    let overlap = Math.ceil(1 / spacing), // 在開始和結束處增加額外的動畫數量，以實現無縫循環
        startTime = items.length * spacing + 0.5, // 原始序列中我們開始無縫循環的時間點
        loopTime = (items.length + overlap) * spacing + 1, // 結尾處跳回 startTime 的時間點
        rawSequence = gsap.timeline({paused: true}), // 所有「真實」動畫存放的地方
        seamlessLoop = gsap.timeline({ // 這個時間軸只是用來刷動 rawSequence 的播放頭，讓它看起來像無縫循環
            paused: true,
            repeat: -1, // 為了實現無限滾動/循環
            onRepeat() { // 解決 GSAP 3.6.1 以前版本中極其罕見的邊界 bug
                this._time === this._dur && (this._tTime += this._dur - 0.01);
            }
        }),
        l = items.length + overlap * 2,
        time, i, index;

    // 迴圈建立所有交錯的動畫。
    // 記住，我們必須在末尾建立額外的動畫來達成無縫銜接。
    for (i = 0; i < l; i++) {
        index = i % items.length;
        time = i * spacing;
        rawSequence.add(animateFunc(items[index]), time);
        // 建立標籤（Label），方便以後想跳轉到特定卡片位置（雖然本例沒用到）。
        i <= items.length && seamlessLoop.add("label" + i, time); 
    }

    // 設定播放頭的刷動邏輯，使其看起來無縫。
    rawSequence.time(startTime);
    seamlessLoop.to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none"
    }).fromTo(rawSequence, {time: overlap * spacing + 1}, {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: "none"
    });
    return seamlessLoop;
}