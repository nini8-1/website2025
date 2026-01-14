import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

console.log(">>> 測試：程式已經啟動了！");

const jsonPath = './ser02data.json';

open({
    filename: './ser02data.db',
    driver: sqlite3.Database
}).then(async (db) => {
    console.log(">>> 資料庫連線成功");

    await db.exec(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileName TEXT,
        imagePath TEXT,
        desc TEXT,
        link TEXT
    )`);

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`>>> 準備搬運 ${data.length} 筆資料...`);

    for (const item of data) {
        await db.run(
            `INSERT INTO projects (fileName, imagePath, desc, link) VALUES (?, ?, ?, ?)`,
            [item.fileName, item.imagePath || "", item.desc || "", item.link || ""]
        );
    }

    console.log(">>> ✅ 搬家完成！");
    await db.close();
}).catch(err => {
    console.error(">>> ❌ 出錯了：", err);
});