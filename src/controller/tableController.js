import tableService from "../services/tableService.js";

const tableController = {
    getAllTable: async(req, res) => {
        try{
            const data = await tableService.getAllTable();
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleOrderTable: async(req, res) => {
        try{
            const data = req.body;
            console.log(data);
            const message = await tableService.handleOrderTable(data);
            return res.status(200).json(message);
        }catch(error){
            console.log('Lỗi nè ----->',error);          
            return res.status(500).json({    
                errCode: -1,
                message: "Server Error!"  
            })
        }
    } ,

    getAllTimeFrame: async(req, res) => {
        try{
            const data = await tableService.getAllTimeFrame();
            return res.status(200).json(data);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    handleUpdateTable: async(req, res) => {
        try{
            const data = await tableService.handleUpdateTable(req.body);
            return res.status(200).json(data);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },

    handleUpdateStatusOrderTable: async(req, res) => {
        try{
            const data = await tableService.handleUpdateStatusOrderTable(req.body);
            return res.status(200).json(data);
        }catch(error){
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    }
}

export default tableController;