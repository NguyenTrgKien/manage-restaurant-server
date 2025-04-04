import staffService from "../services/staffService.js";

const staffController = {
    handleCreateStaff: async(req, res) => {
        try{
            console.log(req.body);
            const filename = req.file ? `uploads/${req.file.filename}` : null;
            console.log(filename);
            const message = await staffService.createStaff(req.body, filename);
            return res.status(200).json(message);
        }catch(error) {
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getAllStaff: async(req, res) => {
        try{
            const data = await staffService.getAllStaff();
            return res.status(200).json(data);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getDetailStaff: async(req, res) => {
        try{
            const staffId = req.query.staffId;
            if(!staffId) {
                return res.status(200).json({
                    errCode: 1,
                    message: "Missing require parameter!"
                })
            }
            const data = await staffService.getDetailStaff(staffId);
            return res.status(200).json(data);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    },
    getStatusStaff: async(req, res) => {
        try{
            const data = await staffService.getStatusStaff();
            return res.status(200).json(data);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: 'Server Error!'
            })
        }
    },
    getPositionStaff: async(req, res) => {
        try{
            const data = await staffService.getPositionStaff();
            return res.status(200).json(data);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: 'Server Error!'
            })
        }
    },
    handleEditStaff: async(req, res)  => {
        try{
            const filename = req.file ? `uploads/${req.file.filename}` : null;
            const message = await staffService.editStaff(req.body, filename);
            return res.status(200).json(message);
        }catch(error){
            return res.status(200).json({
                errCode: -1,
                message: 'Error Server!'
            })
        }
    },
    handleDeleteStaff: async(req, res) => {
        try{
            const userId = req.query.userId;
            if(!userId) {
                return {
                    errCode: 1,
                    message: "Missing require parameter!"
                }
            }
            const message = await staffService.deleteStaff(userId);
            return res.status(200).json(message);
        }catch(error){
            console.log(error);
            return res.status(200).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    }
}

export default staffController;