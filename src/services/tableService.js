import db from "../models/index.js";

const tableService = {
    getAllTable: async() => {
        try{
            const data = await db.Table.findAll();
            if(!data) {
                return {
                    errCode: 1,
                    message: "Lấy dữ liệu không thành công!"
                }
            }
            return {
                errCode: 0,
                message: data
            }   
        }catch(error){
            throw Error(error);
        }
    },
    handleOrderTable: async(data) => {
        const transaction = await db.sequelize.transaction();
        try{
            const {timeFrameId, guests, orderDate, userId, tableId, messageUser, phoneNumber, status} = data;
            // const {tableId, status} = data
            
            if(!timeFrameId || !guests || !orderDate || !userId || !tableId || !phoneNumber || !status) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }

            const table = await db.Table.findOne({
                where: {id: tableId},
                transaction: transaction
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

            const orderTable = await db.OrderTable.findOne({
                where: {
                    tableId: tableId,   
                    orderDate: orderDate,
                    timeFrameId: Number(timeFrameId)
                }, 
                transaction: transaction // Sử dụng transaction
            })

            if(orderTable){
                await transaction.rollback(); // Rollback nếu có lỗi!
                return {
                    errCode: 3,
                    message: "Bàn đã được đặt trong khung giờ này!"
                }
            }

            const newOrderTable = await db.OrderTable.create({
                userId: userId,
                tableId: tableId,
                orderDate: orderDate,
                status: status,
                numberGuests: Number(guests),
                timeFrameId: timeFrameId,
                messageUser,
                onlyOrderTable: true
            }, {
                transaction: transaction
            })
            
            await table.update({
                status: 'Đã được đặt'   
            }, {
                transaction: transaction
            })

            await transaction.commit(); // Commit transaction
            
            return {
                errCode: 0,
                message: "Cập nhật trạng thái bàn thành công!",
                data: newOrderTable
            }
        }catch(error){
            await transaction.rollback(); // Rollback nếu có lỗi
            throw new Error(error);
        }
    },
    getAllTimeFrame: async() => {
        try{
            const data = await db.timeFrame.findAll();
            if(!data) {
                return {
                    errCode: 1,
                    message: "Lấy dữ liệu không thành công!"
                }
            }
            return {
                errCode: 0,
                message: "Lấy dữ liệu thành công!",
                data
            }
        }catch(error){
            throw new Error(error);
        }
    },
    handleUpdateTable: async(data) => {
        try{
            const {tableId, status} = data;
            if(!tableId || !status) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            
            const table = await db.Table.findOne({
                where: {id: tableId}
            })

            if(!table) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy bàn!"
                }
            }

            await db.Table.update({
                status: status
            }, {
                where: {id: tableId}
            })

            return {
                errCode: 0,
                message: "Cập nhật trạng thái thành công!"
            }

        }catch(error){
            throw new Error(error);
        }
    },

    handleUpdateStatusOrderTable: async(data) => {
        try{
            const {orderTableId, status} = data;
            if(!orderTableId || !status) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            
            const orderTable = await db.OrderTable.findOne({
                where: {id: orderTableId}
            })

            if(!orderTable) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy đơn đặt bàn!"
                }
            }

            await db.OrderTable.update({
                status: status
            }, {
                where: {id: orderTableId}
            })

            return {
                errCode: 0,
                message: "Cập nhật trạng thái thành công!"
            }

        }catch(error){
            throw new Error(error);
        }
    }
}

export default tableService;