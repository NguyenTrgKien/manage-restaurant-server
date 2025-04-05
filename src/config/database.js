import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_DATABASE || "railway",
  process.env.DB_USERNAME || "root",
  process.env.DB_PASSWORD || "HqEcUecQHKeIVoPKURDxKfpxCCPYllwL",
  {
    host: process.env.DB_HOST || "mainline.proxy.rlwy.net",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 17820,
    logging: false,
    dialectOptions: {
      connectTimeout: 20000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối đến Cơ Sở Dữ Liệu Thành Công!");
  } catch (error) {
    console.error("Không thể kết nối tới Cơ Sở Dữ Liệu:", error);
  }
};

export default connectDB;