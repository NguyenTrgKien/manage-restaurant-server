import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || "railway",
  process.env.MYSQLUSER || "root",
  process.env.MYSQLPASSWORD || "auAdrAVmFkquAMKLJkhDVisPqgkDvJPP",
  {
    host: process.env.MYSQLHOST || "shuttle.proxy.rlwy.net",
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.MYSQLPORT || 52639,
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
    process.exit(1);
  }
};

export default connectDB;