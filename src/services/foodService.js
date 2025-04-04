import db from "../models/index.js";
import { Op, Sequelize } from "sequelize";

const foodService = {
    createFood: async(data, fileName) => {
        try{
            const {dishName, description, price, categoryId, food_outstanding, quantity, banner} = data;
            if(!dishName || !description || !price || !fileName || !quantity){
                return {    
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const message = await db.Food.create({
                dishName:dishName,
                description: description,
                price: price,                                                                                  
                image: fileName,
                categoryId: categoryId,
                food_outstanding: food_outstanding,
                quantity: quantity,
                banner: banner
            })
            if(message) {
                return {
                    errCode: 0,
                    message: "Create user is success!"
                }
            }
        }catch(error){
            throw Error(error);
        }
    },
    getAllFood: async() => {
        try{
            const data = await db.Food.findAll();
            if(data){
                return{
                    errCode: 0,
                    message: data
                }
            }
        }catch(error){
            console.log('Lỗi nè', error);
            throw Error(error);
        }
    },
    getAllFoodPopular: async() => {
        try{
            const data = await db.Food.findAll({
                where: {food_outstanding: 1}
            });
            if(data){
                return{
                    errCode: 0,
                    message: data
                }
            }
        }catch(error){
            console.log('Lỗi nè', error);
            throw Error(error);
        }
    }
    ,
    getCategory: async() => {
        try{
            const data = await db.Category.findAll();
            if(data) {
                return {
                    errCode: 0,
                    message: "Lấy dữ liệu thành công!",
                    data
                }
            }
        }catch(error){
            console.logf(error);
            throw Error(error);
        }
    },
    deleteFood:async(foodId) => {
        try{
            if(!foodId){
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }

            const message = await db.Food.destroy({
                where: {id: foodId}
            })

            if(message) {
                return {
                    errCode: 0,
                    message: 'Delete food is success!'
                }
            }
        }catch(error) {
            console.log(error);
            throw Error(error);
        }
    },
    editFood: async(data, fileName) => {
        try{
            const {dishName, price, description, categoryId, foodId, food_outstanding, quantity, banner} = data;
            console.log(banner)
            if(!dishName || !price || !description || !categoryId || !quantity) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const food = await db.Food.findOne({
                where: {id: foodId}
            })
            if(!food) {
                return {
                    errCode: 2,
                    message: "Food not found!"
                }
            }
            const updateFood = {
                dishName,
                price,
                description,
                categoryId,
                food_outstanding,
                quantity,
                banner: banner
            }
            if(fileName) {
                updateFood.image = fileName;
            }
            const message = await db.Food.update(updateFood, {
                where: {id: foodId}
            });
            if(message) {
                return {
                    errCode: 0,
                    message: "Update is success!"
                }
            }
        }catch(error){
            throw Error(error);
        }
    },

    getFoodBanner: async() => {
        try{
            const data = await db.Food.findAll({
                where: {banner: 1}
            });
            if(data){
                return{
                    errCode: 0,
                    message: data
                }
            }
        }catch(error){
            console.log('Lỗi nè', error);
            throw Error(error);
        }
    },
    getProductSold: async() => {
        try{
            const product = await db.Food.findAll({
                attributes: [
                    'id',
                    'dishName',
                    [Sequelize.fn('SUM', Sequelize.col('OrderItems.quantityOrder')), 'totalSold']
                ],
                include: [
                    {
                        model: db.OrderItem,
                        attributes: [],
                        include: [{
                            model: db.Order,
                            attributes: [],
                            where: {
                                status: {
                                    [Op.or]: ['COMPLETED', 'PAID']
                                }
                            }
                        }]
                    }
                ],
                group: ['Food.id', 'Food.dishName'],
                raw: true
            })
            const result = product.map(item => ({
                productId: item.id,
                productName: item.dishName,
                totalSold: Number(item.totalSold) || 0
            })) 
            return {
                errCode: 0,
                message: "Lấy dữ liệu thành công!",
                data: result
            }
        }catch(error){
            console.log('Lỗi nè', error);
            throw Error(error);
        }
    },

    handleEvaluateProduct: async(data) => {
        try{
            const evaluateData = data;
            if(!evaluateData.userId || !evaluateData.orderId) {
                return {
                    errCode: 1,
                    message: `Thiếu thông tin người dùng hoặc mã đơn hàng!` 
                }
            }
            if(!evaluateData || typeof evaluateData !== 'object' || Object.keys(evaluateData.reviews).length === 0) {
                return {
                    errCode: 2,
                    message: "Dữ liệu không hợp lệ!"
                }
            }

            const order = await db.Order.findByPk(evaluateData.orderId);
            const user = await db.User.findByPk(evaluateData.userId);
            if(!user) {
                throw new Error(`Người dùng không tồn tại cho sản phẩm ${evaluateData.foodId}`)
            }

            if(!order) {
                throw new Error(`Không tìm thấy đơn hàng ${evaluateData.orderId}`)
            }

            for(let evaluate of evaluateData.reviews) {
                if(!evaluate.scoreEvaluate || evaluate.scoreEvaluate > 5 || evaluate.scoreEvaluate < 1) {
                    throw new Error(`Số sao không hợp lệ cho món ${evaluate.foodId}`);
                }
                if(!evaluate.foodId) {
                    throw new Error(`Thiếu foodId cho ${evaluate.foodId}`);
                }

                
                const food = await db.Food.findByPk(evaluate.foodId);
                
                if(!food){
                    throw new Error(`Món ăn không tồn tại cho món ${evaluate.foodId}`);
                }
            }

            const reviewToSave = evaluateData.reviews.map((food) => {
                return {
                    userId: evaluateData.userId,
                    orderId: evaluateData.orderId,
                    foodId: food.foodId,
                    scoreEvaluate: food.scoreEvaluate,
                    comment: food.comment || null
                }
            })

            await db.Evaluate.bulkCreate(reviewToSave, {
                validate: true
            })

            return {
                errCode: 0,
                message: "Cập nhật thông tin đánh giá thành công!",
            }
                
        }catch(error){
            throw Error(error);
        }
    },
    getEvaluateProduct: async(userId) => {
        try{
            if(!userId) {
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đây đủ thông tin!"
                }
            }

            const evaluateData = await db.Evaluate.findAll();

            if(!evaluateData) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy đánh giá nào!"
                } 
            }

            return {
                errCode: 0,
                message: "Lấy dữ liệu đánh giá thành công!",
                data: evaluateData
            }
            
        }catch(error){
            throw Error(error);
        }
    },
    getEvaluateDetailProduct: async(foodId) => {
        try{
            if(!foodId) {
                return {
                    errCode: 1,
                    message: "Vui lòng truyền đây đủ thông tin!"
                }
            }

            const evaluateData = await db.Evaluate.findAll({
                where: {
                    foodId: foodId
                },
                attributes: ['scoreEvaluate', 'userId', 'comment', 'createdAt'],
                include: [
                    {
                        model: db.User,
                        attributes: ['fullName','image'],
                    }
                ]
            })
            const totalReviews = evaluateData.length;
            const everageEvaluate = evaluateData.length > 0 ? (evaluateData.reduce((acc, curr) => {
                return acc + Number(curr.scoreEvaluate); 
            }, 0)) / totalReviews : 0;
            
            console.log(everageEvaluate);
            return {
                errCode: 0,
                message: "Lấy dữ liệu đánh giá của sản phẩm thành công!",
                everageEvaluate: everageEvaluate.toFixed(1),
                data: evaluateData
            }
            
        }catch(error){
            throw Error(error);
        }
    }
}

export default foodService;