import db from "../models/index.js";
import { literal, Sequelize } from "sequelize";

const monthlyRevenueService = {
    getMonthlyRevenue: async(req, res) => {
        try{
            // const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (1-12)
            // const year = new Date().getFullYear();

            // const revenueData = await db.Order.findAll({
            //     attributes: [
            //         [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
            //         [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'revenue']
            //     ],
            //     where: {
            //         status: 'PAID',
            //         createdAt: { [Sequelize.Op.between]: [`${year}-01-01`, `${year}-${currentMonth}-31`] } // Chỉ lấy đến tháng hiện tại
            //     },
            //     group: ['month'],
            //     order: [['month', 'ASC']]
            // });

            // const revenueMap = {};
            // revenueData.forEach(row => {
            //     revenueMap[row.dataValues.month] = row.dataValues.revenue;
            // });

            // // Tạo danh sách từ tháng 1 đến tháng hiện tại
            // const fullData = [];
            // for (let i = 1; i <= currentMonth; i++) {
            //     const month = `${year}-${i.toString().padStart(2, '0')}`;
            //     fullData.push({
            //         month,
            //         revenue: revenueMap[month] || 0
            //     });
            // }

            // return {
            //     errCode: 0,
            //     message: "Lấy dữ liệu thành công!",
            //     fullData
            // };
            let numCustomer = 0;
            let numOrder = 0; 
            const revenueData = await db.Order.findAll({
                attributes: [
                  [Sequelize.fn("DAYNAME", Sequelize.col("createdAt")), "day"],
                  [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "revenue"],
                ],
                where: {
                  createdAt: {
                    [Sequelize.Op.gte]: Sequelize.literal("CURDATE() - INTERVAL 7 DAY"),
                  },
                  status: 'PAID'
                },
                group: ["day"],
                order: [
                    [Sequelize.fn("FIELD", Sequelize.col("day"), "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")],
                ],
                raw: true,
            });

            numOrder = await db.Order.count({ // Điếm số đơn hàng
                where: {
                    createdAt: {
                        [Sequelize.Op.gte]: literal("CURDATE() - INTERVAL 7 DAY"),
                    },
                    status: 'PAID'
                }
            })
            
            numCustomer = await db.Order.count({ // Điếm số khách hàng
                where: {
                    createdAt: {
                        [Sequelize.Op.gte]: literal("CURDATE() - INTERVAL 7 DAY"),
                    },
                    status: "PAID",
                },
                distinct: true,
                col: "userId",
            })

            // Danh sách thứ trong tuần (để đảm bảo đủ 7 ngày)
            const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            // Chuyển dữ liệu thành object để dễ xử lý
            const revenueMap = revenueData.reduce((acc, { day, revenue }) => {
                acc[day] = revenue || 0; // Nếu null thì gán 0
                return acc;
            }, {});

            // Đảm bảo đủ 7 ngày
            const formattedRevenueData = weekDays.map(day => ({
                day,
                revenue: revenueMap[day] || 0
            }));
            return {
                errCode: 0,
                message: "Lấy dữ liệu thành công!",
                data: {
                    revenueData: formattedRevenueData,
                    numCustomer,
                    numOrder 
                } 
            }  
        }catch(error){
            throw new Error(error);
        }
    }
}

export default monthlyRevenueService;