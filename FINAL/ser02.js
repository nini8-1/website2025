// 1. 自動填充 36 個項目
const gallery = document.getElementById('gallery');
for (let i = 1; i <= 36; i++) {
    const num = i.toString().padStart(2, '0'); // 格式改為 01, 02, 03...
    
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <div class="image-box" data-num="${num}">
            <img src="https://picsum.photos/${i % 2 === 0 ? 800 : 500}/600?random=${i}" alt="Work" loading="lazy">
        </div>
        <div class="caption">${num}</div>
    `;
    gallery.appendChild(item);
}

let lastScroll = 0;
const navbar = document.getElementById('navbar');

// 捲動監聽
window.addEventListener('scroll', () => {
    let current = window.pageYOffset;
    if (current > lastScroll && current > 100) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }
    lastScroll = current;
});

// 手機版選單開關
document.getElementById('menuBtn').onclick = () => {
    document.getElementById('fullscreenNav').classList.add('active');
};
document.getElementById('closeBtn').onclick = () => {
    document.getElementById('fullscreenNav').classList.remove('active');
};

// 3. 放大與註解邏輯
const overlay = document.getElementById('overlay');
const expandedImg = document.getElementById('expanded-img');
const infoNumber = document.getElementById('info-number');

gallery.addEventListener('click', (e) => {
    const box = e.target.closest('.image-box');
    if (box) {
        const num = box.getAttribute('data-num');
        const src = box.querySelector('img').src;
        
        expandedImg.src = src;
        infoNumber.innerText = num; // 更新放大後的編號
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

overlay.addEventListener('click', (e) => {
    // 只有點擊背景或圖片本身才關閉，避免點擊註解文字時關閉
    if (e.target.id === 'overlay' || e.target.id === 'expanded-img') {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

