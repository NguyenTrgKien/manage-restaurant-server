import orderService from "../services/orderService.js";

const orderController = {
    handleOrder: async(req, res) => {
        try{
            const message = await orderService.handleOrder(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log("lỗi nè", error);
            return res.status(200).json({
                message: "Server Error!"
            })
        }
    },

    handleOrderDishTable: async(req, res) => {
        try{
            console.log(req.body);
            const message = await orderService.handleOrderDishTable(req.body);
            return res.status(200).json(message);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },

    handlePaymentAtRestaurant: async(req, res) => {
        try{
            console.log('Tao nè--------------------->')
            console.log(req.body);
            const message = await orderService.handlePaymentAtRestaurant(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })  
        }
    },

    handlePaymentTableAtRestaurant: async(req, res) => {
        try{
            console.log(req.body);
            const message = await orderService.handlePaymentTableAtRestaurant(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleCancelOrder: async(req, res) => {
        try{
            const {orderId} = req.params;
            const message = await orderService.handleCancelOrder(orderId);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleCheckOrderTableDist: async(req, res) => {
        try{
            console.log(req.body);
            const message = await orderService.handleCheckOrderTableDist(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    } 
}

export default orderController;