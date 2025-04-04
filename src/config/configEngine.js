const express = require('express');
const appRoot = require("app-root-path");// Giúp điều hướng tới thư mục dự án hiện tại src
const path = require('path');

const configEngine = (app) => {
    app.use(express.urlencoded({extended: true})); // Giúp express phân tích phần body thành JSON khi người dùng gửi dữ liệu bằng from của HTML
    app.use(express.json()); // Giúp express phân tích body thành JSON khi người dùng gửi dữ liệu lên bằng js
    // app.use(express.static(path.join(appRoot.path, '/uploads'))); // Chỉ định thư mục chứa các file tĩnh
    app.use('/uploads', express.static(path.join(appRoot.path, 'uploads')));

}

// export default configEngine;
module.exports = configEngine;