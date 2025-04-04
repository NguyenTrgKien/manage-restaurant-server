import multer from 'multer';
import path from 'path';
import appRootPath from 'app-root-path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(appRootPath.path, 'uploads')); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Lấy đuôi file gốc
        cb(null, `image-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
    }
});

const upload = multer({ storage });

export default upload;