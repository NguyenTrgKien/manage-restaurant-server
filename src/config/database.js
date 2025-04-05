import { Sequelize } from "sequelize";

// Khởi tạo Sequelize với biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME || "railway",          // Tên database
  process.env.DB_USER || "root",             // Tên người dùng
  process.env.DB_PASSWORD || "QjFueGmXyIqzBCorKcrJZaQPvcDELfEd", // Mật khẩu
  {
    host: process.env.DB_HOST || "mainline.proxy.rlwy.net", // Host
    dialect: "mysql",                               // Loại database
    port: process.env.DB_PORT || 17820,             // Port
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