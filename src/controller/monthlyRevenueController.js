import monthlyRevenueService from "../services/monthlyRevenueService.js";

const monthlyRevenueController = {
    getMonthlyRevenue: async(req, res) => {
        try{
            const data = await monthlyRevenueService.getMonthlyRevenue();
            return res.status(200).json(data);
        }catch(error){
            console.log(error);
            return res.status(500).json({
                errCode: -1,
                message: "Server Error!"
            })
        }
    }
}

export default monthlyRevenueController;