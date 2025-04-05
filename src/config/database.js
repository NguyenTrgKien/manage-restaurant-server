import { Sequelize } from "sequelize";

// Khởi tạo Sequelize với biến môi trường
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,          // Tên database
  process.env.MYSQLUSER,             // Tên người dùng
  process.env.MYSQLPASSWORD, // Mật khẩu
  {
    host: process.env.MYSQLHOST, // Host
    dialect: "mysql",                               // Loại database
    port: process.env.MYSQLPORT || 17820,             // Port
    logging: false,                                 // Tắt log SQL
    dialectOptions: {
      connectTimeout: 20000,                       // Timeout 20 giây
    },
  }
);

// Hàm kết nối cơ sở dữ liệu
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối đến Cơ Sở Dữ Liệu Thành Công!");
  } catch (error) {
    console.error("Không thể kết nối tới Cơ Sở Dữ Liệu:", error);
  }
};

export default connectDB;