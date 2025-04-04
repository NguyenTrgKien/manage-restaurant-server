// File này dùng để kết nối sequelize tới Nodejs
// const { Sequelize } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('railway', 'root', "HqEcUecQHKeIVoPKURDxKfpxCCPYllwL", { 
  host: 'mainline.proxy.rlwy.net',
  dialect: 'mysql' ,
  logging: false
}); 

const connectDB = async () => { // Tạo một hàm gọi liền
    try{
        await sequelize.authenticate();
        console.log("Kết nối đến Cơ Sở Dữ Liệu Thành Công!");
    }catch(error){
        console.error("Không thể kết nối tới Cơ Sở Dữ Liệu!");
    }
};

// export default connectDB;
module.exports = connectDB;