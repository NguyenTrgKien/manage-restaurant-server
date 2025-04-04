import db from "../models/index.js";
import userService from "../services/userService.js";


export const userController = {
    getAllUser : async(req, res) => {
        try{
            const data = await userService.getAllUser();
            if(data.errCode == 0) {
                return res.status(200).json(data);
            }
        }catch(error){
            return res.status(200).json({
                errCode: 1,
                message: "Server Error!"
            })
        }
    },
    handleLoginUser : async(req, res) => {
        // Client gửi email && password (login) lên server
        // Server kiểm tra thông tin hợp lệ -> Lưu user vào session
        // Server gửi cookie (connect.sid) về client

        // Khi user load lại trình duyệt tự động gửi cookie.sid lên server 
        // Server tìm session tương ứng -> kiểm tra xem có user hay không
        // Nếu tồn tại  trả về user
        // Nếu hết hạng hoặc không tìm thấy -> bắt buộc nhập lại
        try{
            const {email, password} = req.body;
            const result = await userService.loginUser(email, password);
            if(result.errCode === 0) {
                req.session.user = result.user;
            }
            return res.status(200).json(result);
        }catch(error){
            console.log("Lỗi nè------------>",error);
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleAuthLoginGoogle: async(req, res) => {
        try{
            const message = await userService.handleAuthLoginGoogle(req.body);
            if(message.errCode === 0) {
                req.session.user = message.user;
            }
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    checkLogin: async(req, res) => {
        // Client chỉ gửi session ID trong cookie(connect.sid) lên server và server kiểm tra nếu session ID hợp lệ 
        try{
            const user = await db.User.findOne({
                where: {id: req.session.user.id},
                attributes: { exclude: ["password"] }, // Loại bỏ password khi trả về
            })
            if(!user) {
                return res.status(404).json({
                    errCode: 5,
                    message: "Không tìm thấy người dùng!"
                })
            }
            return res.status(200).json({
                errCode: 0,
                login: true,
                user
            })
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Lỗi Server, vui lòng thử lại sau!"
            })
        }
        
    },
    handleRegisterUser: async(req, res) => {
        try{
            const message = await userService.handleRegisterUser(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Lỗi Server, vui lòng thử lại sau!"
            })
        }
        
    },
    handleLogOut: async(req, res) => {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).json({
                    message: 'Lỗi khi đăng xuất!'
                })
            }
            res.clearCookie('connect.sid'); // Xóa cookie session
            return res.status(200).json({
                errCode: 0,
                message: "Đăng xuất thành công!"
            })
        })
    },
    getProfileUser: async(req, res) => {
        try{
            const {userId} = req.params;
            const message = await userService.getProfileUser(userId);
            return res.status(200).json(message);
        }catch(error) {
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleUpdateProfileUser: async(req, res) => {
        try{
            console.log('Ảnh nè ----------------->',req.body);
            const filename = req.file ? `uploads/${req.file.filename}` : null;
            const message = await userService.handleUpdateProfileUser(req.body, filename);
            return res.status(200).json(message);
        }catch(error) {
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleCreateAdmin: async(req, res) => {
        try{
            console.log(req.body);
            const file = req.file ? `uploads/${req.file.filename}` : null;
            const message = await userService.createAdmin(req.body, file);
            return res.status(200).json(message);
        }catch(error) {
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getCart: async(req, res) => {
        try{
            const {userId} = req.params;
            const data = await userService.getCart(userId);
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleAddProductCart: async(req, res) => {
        try{
            const message = await userService.handleAddProductCart(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Sever Error!"
            })
        }
    },
    handleUpdateQuantityOrderCart: async(req, res) =>  {
        try{
            const data = req.body;
            console.log(data);
            const message = await userService.handleUpdateQuantityOrderCart(data);
            return res.status(200).json(message);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"  
            }) 
        }
    },
    handleDeleteProductCart: async(req, res) => {
        try{
            const {userId, foodId} = req.query;
            console.log(userId, foodId);
            const message = await userService.handleDeleteProductCart(userId, foodId);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleUpdateAllCart: async(req, res) => {
        try{
            const message = await userService.handleUpdateAllCart(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleDeleteAllCart: async(req, res) => {
        try{
            const {userId} = req.query;
            const message = await userService.handleDeleteAllCart(userId);
            return res.status(200).json(message);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },

    getAllUserOrderHistory: async(req, res) => {
        try{
            const {userId} = req.params;
            console.log(userId);
            const dataHistory = await userService.getAllUserOrderHistory(userId);
            return res.status(200).json(dataHistory);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getDetailOrderTableHistory: async(req, res) => {
        try{
            const {userId} = req.params;
            console.log(userId);
            const dataHistory = await userService.getDetailOrderTableHistory(userId);
            return res.status(200).json(dataHistory);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    }
    ,
    getAllOrderDishForAdmin: async(req, res) => {
        try{
            const data = await userService.getAllOrderDishForAdmin();
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getAllOrderTableDishForAdmin: async(req, res) => {
        try{
            const data = await userService.getAllOrderTableDishForAdmin();
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    }
    ,
    handleAuthpayment : async(req, res) => {
        try{
            const {orderId, status} = req.body;
            console.log(orderId, status);
            const data = await userService.handleAuthpayment(req.body);
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getDetailOrder: async(req, res) => {
        try{
            const orderId = req.params.orderId;
            const data = await userService.getDetailOrder(orderId);
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },

    getDetailOrderTable: async(req, res) => {
        try{
            const {orderTableId} = req.params;
            const data = await userService.getDetailOrderTable(orderTableId);
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    }
}

export default userController;