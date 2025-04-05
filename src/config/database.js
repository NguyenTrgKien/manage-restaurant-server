// File này dùng để kết nối sequelize tới Nodejs
// const { Sequelize } = require('sequelize');
// const Sequelize = require('sequelize');
import { Sequelize } from "sequelize";

const sequelize = new Sequelize('railway', 'root', "HqEcUecQHKeIVoPKURDxKfpxCCPYllwL", { 
  host: 'mainline.proxy.rlwy.net',
  dialect: 'mysql',
  port: 17820,
  logging: false,
  dialectOptions: {
    connectTimeout: 20000, // Tăng ti   meout lên 20 giây
  }
}); 

const connectDB = async () => { // Tạo một hàm gọi liền
    try{
        await sequelize.authenticate();
        console.log("Kết nối đến Cơ Sở Dữ Liệu Thành Công!");
    }catch(error){
        console.error("Không thể kết nối tới Cơ Sở Dữ Liệu!");
    }
}
export default connectDB;
