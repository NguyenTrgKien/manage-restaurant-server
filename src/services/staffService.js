import db from "../models/index.js";
import bcrypt from 'bcrypt';
import {Op} from 'sequelize';

const staffService = {
    createStaff: async(data, filename) => {
        try{
            const {email, password, positionId, fullName, statusId, phoneNumber, salary, gender, startDate} = data;
            if(!email || !password || !positionId || !fullName || !statusId || !salary || !phoneNumber || !startDate || !gender || !filename){
                return {
                    errCode: 1,
                    message: "Vui lòng nhập đầy đủ thông tin!"
                }
            }
            const isEmail = await db.User.findOne({
                where: {email: email}
            })
            if(isEmail) {
                return {
                    errCode: 2,
                    message: "Email đã tồn tại! Vui lòng nhập email khác."
                }
            }
            const saltRounds = 10; // Số vòng xử lý dùng để tạo salt 
            // Hash là một hàm bất đồng bộ
            const hashPasword = await bcrypt.hash(password, saltRounds); // Tạo một chuỗi hash từ password với 10 dòng xử lý salt

            const user = await db.User.create({
                fullName: fullName,
                email,
                password: hashPasword,
                role: 'staff',
                image: filename
            })

            if(user) {
                const userId = user.id;
                const message = await db.Staff.create({
                    positionId,
                    statusId,
                    salary,
                    gender,
                    userId,
                    startDate,
                    phoneNumber
                })
                if(message) {
                    return {
                        errCode: 0,
                        message: "Create Staff is success!"
                    }
                }
            }
            return {
                errCode: 2,
                message: "Create Staff fail!"
            }

        }catch(error){
            throw Error(error);
        }
    },
    getAllStaff: async() => {
        try{
            const data = await db.User.findAll({
                where: { role: 'staff' },
                include: {
                    model: db.Staff,
                    attributes:['id', 'positionId', 'salary', 'statusId', 'startDate', 'phoneNumber', 'userId']
                },
                attributes: ['id', 'fullName', 'email', 'image','createdAt', 'updatedAt'],
                raw: true,
                nest: true
            });
            if(data){
                const formattedData = data.map(user => ({
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    image: user.image,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    ...user.Staff
                }));
                return {
                    errCode: 0,
                    message: "Get staff is success!",
                    data: formattedData
                }
            }
        }catch(error){
            throw Error(error);
        }
    },
    getDetailStaff: async(staffId) => {
        try{
            const data = await db.User.findOne({
                where: {
                    role: "staff",
                },
                attributes: ['email','fullName', 'createdAt', 'updatedAt'],
                include: {
                    model: db.Staff,
                    where: {id: staffId}
                },
                raw: true,
                nest: true
            })
            if(data){
                const formatData = {
                    ...data,
                    ...data.Staff
                }
                delete formatData.Staff
                return {
                    errCode: 0,
                    message: "Get detail Staff is success!",
                    formatData
                }
            }
        }catch(error){
            console.log(error);
            throw Error(error);
        }
    },
    getStatusStaff: async() => {
        try{
            const data = await db.Status.findAll()
            if(data) {
                return {
                    errCode: 0,
                    message: data
                }
            }
        }catch(error) {
            throw Error(error);
        }        
    },
    getPositionStaff: async() => {
        try{
            const data = await db.Position.findAll()
            if(data) {
                return {
                    errCode: 0,
                    message: data
                }
            }
        }catch(error) {
            throw Error(error);
        }        
    },
    editStaff: async(data, filename) => {
        try{
            console.log(data);
            const {email, password, positionId, fullName, statusId, phoneNumber, salary, gender, startDate, userId} = data;
            if(email) {
                const isEmail = await db.User.findOne({
                    where: {
                        email: email,
                        id: {[Op.ne]: userId}
                    }
                })
                if(isEmail){
                    return {
                        errCode: 1,
                        message: "Email đã tồn tại! Vui lòng chọn email khác."
                    }
                }
            }
            const user = await db.User.findOne({
                where: {id: userId},
                
            })
            if(!user) {
                return {
                    errCode: 2,
                    message: "Không tìm thấy người dùng!"
                }
            }
            const staff = await db.Staff.findOne({
                where: {userId: userId}
            })
            if(!staff) {
                return {
                    errCode: 3,
                    message: "Không tìm thấy nhân viên!"
                }
            }
            let hashPasword = user.password;
            if(password) {
                const saltRounds = 10;
                hashPasword = await bcrypt.hash(password, saltRounds);
            }
            const userUpdate = {
                fullName: fullName,
                email: email,
                password: hashPasword
            }
            if(filename) {
                userUpdate.image = filename;
            }
            await user.update(userUpdate)
            const updateData = {
                positionId: positionId,
                statusId: statusId,
                salary: salary,
                gender: gender,
                userId: userId,
                startDate: startDate,
                phoneNumber: phoneNumber,
            }
            await staff.update(updateData);
            return {
                errCode: 0,
                message: "Edit Staff is success!"
            }
        }catch(error){
            console.log(error);
            throw Error(error);
        }
    },
    deleteStaff: async(userId) => {
        try{
            const user = await db.User.findOne({
                where: {id: userId}
            })
            if(!user) {
                return {
                    errCode: 1,
                    message: "Không tìm thấy người dùng!"
                }
            }
            await user.destroy();
            return {
                errCode: 0,
                message: "Delete user os success!"
            }
        }catch(error){
            throw Error(error);
        }
    }
}

export default staffService;