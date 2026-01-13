import express from 'express';
import multer from 'multer';
import fs from 'fs';

const app = express();
app.use(express.static('./')); 

// 1. 設定圖片存放地：ser02images
const upload = multer({ dest: 'ser02images/' });

// 2. 處理上傳請求
app.post('/upload-project', upload.single('projectImage'), (req, res) => {
    try {
        const projectTitle = req.body.title; 
        const oldPath = req.file.path;
        const newFileName = Date.now() + '-' + req.file.originalname;
        const newPath = `ser02images/${newFileName}`;
        
        // 搬移檔案
        fs.renameSync(oldPath, newPath);

        const dataPath = './ser02data.json';
        const projects = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // 自動接續 ID 邏輯
        let nextId = "01";
        if (projects.length > 0) {
            const lastItem = projects[projects.length - 1];
            nextId = (parseInt(lastItem.id) + 1).toString().padStart(2, '0');
        }

        // 統一存入與你原始陣列相同的格式
        const newEntry = {
            "id": nextId,
            "fileName": newFileName,
            "imagePath": newPath,
            "desc": projectTitle, 
            "link": req.body.link || "" 
        };

        projects.push(newEntry);
        fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));

        // 回傳成功訊息給前端
        res.json({ message: `上傳成功！作品 ID：${nextId}` });
        
    } catch (err) {
        console.error("上傳過程出錯：", err);
        res.status(500).json({ message: "伺服器內部錯誤" });
    }
}); // <--- 注意：app.post 的括號要在這裡結束

// 啟動伺服器
app.listen(3000, () => {
    console.log('店員已就位，伺服器運行中...');
    console.log('管理後台：http://localhost:3000/admin_upload_9x2.html');
    console.log('作品集頁面：http://localhost:3000/ser02.html');
});