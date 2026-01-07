const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { json } = require('stream/consumers');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/ser02images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

//指定資料夾 時間當檔名 保留副檔名
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        const jsonPath = './ser02images/images.json';

        const gallery = await  fs.readJson(jsonPath);

        const newItem = {
            id: Date.now(),
            fileName: req.file.filename,
            desc: req.body.desc || '' ,
            link: req.body.link || ''
        };

        gallery.push(newItem);

        await fs.writeJson(jsonPath, gallery, { spaces: 2 });

        res.json({ success: true, item: newItem });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
//收圖片 讀寫json 新增一筆資料 存回去 回傳成功

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});