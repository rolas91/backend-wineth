const Bucket = require('../models/Buckets');
const ActiveBuckets = require('../models/ActiveBuckets');
exports.getAllBucket = async(req, res) => {
    try {                          
        const {userId} = req.params;        
        const bucket = await Bucket.findAll();          
        let aBucket1 = await getActiveBuckeByUser(userId, bucket[0].id)
        let aBucket2 = await getActiveBuckeByUser(userId, bucket[1].id)
        let aBucket3 = await getActiveBuckeByUser(userId, bucket[2].id)
        let aBucket4 = await getActiveBuckeByUser(userId, bucket[3].id)
        let aBucket5 = await getActiveBuckeByUser(userId, bucket[4].id)       
                
        let buckets = [
            {
                id:bucket[0].id,
                name:bucket[0].name,
                price:bucket[0].price,
                status: (aBucket1[0] != undefined) ? aBucket1[0].state : false,
                expire:getDynamicDates(new Date((aBucket1[0] != undefined) ? new Date(aBucket1[0].dateEnd) : 0))
            },
            {
                id:bucket[1].id,
                name:bucket[1].name,
                price:bucket[1].price,
                status: (aBucket2[1] != undefined) ? aBucket1[1].state : false,
                expire:getDynamicDates((aBucket1[1] != undefined) ? new Date(aBucket1[1].dateEnd) : 0)
            },
            {
                id:bucket[2].id,
                name:bucket[2].name,
                price:bucket[2].price,
                status: (aBucket3[2] != undefined) ? aBucket1[2].state : false,
                expire:getDynamicDates((aBucket1[2] != undefined) ? new Date(aBucket1[2].dateEnd) : 0)
            },
            {
                id:bucket[3].id,
                name:bucket[3].name,
                price:bucket[3].price,
                status: (aBucket4[3] != undefined) ? aBucket4[3].state : false,
                expire:getDynamicDates((aBucket1[3] != undefined) ? new Date(aBucket1[3].dateEnd) : 0)                
            },
            {
                id:bucket[4].id,
                name:bucket[4].name,
                price:bucket[4].price,
                status: (aBucket5[4] != undefined) ? aBucket5[4].state : false,
                expire:getDynamicDates((aBucket1[4] != undefined) ? new Date(aBucket1[4].dateEnd) : 0)
            }
        ]     
        
        res.status(200).json(buckets);
        
    } catch (error) {
        res.status(400).json({status:400, message:error});
    }
}

exports.createBucket = async(req, res) => {
    try {
        const {name, price} = req.body;        
        await Bucket.create({
            name: name,
            price: price
        });
        res.status(200).json({success:'register success'});        
    } catch (error) {
        res.status(400).json({error:'bad request server'});
    }
}

async function getActiveBuckeByUser(user, bucket){
    try {
        return await ActiveBuckets.findAll({
            where:{
                userId:user,
                bucketId:bucket
            }
        });        
    } catch (error) {
        console.error(error);
    }
}

function getDynamicDates(date){    
    if(date !=0){
        let Now = new Date();
        let miliSegundosDias = 24 * 60 * 60 * 1000;   
        let miliSegundosTranscurridos = Math.abs(Now.getTime() - date.getTime());
        return Math.round(miliSegundosTranscurridos/miliSegundosDias);
    }else{
        return 0
    }
}