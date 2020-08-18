const axios = require('axios');
const db = require('../server/config/db');
const Payment = require('../models/Payments');



exports.GetProfits = async(req, res) => {
    try {   
        const total = 0;
        const eth = 'eth';      
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${eth}`,{
            headers: {
                'X-CMC_PRO_API_KEY': 'f78fa793-b95e-4a58-a0ef-760f070defb0'
            },
        })  
        const ethPriceUsd = response.data.data.ETH.quote.USD.price;
        const payment = await Payment.findAll({
            where:{
                userId: req.userid
            },
            attributes: [[db.fn('sum', db.col('amount')), 'total']],	                        
            raw: true,            
            order: db.literal('total DESC')
        })

        // total = ()
        
        res.status(200).json({
            status:200,
            profits:parseFloat(payment[0].total),
            usdProfits:parseFloat((parseFloat(payment[0].total)*ethPriceUsd).toFixed(2)),
            partners:1
        })
        
    } catch (error) {
        res.status(400).json({status:400, message:`please check error ${error}`})
    }
}
async function getPartners(){
    
}