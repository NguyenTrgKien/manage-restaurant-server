import db from "../models/index.js";
import paymentService from "./paymentService.js";

const orderService = {
    handleOrder: async(data) => {
        const transaction = await db.sequelize.transaction();
        try{
            const { userId,  product, amount, paymentMethod, status, quantityOrder, fullName } = data;
            if(!userId) {
                return {
                    errCode: 1,
                    message: "Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ."
                }
            }
            if(product.length === 0 || !amount || !paymentMethod || !quantityOrder || !status || !fullName) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const newOrder = await db.Order.create({ // Lưu dữ liệu cho bảng order
                userId,
                totalAmount: amount,
                paymentMethod,
                status,
                fullName
            }, {transaction});

            if(!newOrder) {
                await transaction.rollback();
                return {
                    errCode: 2,
                    message: "Thêm dữ liệu không thành công!"
                } 
            }
            const orderItem = product.map((item) => ({ // Thêm dữ liệu vào bảng orderItem tương ứng với bảng order thông qua orderId và gồm các món ăn liên kết với bảng food thông qua foodId
                orderId: newOrder.id,
                foodId: item.id,
                quantityPro: item.quantityPro,
                price: item.price,
                totalPrice: item.price * item.quantity,
                quantityOrder: quantityOrder[item.id]
            }));
            
            await db.OrderItem.bulkCreate(orderItem, {transaction});

            for(const item of product) {
                const food = await db.Food.findOne({
                    where: {id: item.id},
                    transaction
                })

                if(!food) {
                    await transaction.rollback();
                    return {
                        errCode: 3,
                        message: `Không tìm thấy món ăn ${item.dishName}`
                    }
                }

                if(food.quantity < quantityOrder[item.id]) {
                    await transaction.rollback();
                    return {
                        errCode: 4,
                        message: `Số lượng của món ${food.dishName} không đủ! Chỉ còn lại ${food.quantity}`
                    }
                }

                await db.Food.update({
                    quantity: food.quantity - quantityOrder[item.id]
                }, {
                    where: {id: food.id},
                    transaction
                })
            }

            const orderId = `${newOrder.id}_${Date.now()}`;


            const paymentUrl = await paymentService.handleCreatePaymentMomo(amount, orderId);
            await transaction.commit();
            // Hủy đơn hàng nếu không thanh toán sau 10 phút
            setTimeout(async() => {
                const order = await db.Order.findOne({
                    where: {id: newOrder.id}
                });
                if(order && order.status === 'PENDING') {
                    await order.destroy({
                        where: {id: newOrder.id}
                    });
                    console.log(`Đơn hàng ${newOrder.id} đã bị hủy do không thanh toán!`)
                }

            }, 1000 * 60 * 10);

            if(paymentUrl.resultCode === 0) {
                return {
                    errCode: 0,
                    message: "Lưu dữ liệu thành công!",
                    paymentUrl
                }
            }

        }catch(error){
            await transaction.rollback();
            throw Error(error);
        }
    },

    handleOrderDishTable: async(data) => {
        const transaction = await db.sequelize.transaction();
        try{
            const {amount, guests, messageUser, orderDate, paymentMethod, phoneNumber, product, status, tableId, timeFrameId, userId, quantityOrder, fullName
            } = data;
            if(!amount || !guests || !orderDate || !quantityOrder || !status || !paymentMethod || !tableId || !timeFrameId || !userId || !fullName) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const table = await db.Table.findOne({
                where: {id: tableId},
                transaction
            });

            if(!table) {
                await transaction.rollback(); // Rollback nếu có lỗi!
                return {
                    errCode: 1,
                    message: "Không tìm thấy bàn!"
                }
            }
            if(table.status === 'Đã được đặt' || table.status === 'Đang sử dụng'){
                await transaction.rollback(); // Rollback nếu có lỗi!
                return {
                    errCode: 2,
                    message: "Bàn đã được đặt hoặc đang được sử dụng!"
                }
            }
            const orderTable = await db.OrderTable.create({
                userId: userId,
                tableId: tableId,
                orderDate: orderDate,
                status: 'Đã đặt',
                numberGuests: guests,
                timeFrameId: timeFrameId,
                messageUser,
                onlyOrdertable: false
            }, {
                transaction
            })
                
            await table.update({
                status: 'Đã được đặt'   
            }, {
                transaction
            })
            
            if(!product || product.length === 0) {
                await transaction.commit(); // Commit transaction
                return {
                    errCode: 0,
                    message: "Cập nhật trạng thái bàn thành công!"
                }
            }else{ // Nếu có order thêm món ăn
                const newOrder = await db.Order.create({ // Lưu dữ liệu cho bảng order
                    userId,
                    totalAmount: amount,
                    paymentMethod,
                    status,
                    orderTableId: orderTable.id ,
                    fullName 
                }, {
                    transaction
                })
                if(!newOrder) {
                    await transaction.rollback();
                    return {
                        errCode: 2,
                        message: "Thêm dữ liệu không thành công!"
                    } 
                }
                const orderItem = product.map((item) => ({ // Thêm dữ liệu vào bảng orderItem tương ứng với bảng order thông qua orderId và gồm các món ăn liên kết với bảng food thông qua foodId
                    orderId: newOrder.id,
                    foodId: item.id,
                    quantityPro: item.quantityPro,
                    price: item.price,
                    totalPrice: item.price * item.quantity,
                    quantityOrder: quantityOrder[item.id]
                }));
                
                await db.OrderItem.bulkCreate(orderItem, {transaction});
                for(const item of product) {
                    const food = await db.Food.findOne({
                        where: {id: item.id},
                        transaction
                    })
                    if(!food) {
                        await transaction.rollback();
                        return {
                            errCode: 4,
                            message: `Không tìm thấy món ăn ${food.id}!`
                        }
                    }

                    if(food.quantity < quantityOrder[food.id]){
                        await transaction.rollback();
                        return {
                            errCode: 5,
                            message: `Số lượng món ${food.dishName} không đủ! Chỉ còn lại ${food.quantity}`
                        }
                    }

                    await db.Food.update({
                        quantity: food.quantity - quantityOrder[food.id]
                    }, {
                        where: {id: food.id},
                        transaction
                    })
                }
                const orderId = `${newOrder.id}_${Date.now()}`;
    
                const paymentUrl = await paymentService.handleCreatePaymentMomo(amount, orderId);
                if(paymentUrl.resultCode !== 0) {
                    await transaction.rollback();
                    return {
                        errCode: 3,
                        message: "Lỗi khi tạo thanh toán MOMO!"
                    }
                }
                await transaction.commit(); // Chỉ commit khi mọi thứ đã xong
                // Hủy đơn hàng nếu không thanh toán sau 10 phút
                setTimeout(async() => {
                    const order = await db.Order.findOne({
                        where: {id: newOrder.id}
                    });
                    if(order && order.status === 'PENDING') {
                        await order.destroy();
                        console.log(`Đơn hàng ${newOrder.id} đã bị hủy do không thanh toán!`)
                    }
                }, 1000 * 60 * 5);
                return {
                    errCode: 0,
                    message: "Lưu dữ liệu thành công!",
                    paymentUrl
                }
            }
        }catch(error){
            console.log(error);
            if(transaction){
                await transaction.rollback(); 
            }
            throw new Error(error);
        }
    },

    handlePaymentAtRestaurant: async(data) => {
        const transaction = await db.sequelize.transaction(); // Tạo transaction
        try{
            const {amount, paymentMethod, status, product, userId, quantityOrder, fullName} = data;
            if(!amount || !status || !paymentMethod || !userId || !quantityOrder || product.length === 0 || !fullName) {
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đầy đủ dữ liệu!"
                }
            }

            const newOrder = await db.Order.create({ // Lưu dữ liệu cho bảng order
                userId,
                totalAmount: amount,                        
                paymentMethod,
                status,
                fullName
            }, {
                transaction
            })
            if(!newOrder) {
                await transaction.rollback(); 
                return {
                    errCode: 2,
                    message: "Thêm dữ liệu không thành công!"
                } 
            }
            const orderItem = product.map((item) => ({ // Thêm dữ liệu vào bảng orderItem tương ứng với bảng order thông qua orderId và gồm các món ăn liên kết với bảng food thông qua foodId
                orderId: newOrder.id,
                foodId: item.id,
                quantityPro: item.quantityPro,
                price: item.price,
                totalPrice: item.price * item.quantity,
                quantityOrder: quantityOrder[item.id]
            }));
            
            await db.OrderItem.bulkCreate(orderItem, {transaction});

            for(const item of product) {
                const food = await db.Food.findOne({
                    where: {id: item.id},
                    transaction
                })

                if(!food) {
                    await transaction.rollback();
                    return {
                        errCode: 3,
                        message: `Không tìm thấy món ăn ${item.dishName}`
                    }
                }

                if(food.quantity < quantityOrder[item.id]) {
                    await transaction.rollback();
                    return {
                        errCode: 4,
                        message: `Số lượng của món ${food.dishName}! Chỉ còn lại ${food.quantity}`
                    }
                }

                await db.Food.update({
                    quantity: food.quantity - quantityOrder[item.id]
                }, {
                    where: {id: food.id},
                    transaction
                })
            }
            await transaction.commit();
            return {
                errCode:0,
                message: "Đặt hàng thành công!",
                detailOrder: newOrder
            }
        }catch(error){
            console.log(error);
            await transaction.rollback();
            throw new Error(error);
        }
    },

    handlePaymentTableAtRestaurant: async(data) => {
        const transaction = await db.sequelize.transaction();
        try{
            const {amount, guests, messageUser, orderDate, paymentMethod, phoneNumber, product, status, tableId, timeFrameId, userId, quantityOrder, fullName} = data;
            if(!amount || !guests || !orderDate || !quantityOrder || !status || !paymentMethod || !tableId || !timeFrameId || !userId || !fullName) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const table = await db.Table.findOne({
                where: {id: tableId},
                transaction
            });

            if(!table) {
                await transaction.rollback(); // Rollback nếu có lỗi!
                return {
                    errCode: 1,
                    message: "Không tìm thấy bàn!"
                }
            }
            if(table.status === 'Đã được đặt' || table.status === 'Đang sử dụng'){
                await transaction.rollback(); // Rollback nếu có lỗi!
                return {
                    errCode: 2,
                    message: "Bàn đã được đặt hoặc đang được sử dụng!"
                }
            }
            const orderTable = await db.OrderTable.create({
                userId: userId,
                tableId: tableId,
                orderDate: orderDate,
                status: 'PENDING',
                numberGuests: guests,
                timeFrameId: timeFrameId,
                messageUser,
                onlyOrdertable: false
            }, {
                transaction
            })
                
            await table.update({
                status: 'Đã được đặt'   
            }, {
                transaction
            })
            
            if(!product || product.length === 0) {
                await transaction.commit(); // Commit transaction
                return {
                    errCode: 0,
                    message: "Cập nhật trạng thái bàn thành công!"
                }
            }else{ // Nếu có order thêm món ăn
                const newOrder = await db.Order.create({ // Lưu dữ liệu cho bảng order
                    userId,
                    totalAmount: amount,
                    paymentMethod,
                    status,
                    orderTableId: orderTable.id,
                    fullName  
                }, {
                    transaction
                })
                if(!newOrder) {
                    await transaction.rollback();
                    return {
                        errCode: 2,
                        message: "Thêm dữ liệu không thành công!"
                    } 
                }
                const orderItem = product.map((item) => ({ // Thêm dữ liệu vào bảng orderItem tương ứng với bảng order thông qua orderId và gồm các món ăn liên kết với bảng food thông qua foodId
                    orderId: newOrder.id,
                    foodId: item.id,
                    quantityPro: item.quantityPro,
                    price: item.price,
                    totalPrice: item.price * item.quantity,
                    quantityOrder: quantityOrder[item.id]
                }));
                
                await db.OrderItem.bulkCreate(orderItem, {transaction});

                for(const item of product) {
                    const food = await db.Food.findOne({
                        where: {id: item.id},
                        transaction
                    })

                    if(!food) {
                        await transaction.rollback();
                        return {
                            errCode: 3,
                            message: `Không tìm thấy món ăn ${item.dishName}`
                        }
                    }
                    if(food.quantity < quantityOrder[item.id]) {
                        await transaction.rollback();
                        return {
                            errCode: 4,
                            message: `Số lượng món ${food.dishName} không đủ! Chỉ còn lại ${food.quantity}`
                        }
                    }

                    await db.Food.update({
                        quantity: food.quantity - quantityOrder[item.id]
                    }, {
                        where: {id: food.id},
                        transaction
                    })
                }                
                await transaction.commit();

                return {
                    errCode: 0,
                    message: "Đặt hàng thành công!",
                    detailOrder: newOrder
                }
            }
        }catch(error){
            console.log(error);
            await transaction.rollback(); 
            throw new Error(error);
        }
    },

    handleCancelOrder: async(orderId) => {
        try{
            if(!orderId) {
                return {
                    errCode: 1,
                    message: "Vui long truyền đầy đủ thông tin!"
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
                status: 'CANCELLED'
            },{
                where: {id: order.id}
            })

            return {
                errCode: 0,
                message: "Hủy đơn hàng thành công!"
            }

        }catch(error){
            console.log(error);
            await transaction.rollback(); 
            throw new Error(error);
        }
    },

    handleCheckOrderTableDist: async(data) => {
        try{
            const { orderDate, tableId, timeFrameId,} = data;
            if(!orderDate || !tableId || !timeFrameId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const date = new Date(orderDate);
            const orderTable = await db.OrderTable.findOne({
                where: {
                    timeFrameId: timeFrameId,
                    tableId: tableId,
                    orderDate: date
                }
            },);
            if(!orderTable) {
                return {
                    errCode: 0,
                    message: "Không có người đặt!"
                }
            }

            return {
                errCode: 1,
                message: 'Đã có người đặt!'
            }

        }catch(error){
            console.log(error);
            // await transaction.rollback(); 
            throw new Error(error);
        }
    },
    
}

export default orderService;