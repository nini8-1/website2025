// 控制選單與導覽列
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const fullscreenNav = document.getElementById("fullscreenNav");

menuBtn?.addEventListener("click", () => fullscreenNav.classList.add("active"));
closeBtn?.addEventListener("click", () => fullscreenNav.classList.remove("active"));

// 圖庫邏輯
const gallery = document.getElementById('gallery');
const overlay = document.getElementById('overlay');
const expandedImg = document.getElementById('expanded-img');
const infoNumber = document.getElementById('info-number');
const infoDesc = document.getElementById('info-desc');
const infoLink = document.getElementById('info-link');

let galleryData = [];

function renderGallery() {
    if (!gallery) return;
    gallery.innerHTML = ""; 

    galleryData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // --- 核心修正：如果 imagePath 是空的，就用 fileName 組合出路徑 ---
        let imgSrc = item.imagePath;
        
        if (!imgSrc || imgSrc === "") {
            // 如果資料庫沒存路徑，我們就手動幫它加上資料夾名稱
            imgSrc = `ser02images/${item.fileName}`;
        }

        galleryItem.innerHTML = `
            <div class="image-box" data-index="${index}">
                <img src="${imgSrc}" alt="${item.desc || 'Gallery Image'}" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=File+Not+Found'">
            </div>
            <div class="caption">${item.id}</div>
        `;
        gallery.appendChild(galleryItem);
    });
}

// 點擊放大邏輯
gallery?.addEventListener('click', (e) => {
    const box = e.target.closest('.image-box');
    if (box) {
        const item = galleryData[box.dataset.index];
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

overlay?.addEventListener('click', () => overlay.classList.remove('active'));

initGallery();