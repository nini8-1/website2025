const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const fullscreenNav = document.getElementById("fullscreenNav");

menuBtn.addEventListener("click", () => {
  fullscreenNav.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  fullscreenNav.classList.remove("active");
});


// 設定圖片資料夾路徑
const imageFolderPath = "./ser02images/"; 
const gallery = document.getElementById('gallery');
const overlay = document.getElementById('overlay');
const expandedImg = document.getElementById('expanded-img');
const infoNumber = document.getElementById('info-number');
const infoDesc = document.getElementById('info-desc'); // 確保 HTML 有這個 ID

let galleryData = [];

// 1. 核心函數：載入資料並渲染
async function initGallery() {
    try {
        // 嘗試讀取 JSON 檔案
        const response = await fetch('/ser02data.json');
        if (!response.ok) throw new Error("找不到 JSON 檔案");
        
        galleryData = await response.json();
        console.log("成功讀取 JSON 資料");
        
    } catch (error) {
        console.warn("使用測試模式：自動生成 36 張隨機圖片", error);
        // 如果 JSON 讀取失敗，自動生成測試資料
        galleryData = Array.from({ length: 36 }, (_, i) => {
            const num = (i + 1).toString().padStart(2, '0');
            return {
                id: num,
                // 測試模式使用網路隨機圖，正式時會讀取本地 images/workXX.jpg
                fileName: `https://picsum.photos/${(i+1) % 2 === 0 ? 800 : 500}/600?random=${i+1}`,
                desc: `這是作品 ${num} 的測試描述。當你準備好 JSON 檔案後，這裡會顯示真實註解。`
            };
        });
    }
    
    renderGallery();
}

// 2. 渲染圖庫到畫面上
function renderGallery() {
    gallery.innerHTML = ""; 
    galleryData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // --- 圖片路徑全相容判定 ---
        let imgSrc;
        if (item.imagePath) { 
            imgSrc = item.imagePath; // 修正後的格式
        } else if (item.image) { 
            imgSrc = item.image;     // 你剛剛測試上傳的那幾筆格式
        } else { 
            imgSrc = `${imageFolderPath}${item.fileName}`; // 原始格式
        }

        // --- 文字描述全相容判定 ---
        const displayDesc = item.desc || item.title || "無描述";
        const displayId = item.id || "??";

        galleryItem.innerHTML = `
            <div class="image-box" data-index="${index}">
                <img src="${imgSrc}" alt="${displayDesc}" loading="lazy">
            </div>
            <div class="caption">${displayId}</div>
        `;
        gallery.appendChild(galleryItem);
    });
}

// 3. Navbar 捲動控制 (優化版)
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    let current = window.pageYOffset || document.documentElement.scrollTop;
    
    if (current > lastScroll && current > 100) {
        nav.classList.add('nav-hidden');
    } else {
        nav.classList.remove('nav-hidden');
    }
    lastScroll = current <= 0 ? 0 : current; 
});

// 4. 點擊放大與更新註解
gallery.addEventListener('click', (e) => {
    const box = e.target.closest('.image-box');
    if (box) {
        const idx = box.getAttribute('data-index');
        const item = galleryData[idx];

        expandedImg.src = box.querySelector('img').src;
        infoNumber.innerText = item.id;
        
        // 更新註解文字
        if (infoDesc) infoDesc.innerText = item.desc; 

        // --- 連結處理邏輯 ---
        const linkBtn = document.getElementById('info-link');
        if (item.link && item.link !== "") {
            linkBtn.href = item.link;      // 填入連結
            linkBtn.style.display = "inline-block"; // 顯示按鈕
        } else {
            linkBtn.style.display = "none"; // 若無連結則隱藏
        }
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

// 5. 點擊背景關閉
overlay.addEventListener('click', (e) => {
    if (e.target.id === 'overlay' || e.target.id === 'expanded-img') {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// 啟動程式
initGallery();

