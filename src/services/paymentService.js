import querystring from 'qs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import moment from 'moment';
import axios from 'axios';
import updateOrderStatus from './updateOrderService.js';

dotenv.config(); // Load biến môi trường từ .env
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

const paymentService = {
    handleCreatePayment: async(req, res) => {
        try{
            
                process.env.TZ = 'Asia/Ho_Chi_Minh';
                
                let date = new Date();
                let createDate = moment(date).format('YYYYMMDDHHmmss');
                
                let ipAddr = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
                
                let tmnCode = process.env.VNP_TMNCODE;
                let secretKey = process.env.VNP_HASHSECRET;
                let vnpUrl = process.env.VNP_URL;
                let returnUrl = process.env.VNP_RETURNURL;
                let orderId = moment(date).format('DDHHmmss');
                let amount = req.body.amount;
                let bankCode = req.body.bankCode;
                
                let locale = req.body.language;
                if(locale === null || locale === ''){
                    locale = 'vn';
                }
                let currCode = 'VND';
                let vnp_Params = {};
                vnp_Params['vnp_Version'] = '2.1.0';
                vnp_Params['vnp_Command'] = 'pay';
                vnp_Params['vnp_TmnCode'] = tmnCode;
                vnp_Params['vnp_Locale'] = locale;
                vnp_Params['vnp_CurrCode'] = currCode;
                vnp_Params['vnp_TxnRef'] = orderId;
                vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
                vnp_Params['vnp_OrderType'] = 'other';
                vnp_Params['vnp_Amount'] = amount * 100;
                vnp_Params['vnp_ReturnUrl'] = returnUrl;
                vnp_Params['vnp_IpAddr'] = ipAddr;
                vnp_Params['vnp_CreateDate'] = createDate;
                if(bankCode !== null && bankCode !== ''){
                    vnp_Params['vnp_BankCode'] = bankCode;
                }

                const sortObject = (obj) => {
                    let sorted = {};
                    let keys = Object.keys(obj).sort(); // Sắp xếp keys theo thứ tự bảng chữ cái
                    keys.forEach((key) => {
                        sorted[key] = obj[key];
                    });
                    return sorted;
                };
            
                // Sắp xếp tham số trước khi tạo chữ ký
                vnp_Params = sortObject(vnp_Params);

                // Tạo chuỗi dữ liệu để ký
                let signData = querystring.stringify(vnp_Params, { encode: false });

                // Tạo chữ ký SHA512
                let hmac = crypto.createHmac("sha512", secretKey);
                let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

                // Thêm chữ ký vào params
                vnp_Params['vnp_SecureHash'] = signed;
                vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
            
                res.json({
                    paymentUrl: vnpUrl
                })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Lỗi khi tạo thanh toán", error
        })
    }
    },
    handleCreatePaymentMomo: async(amount, orderId) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
        var orderInfo = 'pay with MoMo';
        var partnerCode = process.env.PARTNERCODE;
        var redirectUrl = process.env.REDIRECTURL;
        var ipnUrl = process.env.IPNURL;
        var requestType = "payWithMethod";
        var amount = amount * 1000 || '50000';
        var orderId = orderId || partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData ='';
        var orderGroupId ='';
        var autoCapture =true;
        var lang = 'vi';
        
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode : partnerCode,
            partnerName : "Test",
            storeId : "MomoTestStore",
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            lang : lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData : extraData,
            orderGroupId: orderGroupId,
            signature : signature
        });

        // Option axios
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody)
            },
            data: requestBody
        }
        let result;
        try{
            result = await axios(options);
            return result.data;
        }catch(error){
            return res.status(500).json({
                statusCode: 500,
                message: "Server Error!"
            })

        }
    },
    handlePaymentCallback: async (req, res) => {
        console.log("callback------------->");
        console.log(req.body);
        console.log("Thành công hay thất bại cũng trả về hết nè-------------->");
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            signature
        } = req.body;

        try {
            // 🔹 **Đảm bảo extraData luôn có giá trị**
            // const safeExtraData = extraData || ""; 

            // 🔹 **Tạo rawSignature đúng thứ tự MoMo yêu cầu**
            // const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${safeExtraData}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
            
            // 🔹 **Tạo chữ ký SHA256**
            // const expectedSignature = crypto
            //     .createHmac("sha256", process.env.MOMO_SECRET_KEY)
            //     .update(rawSignature)
            //     .digest("hex");

            // 🔹 **Kiểm tra chữ ký**
            // if (signature !== expectedSignature) {
            //     console.log("🚨 Signature không hợp lệ!");
            //     return res.status(400).json({ message: "Invalid signature" });
            // }

            // 🔹 **Kiểm tra kết quả giao dịch**
            if (resultCode !== 0) {
                console.log(`Giao dịch thất bại:`);
                await updateOrderStatus(orderId, "FAILED");
                return res.status(400).json({ message: "Payment failed" });
            }

            // 🔹 **Cập nhật trạng thái đơn hàng thành công**
            const message = await updateOrderStatus(orderId, "PAID");
            if(message) {
                console.log('Thành công!');
                return res.status(200).json({
                    message: "🎉 Thanh toán thành công!",
                });
            }

        } catch (error) {
            console.log("🚨 Xử lý callback: bị lỗi ----->", error);
            return res.status(500).json({
                message: "Server Error!",
            });
        }
    },
    
    handleTransactionStatus: async(req, res) => {
        const {orderId} = req.body;
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const signature = crypto
            .createHmac("sha256" , secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: "MOMO",
            requestBody: orderId,
            orderId,
            signature,
            lang: 'vi'
        })

        // option for axios
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/query',
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        }
        let result = await axios(options);
        return res.status(200).json(result.data)
    },
    
}
// {
//     partnerCode: 'MOMO',
//     orderId: 'MOMO1741835002433',
//     requestId: 'MOMO1741835002433',
//     amount: 50000,
//     orderInfo: 'pay with MoMo',
//     orderType: 'momo_wallet',
//     transId: 4365824174,
//     resultCode: 0,
//     message: 'Successful.',
//     payType: 'napas',
//     responseTime: 1741835074529,
//     extraData: '',
//     signature: '1229d79f80c28eeaf0e24b9c6b46be2d44f4883ee8bde53c2116848d5d27a9c3'
//   }

//  https://eb1a-2402-800-63b5-89ac-99ad-deb9-983f-e6d2.ngrok-free.app

export default paymentService;



