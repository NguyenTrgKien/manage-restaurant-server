import express from 'express';
import cors from 'cors';
const app = express()
import dotenv from 'dotenv'; // Import thư viện dotenv
import connectDB from './config/database.js'; // Phải import đường dẫn đầy đủ
import initRoute from './routes/initRoute.js';
import configEngine from './config/configEngine.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';

dotenv.config(); // Nạp tất cả các biến môi trường vào process.env

// Cấu hình session để có thể làm việc với cookie
// Express-session sẽ gửi session Id này về client
// Session Id này giống như một chìa khóa dùng để lấy dữ liệu từ session được lưu trên server
// Việc kiểm tra session id có hợp lệ hay không là do thư viện express-session tự động thực hiện 
// Khi express-session kiểm tra session Id hợp lệ thì nó sẽ tự gán user vào session và chúng ta chỉ cân kiểm tra req.session.user có tồn tại hay không
app.use(session({ 
  secret: "super_secret_key_kien@",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Không cho phép chỉ gửi thông qua https
    httpOnly: false, // Không thẻ truy cập được bằng Javascript
    maxAge: 1000 * 60 * 60 // Thời gian sống của cookie (1 giờ)
  }
})); 
   
app.use(cookieParser());
connectDB(); // Kết nối tới Cơ Sở Dữ Liệu
configEngine(app);
app.use(cors({
  origin: ['https://nguyentrgkien.github.io/mange-restaurant-ui', 'https://nguyentrgkien.github.io'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization',  'ngrok-skip-browser-warning']
}));
initRoute(app);

 
const port = process.env.PORT || 1000; 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})