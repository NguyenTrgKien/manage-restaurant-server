import express from 'express';
import userController from '../controller/userController.js';
import foodController from '../controller/foodController.js';
import upload from '../config/multerConfig.js';
import staffController from '../controller/staffController.js';
import paymentService from '../services/paymentService.js';
import orderController from '../controller/orderController.js';
import tableController from '../controller/tableController.js';
import monthlyRevenueController from '../controller/monthlyRevenueController.js';
const router = express.Router();

const authMiddlwware = (req, res, next) => { // Tạo middleware để chặn người dùng chưa đăng nhập
    // middleware mặc định có 3 tham số (req, res, next)
    // next(): hàm callback để chuyển tiếp request sang middleware tiếp theo hoặc route Handler
    if(!req.session.user) {
        return res.status(200).json({
            errCode: 1,
            message: "Chưa đăng nhập! Anh đã chặn."
        })
    }
    next();
}

const initRoute = (app) => {
    router.get('/api/v1/get-all-user', userController.getAllUser);

    router.post('/api/v1/user-login', userController.handleLoginUser);

    router.post('/api/v1/auth-login-google', userController.handleAuthLoginGoogle);

    router.post('/api/v1/user-register', userController.handleRegisterUser);

    router.get('/api/v1/check-login',authMiddlwware, userController.checkLogin);

    router.get('/api/v1/get-cart/:userId', userController.getCart);

    router.post('/api/v1/add-product-cart', userController.handleAddProductCart);

    router.put('/api/v1/update-all-cart', userController.handleUpdateAllCart);

    router.put('/api/v1/update-quantity-order-cart', userController.handleUpdateQuantityOrderCart);

    router.delete('/api/v1/delete-product-cart', userController.handleDeleteProductCart);

    router.delete('/api/v1/delete-all-cart', userController.handleDeleteAllCart);

    router.post('/api/v1/logout', userController.handleLogOut);

    router.get('/api/v1/get-profile-user/:userId', userController.getProfileUser);

    router.put('/api/v1/update-profile-user', upload.single('image'), userController.handleUpdateProfileUser);

    router.get('/api/v1/get-food-type', foodController.getFoodType);

    router.get('/api/v1/get-food-banner', foodController.getFoodBanner);

    // single('image') -> image là tên file sẽ được upload lên server
    router.post('/api/v1/create-food',upload.single('image'), foodController.handleCreateFood);

    router.get('/api/v1/get-all-food', foodController.getAllFood);
    
    router.put('/api/v1/edit-food', upload.single('image'), foodController.handleEditFood);
    
    router.get('/api/v1/get-all-food-popular', foodController.getAllFoodPopular);
    
    router.delete('/api/v1/delete-food/:foodId', foodController.handleDeleteFood);

    router.get('/api/v1/get-category', foodController.getCategory);

    router.post('/api/v1/create-staff', upload.single('image'), staffController.handleCreateStaff);

    router.get('/api/v1/get-all-staff', staffController.getAllStaff);

    router.get('/api/v1/get-detail-staff', staffController.getDetailStaff);

    router.get('/api/v1/get-status-staff', staffController.getStatusStaff);

    router.get('/api/v1/get-position-staff', staffController.getPositionStaff);

    router.put('/api/v1/edit-staff',upload.single('image'), staffController.handleEditStaff);

    router.delete('/api/v1/delete-staff', staffController.handleDeleteStaff);

    router.post('/api/v1/create-admin', upload.single('image'), userController.handleCreateAdmin);

    router.post('/create_payment_url', paymentService.handleCreatePayment);

    router.post('/api/v1/order', orderController.handleOrder);

    // Vui lòng tham khảo thêm tại code demo
    
    router.post('/api/v1/payment-momo-url', paymentService.handleCreatePaymentMomo);

    router.post('/payment-callback', paymentService.handlePaymentCallback);

    router.post('/api/v1/transaction-status', paymentService.handleTransactionStatus);
    
    router.post('/api/v1/transaction-status', paymentService.handleTransactionStatus);      
 
    router.get('/api/v1/get-all-table', tableController.getAllTable);   

    router.put('/api/v1/update-table', tableController.handleUpdateTable);   

    router.put('/api/v1/update-status-order-table', tableController.handleUpdateStatusOrderTable);   

    router.post('/api/v1/order-table', tableController.handleOrderTable);

    router.get('/api/v1/get-all-time-frame', tableController.getAllTimeFrame);

    router.post('/api/v1/payment-dish-table', orderController.handleOrderDishTable);

    router.post('/api/v1/check-order-table-dish', orderController.handleCheckOrderTableDist);

    router.post('/api/v1/payment-at-restaurant', orderController.handlePaymentAtRestaurant);

    router.post('/api/v1/payment-table-at-restaurant', orderController.handlePaymentTableAtRestaurant);

    router.put('/api/v1/cancel-order/:orderId', orderController.handleCancelOrder);

    router.get('/api/v1/get-user-order-history/:userId', userController.getAllUserOrderHistory);

    router.get('/api/v1/get-user-order-table-history/:userId', userController.getDetailOrderTableHistory);

    router.get('/api/v1/get-detail-order/:orderId', userController.getDetailOrder);

    router.get('/api/v1/get-detail-order-table/:orderTableId', userController.getDetailOrderTable);
    
    router.get('/api/v1/get-all-order-dish-for-admin', userController.getAllOrderDishForAdmin);

    router.get('/api/v1/get-all-order-table-dish-for-admin', userController.getAllOrderTableDishForAdmin);

    router.put('/api/v1/auth-payment', userController.handleAuthpayment);

    router.get('/api/v1/get-monthly-revenue', monthlyRevenueController.getMonthlyRevenue);

    router.get('/api/v1/get-product-sold', foodController.getProductSold);

    router.post('/api/v1/post-evaluate-product', foodController.handleEvaluateProduct);

    router.get('/api/v1/get-evaluate-product/:userId', foodController.getEvaluateProduct);

    router.get('/api/v1/get-evaluate-detail-product/:foodId', foodController.getEvaluateDetailProduct);

    router.get('/', (req, res) => {
        res.send('Server đang chạy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    })

    return app.use("/", router);
}

export default initRoute;