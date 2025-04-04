import foodService from "../services/foodService.js";

const foodController = {
    handleCreateFood: async(req, res) => {
        try{
            const filename = req.file ? `uploads/${req.file.filename}` : null;
            const message = await foodService.createFood(req.body, filename);
            if(message.errCode === 0) {
                return res.status(200).json(message);
            }else{
                return res.status(200).json(message);
            }
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getAllFood: async(req, res) => {
        try{
            const data = await foodService.getAllFood();
            if(data.errCode === 0) {
                return res.status(200).json(data);
            }
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleEditFood: async(req, res) => {
        try{
            const fileName = req.file ? `uploads/${req.file.filename}` : null;
            const message = await foodService.editFood(req.body, fileName);
            return res.status(200).json(message);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getFoodType: async(req, res) => {
        try{
            const data = await foodService.getFoodType();
            return res.status(200).json(data);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getFoodBanner: async(req, res) => {
        try{
            const data = await foodService.getFoodBanner();
            return res.status(200).json(data);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Missing require parameter!"
            })
        }
    },
    
    getAllFoodPopular: async(req, res) => {
        try{
            const data = await foodService.getAllFoodPopular();
            if(data.errCode === 0) {
                return res.status(200).json(data);
            }
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getCategory: async(req, res) => {
        try{
            const data = await foodService.getCategory();
            return res.status(200).json(data);            
        }catch(error) {
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleDeleteFood: async(req, res) => {
        try{
            const {foodId} = req.params;
            const message = await foodService.deleteFood(foodId);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Error Server!"
            })
        }
    },

    getProductSold: async(req, res) => {
        try{
            const message = await foodService.getProductSold();
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Error Server!"
            })
        }
    },

    handleEvaluateProduct: async(req, res) => {
        try{
            console.log(req.body);
            const message = await foodService.handleEvaluateProduct(req.body);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Error Server!"
            })
        }
    } ,

    getEvaluateProduct: async(req, res) => {
        try{
            const {userId} = req.params;
            const message = await foodService.getEvaluateProduct(userId);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Error Server!"
            })
        }
    }  ,

    getEvaluateDetailProduct: async(req, res) => {
        try{
            const {foodId} = req.params;
            const message = await foodService.getEvaluateDetailProduct(foodId);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Error Server!"
            })
        }
    }  
    
}

export default foodController;