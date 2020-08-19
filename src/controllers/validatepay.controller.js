const axios = require('axios');
const moment = require('moment');
const PaymentStatus = require('../models/PaymentStatus');
const Payment = require('../models/Payments');
const ActiveBucket = require('../models/ActiveBuckets');
exports.VerifyPay = async(req, res) => {
    try {
        const {hash, amount,walletReceived,receiveId, bucketId} = req.body;
        const userId = req.userid;
        const amountToEightDecimal = parseFloat(amount).toFixed(8)
        const arraymi = new Array();           
        const response = await axios.get(`https://api.blockcypher.com/v1/eth/main/txs/${hash}`);        
        console.log(response)
        response.data.outputs.forEach(output =>{             
            arraymi.push(((output.value)*0.000000000000000001).toFixed(8).toString())
        });        
        let walletstring = walletReceived;
        let wallet = walletstring.substr(2);                
        if(response.data.addresses.includes(wallet.toLowerCase())) {                   
            if (arraymi.includes(amountToEightDecimal)) {      
                const paymentState = await PaymentState(userId, bucketId);   
                if(paymentState === 3){
                    createOrupdateActiveBucket(userId, bucketId)
                }                            
                Payment.create({
                    userId: receiveId,
                    sender: userId,
                    amount: amount,
                    bucketId:bucketId,
                    date:new Date()
                })
                res.status(200).json({ status:200, validate:true, message:'the transaction was successful'})
            } else {
                res.status(200).json({ status:400,message:'you did not send the amount necessary to accept your transaction'})
            }
        }else {
            res.status(400).json({ status:400, message: "the receiving wallet is not correct" })
        }
       
    } catch (error) {
        res.status(400).json({status:400, message:`the transaction is not correct please check ${error}`})
    }
}

async function createOrupdateActiveBucket(user, bucket){
    try {
        PaymentStatus.destroy({
            where:{
                userId:user,
                bucketId:bucket
            }
        })
        const verifyActive = await ActiveBucket.findOne({
            where:{
                userId:user,
                bucketId:bucket
            }
        });
        if(verifyActive === null){
            ActiveBucket.create({
                userId:user,
                bucketId:bucket,
                state:true,
                dateInit:new Date(),
                dateEnd:new Date()
            })
        }else if(verifyActive.state === false){
            verifyActive.update({
                state:true
            })
        } 
        
    } catch (error) {
        console.error(error)
    }
}

async function PaymentState(user, bucket){
    try {
        const verifyStatus = await PaymentStatus.findOne({
            where:{
                userId:user,
                bucketId:bucket
            }
        });
        if(verifyStatus === null){
            let statusCreated = await PaymentStatus.create({
                userId:user,
                bucketId:bucket,
                status:1,               
            })
            return statusCreated.status;
        }else{
           let statusUpdated = await verifyStatus.update({
                status: verifyStatus.status + 1
            });
            return statusUpdated.status;
        }         
    } catch (error) {
        console.error(error)
    }
}
