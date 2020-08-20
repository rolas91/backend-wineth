const axios = require('axios');
const db = require('../server/config/db');
const Payment = require('../models/Payments');
const Matrix = require('../models/Matrix');
const Users = require('../models/Users');
exports.GetProfitsData = async(req, res) => {
    try {
        let userId = 0;
        if(req.userid != undefined){
            userId = req.userid
        }else{
            userId = req.params.id
        }             
        const getProfits = await Payment.findAll({
            where:{
                userId:userId
            },
            include:[
                { model:Users }
            ]
        });        
        res.status(200).json({getProfits})
    } catch (error) {
        console.error(error);
        res.status(400).json({status:400, message:'error server'})
    }
}
exports.GetProfits = async(req, res) => {
    try { 
      
        let userId = 0;
        if(req.userid != undefined){
            userId = req.userid
        }else{
            userId = req.params.id
        }
        getPartners(userId)

        const eth = 'eth';      
        const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${eth}`,{
            headers: {
                'X-CMC_PRO_API_KEY': 'f78fa793-b95e-4a58-a0ef-760f070defb0'
            },
        })  
        
        const ethPriceUsd = response.data.data.ETH.quote.USD.price;
        const payment = await Payment.findAll({
            where:{
                userId: userId
            },
            attributes: [[db.fn('sum', db.col('amount')), 'total']],	                        
            raw: true,            
            order: db.literal('total DESC')
        })

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
async function getPartners(user){
    try {
        let nivel1 = await Matrix.count({
            where:{
                spillOver:user
            },            
        }) 
        console.log(nivel1)       
    } catch (error) {
        console.log(error)
    }
}
async function getDescendingLine(spillOver){
    let nivel1 = await Matrix.count({
        where:{
            spillOver:spillOver
        },            
    })
}

