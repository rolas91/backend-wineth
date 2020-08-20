const axios = require('axios');
const db = require('../server/config/db');
const Payment = require('../models/Payments');
const Matrix = require('../models/Matrix');
const Users = require('../models/Users');
const ActiveBucket = require('../models/ActiveBuckets');
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

        const eth = 'eth';      
        const rqResponse =  axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${eth}`,{
            headers: {
                'X-CMC_PRO_API_KEY': 'f78fa793-b95e-4a58-a0ef-760f070defb0'
            },
        })                 
        const rqPayment =  Payment.findAll({
            where:{
                userId: userId
            },
            attributes: [[db.fn('sum', db.col('amount')), 'total']],	                        
            raw: true,            
            order: db.literal('total DESC')
        })        
        const rqlastBucket = await ActiveBucket.findAll({
            where:{userId:userId}, 
            order: [ [ 'id', 'DESC' ]]
        });        
        const rqTotal = getDescendingLine(userId);        
        const [response, payment, total, lastBucket] = await Promise.all([rqResponse, rqPayment, rqTotal, rqlastBucket]);

        const ethPriceUsd = response.data.data.ETH.quote.USD.price;
        res.status(200).json({
            status:200,
            profits:parseFloat(payment[0].total),
            usdProfits:parseFloat((parseFloat(payment[0].total) * ethPriceUsd).toFixed(2)),
            partners: total,  
            lastBucket:lastBucket[0].bucketId          
        })
        
    } catch (error) {
        res.status(400).json({status:400, message:`please check error ${error}`})
    }
}

const getDescendingLine = async(userid) => {
    let level1 = []
    let level2 = []
    let level3 = [];

    let getOrderMatixSponsor =  await Matrix.findOne({
        where:{userid},        
    });            
    for(let i=0; i < 1; i++){        
        let response = await Matrix.findAll({
            where:{spillOver:getOrderMatixSponsor.orderMatrix},            
        })               
        for(let a=0; a<response.length; a++){                       
            level1.push({               
                id:response[a].userId,                                                                                                        
            })
        }        
        for(let j=0; j<response.length; j++){
            let response2 = await Matrix.findAll({
                where:{spillOver:response[j].orderMatrix},               
            })                                                                          
            for(let s=0; s<response2.length; s++){                                                                           
                level2.push({                   
                    id:response2[s].userId,                                                                                                                        
                })
            }            
            for(let y=0; y<response2.length; y++){
                let response3 = await Matrix.findAll({
                    where:{spillOver:response2[y].orderMatrix},                   
                })                 
                for(let r=0; r<response3.length; r++){
                    level3.push({                        
                        id:response3[r].userId                                                               
                    }) 
                }                       
           }
        }
    }        
    return level1.length + level2.length + level3.length;      
}



