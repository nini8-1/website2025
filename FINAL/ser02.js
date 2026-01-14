// --- 1. 控制選單與導覽列 ---
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const fullscreenNav = document.getElementById("fullscreenNav");

menuBtn?.addEventListener("click", () => fullscreenNav.classList.add("active"));
closeBtn?.addEventListener("click", () => fullscreenNav.classList.remove("active"));

// --- 2. 圖庫邏輯與全域變數 ---
const gallery = document.getElementById('gallery');
const overlay = document.getElementById('overlay');
const expandedImg = document.getElementById('expanded-img');
const infoNumber = document.getElementById('info-number');
const infoDesc = document.getElementById('info-desc');
const infoLink = document.getElementById('info-link');

let galleryData = []; // 用來儲存從後端抓回來的資料

// --- 3. 初始化函數：向後端 API 請求資料 ---
async function initGallery() {
    try {
        console.log("正在嘗試連線至伺服器...");
        // 向後端 Node.js API 請求資料
        const response = await fetch('/get-projects');
        
        if (!response.ok) {
            throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
        }

        // 解析後端傳回的 JSON
        galleryData = await response.json();
        console.log("成功取得資料:", galleryData);

        // 取得資料後，執行畫面渲染
        renderGallery();
    } catch (error) {
        console.error("無法載入圖庫資料:", error);
        if (gallery) {
            gallery.innerHTML = `<p style="color: white; text-align: center; padding: 20px;">
                載入失敗：請確認後端伺服器是否已啟動 (node server.js)
            </p>`;
        }
    }
}

// --- 4. 渲染畫面函數 ---
function renderGallery() {
    if (!gallery) return;
    gallery.innerHTML = ""; 

    if (galleryData.length === 0) {
        gallery.innerHTML = '<p style="color: #ccc; text-align: center; width: 100%;">目前沒有任何作品。</p>';
        return;
    }

    galleryData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // 處理路徑：如果 imagePath 不存在，則使用 fileName 組合
        let imgSrc = item.imagePath || `ser02images/${item.fileName}`;

        galleryItem.innerHTML = `
            <div class="image-box" data-index="${index}">
                <img src="${imgSrc}" 
                     alt="${item.desc || 'Gallery Image'}" 
                     loading="lazy" 
                     onerror="this.src='https://placehold.co/400x300?text=File+Not+Found'">
            </div>
            <div class="caption">${item.id}</div>
        `;
        gallery.appendChild(galleryItem);
    });
}

// --- 5. 點擊放大邏輯 ---
gallery?.addEventListener('click', (e) => {
    const box = e.target.closest('.image-box');
    if (box) {
        const index = box.dataset.index;
        const item = galleryData[index];
        
        expandedImg.src = box.querySelector('img').src;
        infoNumber.innerText = item.id;
        infoDesc.innerText = item.desc || "";
        
        if (item.link) {
            infoLink.href = item.link;
            infoLink.style.display = "inline-block";
        } else {
            infoLink.style.display = "none";
        }
        overlay.classList.add('active');
    }
});

overlay?.addEventListener('click', (e) => {
    // 點擊背景才關閉，點擊內容不關閉（視需求調整）
    if (e.target === overlay || e.target.classList.contains('close-overlay')) {
        overlay.classList.remove('active');
    }
});

// --- 6. 正式啟動 ---
initGallery();