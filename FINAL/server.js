import express from 'express';
import multer from 'multer';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();

// 讓根目錄與圖片目錄可以被讀取
app.use(express.static('./'));
app.use('/ser02images', express.static('ser02images'));

// 1. 初始化資料庫連線
let db;
(async () => {
    db = await open({
        filename: './ser02data.db',
        driver: sqlite3.Database
    });
    console.log('✅ 資料庫(SQLite)已連線成功');
})();

const upload = multer({ dest: 'ser02images/' });

// 2. 提供資料給網頁的 API (GET)
app.get('/get-projects', async (req, res) => {
    try {
        const projects = await db.all('SELECT * FROM projects');
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "無法讀取資料庫" });
    }
});

// 3. 處理圖片上傳的 API (POST)
app.post('/upload-project', upload.single('projectImage'), async (req, res) => {
    try {
        const { title, link } = req.body;
        const oldPath = req.file.path;
        const newFileName = Date.now() + '-' + req.file.originalname;
        const newPath = `ser02images/${newFileName}`;
        
        fs.renameSync(oldPath, newPath);

        const result = await db.run(
            `INSERT INTO projects (fileName, imagePath, desc, link) VALUES (?, ?, ?, ?)`,
            [newFileName, newPath, title || "", link || ""]
        );

        res.json({ message: `上傳成功！ID: ${result.lastID}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "伺服器出錯" });
    }
});

app.listen(3000, () => {
    console.log('🚀 伺服器啟動完成：http://localhost:3000');
    console.log('🔗 點此測試 API：http://localhost:3000/get-projects');
});