import db from "../models/index.js";

const updateOrderStatus = async(orderId, status) => {
    try{
        const realOrderId = orderId.split("_")[0];
        const order = await db.Order.findOne({
            attributes: ['id', 'status'],
            where: {id: Number(realOrderId)},
        });
        
        if (!order) {
            console.log(`Không tìm thấy đơn hàng: ${orderId}`);
            return false;
        }

        const message = await order.update({
            status: status
        })

        if(!message) {
            console.log("Má nó lỗi nữa ừ: >>>>", message);
        }
        console.log(`Đơn hàng ${orderId} đã cập nhật trạng thái: ${status}`);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export default updateOrderStatus;