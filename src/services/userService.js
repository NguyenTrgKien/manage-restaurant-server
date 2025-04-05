import db from '../models/index.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GG_CLIENT_ID);

const userService = {
    getAllUser : async () => {
        try{
            const data = await db.User.findAll();
            if(data){
                return {
                    errCode: 0,
                    message: data
                }
            }
        }catch(error) {
            throw new Error(error);
        }
    } ,
    loginUser : async(email, password) => {
        try{
            if(!email || !password){
                return {
                    errCode: 1,
                    message: "Vui lòng nhập đầy đủ thông tin!"
                }
            }
            const user = await db.User.findOne({
                where: {email: email},
            });
            if(!user){
                return {
                    errCode: 2,
                    message: "Email không tồn tại! Vui lòng đăng kí tài khoản."
                }
            }
            const isPassword = await bcrypt.compare(password, user.password);
            if(!isPassword){
                return {
                    errCode: 3,
                    message: "Mật khẩu không đúng!"
                }
            }
            return {
                errCode: 0,
                message: "Login success!",
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    image: user.image,
                    role: user.role
                }
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    getProfileUser: async(userId) => {
        try{
            if(!userId){
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đầy đủ thông tin!"
                }
            }

            const user = await db.User.findOne({
                where: {id: userId},
                attributes: ['fullName', 'image', 'role', 'email', 'id'],
                include: [{
                    model: db.Staff,
                    require: false
                }, {
                    model: db.Customer,
                    require: false
                }]
            })

            if(!user) {
                return {
                    errCode: 2,
                    message: "Người dùng không tồn tại!"
                }
            }
            const profileData = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                image: user.image || 'Chưa cập nhật',
                role: user.role || 'Chưa cập nhật',
                phoneNumber: user.phoneNumber || "Chưa cập nhật",
                address: user.address || "Chưa cập nhật",
                gender: user.gender || "Chưa cập nhật",
                birthday: user.birthday || "Chưa cập nhật"
            }

            if(user.role === 'user' && user.Customer) {
                profileData.phoneNumber = user.Customer.phoneNumber || "Chưa cập nhật";
                profileData.address = user.Customer.address || "Chưa cập nhật";
                profileData.birthday = user.Customer.birthday || "Chưa cập nhật";
                profileData.gender = user.Customer.gender || "Chưa cập nhật";
            } else if(user.role === 'staff' && user.Staff) {
                profileData.phoneNumber = user.Staff.phoneNumber || "Chưa cập nhật";
                profileData.address = user.Staff.address || "Chưa cập nhật";
                profileData.birthday = user.Staff.birthday || "Chưa cập nhật";
                profileData.gender = user.Staff.gender || "Chưa cập nhật";
                profileData['StaffInfo'] = {
                    startDate: user.Staff.startDate,
                    positionId: user.Staff.positionId,
                    salary: user.Staff.salary,
                    createdAt: user.Staff.createdAt,
                }
            }else if(user.role === 'Admin') {
                return {
                    errCode: 0,
                    message: "Đây là tài khoản ADMIN!",
                    data: user
                }
            }
            return {
                errCode: 0,
                message: "Lấy thông tin người dùng thành công!",
                data: profileData
            }

        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    handleUpdateProfileUser: async(data, fileName) => {
        try{
            console.log(fileName);
            const {fullName, address, phoneNumber, birthday, gender, userId} = data;
            if(!userId){
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đầy đủ thông tin!"
                }
            }

            const user = await db.User.findOne({
                where: {id: userId}
            })

            if(!user) {
                return {
                    errCode: 2,
                    message: "Người dùng không tồn tại!"
                }
            }

            await db.User.update({
                fullName: fullName,
                image: fileName
            }, {
                where: {id: user.id}
            })

            if(user.role === 'user') {
                await db.Customer.update({
                    address: address,
                    phoneNumber: phoneNumber,
                    birthday: birthday,
                    gender: gender
                }, {
                    where: {userId: user.id}
                })
            }else if(user.role === "staff") {
                await db.Staff.update({
                    address: address,
                    phoneNumber: phoneNumber,
                    birthday: birthday,
                    gender: gender
                }, {
                    where: {userId: user.id}
                })
            }

            return {
                errCode: 0,
                message: "Cập nhật thông tin người dùng thành công!",
            }

        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    },
    handleAuthLoginGoogle: async(data) => {
        try{
            const {token} = data;
            console.log(token)
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GG_CLIENT_ID
            })
            const payload = ticket.getPayload();
            console.log(payload);
            const {email, name, picture : image, sub: userId} = payload;
            console.log(name)
            let user = await db.User.findOne({
                where: {email: email}
            })

            if(!user) {
                await db.User.create({
                    email,
                    fullName: name,
                    image: image,
                    role: 'user'
                })
            }else{
                await db.User.update({
                  image: image,
                  fullName: name,
                }, {
                    where: {email: email}
                })
            }

            user = await db.User.findOne({
                where: {email: email}
            })

            return {
                errCode: 0,
                message: "Đăng nhập thành công!",
                user: {
                    email: user.email,
                    image: user.image,
                    name: name,
                    id: user.id,
                    role: user.role
                }
            }
        }catch(error){
            throw new Error(error);
        }
    },
    handleRegisterUser: async(data) => {
        try{
            const {fullName, passwordRegister, emailRegister, phoneNumber, role} = data;
            if(!fullName || !passwordRegister || !emailRegister || !phoneNumber || !role) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const user = await db.User.findOne({
                where: {email: emailRegister}
            })
            if(user) {
                return {
                    errCode: 2,
                    message: "Email đã được sử dụng!"
                }
            }
            const hashPasword = await bcrypt.hash(passwordRegister, 10);
            const createUser = await db.User.create({
                fullName,
                email: emailRegister,
                password: hashPasword,
                role
            })

            await db.Customer.create({
                fullName,
                userId: createUser.id,
                phoneNumber,
            })

            return {
                errCode: 0,
                message: "Tạo ngừi dùng thành công!"
            }
        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    }, 
    createAdmin: async(data, filename) =>{
        try{
            const {email, password, role, fullName} = data;
            if(!email || !password || !role || !fullName || !filename) {
                return {
                    errCode: 1,
                    message: "Mising require parameter!"
                }
            }
            const user = await db.User.findOne({
                where: {email: email}
            })
            if(user) {
                return {
                    errCode: 1,
                    message: "Email đã tồn tại!"
                }
            }
            const saltRounds = 10;
            const hashPasword = await bcrypt.hash(password, saltRounds);
            await db.User.create({
                email 
                ,password: hashPasword
                ,role 
                ,fullName
                ,image: filename
            })
            return {
                errCode: 0,
                message: "Tạo admin thành công!"
            }
        }catch(error){
            throw Error(error);
        }
    } ,
    getCart: async(userId) => {
        try{
            const cart = await db.Cart.findOne({
                where: {userId: userId}
            });

            if(!cart) {
                return {
                    errCode: 1,
                    message: "Không tìm thấy giỏ hàng!"
                }
            }

            const cartItem = await db.CartItem.findAll({
                where: {cartId: cart.id}
            })

            return {
                errCode: 0,
                message: "Lấy giỏ hàng thành công!",
                cartItem
            }
        }catch(error){
            throw new Error(error);
        }
    },
    handleAddProductCart: async(data) => {
        try{
            const {userId, foodId, quantityOrder} = data;
            if(!userId || !foodId || !quantityOrder) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }

            let cart = await db.Cart.findOne({
                where: {userId: userId}
            })

            if(!cart) {
                cart = await db.Cart.create({
                    userId
                })
            }

            const check = await db.CartItem.findOne({
                where: {cartId: cart.id, foodId: foodId}
            })

            if(check) {
                return {
                    errCode: 2,
                    message: "Sản phẩm đã có trong giỏ hàng!"
                }
            }
            const dataProduct = await db.CartItem.create({
                cartId: cart.id,
                foodId,
                quantityOrder
            })
            return {
                errCode: 0,
                message: "Thêm sản phẩm thành công!",
                dataProduct
            }
        }catch(error){
            throw new Error(error);
        }
    },
    handleUpdateQuantityOrderCart: async(data) => {
        try{
            const {quantityOrder, foodId, userId} = data;
            if(!quantityOrder || !foodId || !userId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            
            let cart = await db.Cart.findOne({
                where: {userId: userId}
            })

            if(!cart) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy giỏ hàng!"
                }
            }

            const cartItem = await db.CartItem.findOne({
                where: {foodId: foodId, cartId: cart.id}
            })

            if(!cartItem) {
                return {
                    errCode: 3,
                    message: "Sản phẩm không có trong giỏ hàng!"
                }
            }

            await db.CartItem.update({
                quantityOrder: quantityOrder,
                
            }, {
                where: {foodId: foodId, cartId: cart.id}
            })

            return {
                errCode: 0,
                message: "Cập nhật thành công !"
            }

        }catch(error){
            throw new Error(error);
        }
    } ,
    handleDeleteProductCart: async(userId, foodId) => {
        try{
            if(!foodId || !userId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            
            let cart = await db.Cart.findOne({
                where: {userId: userId}
            })

            if(!cart) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy giỏ hàng!"
                }
            }
            
            const cartItem = await db.CartItem.findOne({
                where: {cartId: cart.id, foodId: foodId}
            })

            await cartItem.destroy({
                where: {foodId: foodId}
            });

            return {
                errCode: 0,
                message: "Xóa thành công!"
            }

        }catch(error){
            throw new Error(error);
        }
    },
    handleDeleteAllCart: async(userId) => { 
        try{
            if(!userId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            console.log(userId)
            let cart = await db.Cart.findOne({
                where: {userId: userId}
            })

            console.log('nè-----',cart)

            if(!cart) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy giỏ hàng!"
                }
            }
            
            await db.Cart.destroy({
                where: {userId: userId}
            })

            return {
                errCode: 0,
                message: "Xóa toàn bộ giỏ hàng thành công!"
            }

        }catch(error){
            throw new Error(error);
        }
    },
    handleUpdateAllCart: async(data) => {
        try{    
            const {userId, cart} = data;
            if(!cart || cart?.length === 0 || !userId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            
            let cartUser = await db.Cart.findOne({
                where: {userId: userId}
            })

            if(!cartUser) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy giỏ hàng!"
                }
            }

            const cartItem = await db.CartItem.findAll({
                where: {cartId: cartUser.id}
            })
            if(!cartItem) {
                return {
                    errCode: 3,
                    message: "Không tìm thấy sản phẩm!"
                }
            }
            for(let item of cartItem) {
                const updateItem = cart.find((it) => it.foodId == item.foodId);
                if(updateItem) {
                    await db.CartItem.update(
                        {quantityOrder: updateItem.quantityOrder},
                        {where: {id: item.id}}
                    )
                }
            }

            return {
                errCode: 0,
                message: "Cập nhật thành công!"
            }

        }catch(error){
            throw new Error(error);
        }
    },
    getAllUserOrderHistory: async(userId) => {
        try{
            if(!userId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const order = await db.Order.findAll({
                where: {userId: userId},
                include: [{
                    model: db.OrderItem,
                    include: [{model: db.Food}]
                }, {
                    model: db.OrderTable,
                    include: [{model: db.Table}]
                }] // Lấy luôn orderItem liên quan                
            })

            if(!order) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy đơn hàng!"
                }
            }
            
            return {
                errCode: 0,
                message: "Lấy lịch sử thành công!",
                data: order,
            }
        }catch(error){
            throw new Error(error);
        }
    },
    getDetailOrderTableHistory: async(userId) => {
        try{
            if(!userId) {
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đầy đủ thông tin!"
                }
            }
            
            const orderTable = await db.OrderTable.findAll({
                where: {
                    userId: userId,
                    onlyOrderTable: true
                },
                include: {
                    model: db.Table
                }
            });

            if(!orderTable) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy lịch sử đơn hàng!"
                }
            }
            
            return {
                errCode: 0,
                message: "Lấy dơn hàng thành công!",
                data: orderTable,
            }
        }catch(error){
            throw new Error(error);
        }
    }
    ,
    getAllOrderDishForAdmin: async() => {
        try{
            const order = await db.Order.findAll({
                where: {orderTableId: null},
                include: [{
                    model: db.OrderItem,
                    include: [{model: db.Food}]
                }]
            });

            if(!order) {
                return {
                    errCode: 2,
                    message: "Không có đơn hàng nào!"
                }
            }
            
            return {
                errCode: 0,
                message: "Lấy dơn hàng thành công!",
                data: order,
            }
        }catch(error){
            throw new Error(error);
        }
    },
    getAllOrderTableDishForAdmin:  async() => {
        try{
            
            const order = await db.Order.findAll({
                include: [{
                    model: db.OrderItem,
                    include: [{model: db.Food}]
                }, {
                    model: db.OrderTable,
                    where: {onlyOrderTable: false},
                    include: [{
                        model: db.Table
                    }]
                }]
            });

            if(!order) {
                return {
                    errCode: 2,
                    message: "Không có đơn hàng nào!"
                }
            }
            
            return {
                errCode: 0,
                message: "Lấy dơn hàng thành công!",
                data: order,
            }
        }catch(error){
            throw new Error(error);
        }
    }
    ,
    handleAuthpayment: async(data) => {
        try{
            const {orderId, status} = data;
            if(!orderId || !status) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const order = await db.Order.findOne({
                where: {id: orderId}
            })
            if(!order) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy đơn hàng!"
                }
            }
            await db.Order.update({
                status: status
            }, {
                where: {id: orderId}
            })
            return {
                errCode: 0,
                message: "Cập nhật trạng thái đơn hàng thành công!"
            }
        }catch(error){
            throw new Error(error);
        }
    },
    getDetailOrder: async(orderId) => {
        try{
            if(!orderId) {
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đầy đủ thông tin!"
                }
            }
            const order = await db.Order.findOne({
                where: {id: orderId},
                include: [{
                    model: db.OrderItem,
                    include: {
                        model: db.Food
                    },
                },{
                    model: db.OrderTable,
                    include: {
                        model: db.Table
                    }
                } 
            ]
            })

            if(!order) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy đơn hàng!"
                }
            }
            return {
                errCode: 0,
                message: "Lấy thông tin đơn hàng thành công!",
                data: order
            }
        }catch(error){
            throw new Error(error);
        }
    },
    getDetailOrderTable: async(orderTableId) => {
        try{
            if(!orderTableId) {
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đầy đủ thông tin!"
                }
            }
            const orderTable = await db.OrderTable.findOne({
                where: {id: orderTableId},
                include: [{
                    model: db.Table
                }]
            })

            if(!orderTable) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy đơn hàng!"
                }
            }
            return {
                errCode: 0,
                message: "Lấy thông tin đơn hàng thành công!",
                data: orderTable
            }
        }catch(error){
            throw new Error(error);
        }
    }
}

export default userService;