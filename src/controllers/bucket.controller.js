const Bucket = require('../models/Buckets');
const ActiveBuckets = require('../models/ActiveBuckets');
exports.getAllBucket = async(req, res) => {
    try {       
        let isEnabledBucke1,isEnabledBucke2,isEnabledBucke3,isEnabledBucke4,isEnabledBucke5 = Boolean                   
        const {userId} = req.params;        
        const bucket = await Bucket.findAll();          
        let aBucket1 = await getActiveBucketByUser(userId, bucket[0].id);     
        let aBucket2 = await getActiveBucketByUser(userId, bucket[1].id);       
        let aBucket3 = await getActiveBucketByUser(userId, bucket[2].id);
        let aBucket4 = await getActiveBucketByUser(userId, bucket[3].id);
        let aBucket5 = await getActiveBucketByUser(userId, bucket[4].id);                      
       
        if(aBucket1[0] != undefined){        
            if(aBucket1[0] != undefined && aBucket1[0].state === true){
                isEnabledBucke1 = true;
                isEnabledBucke2 = true;
                isEnabledBucke3 = false;
                isEnabledBucke4 = false;
                isEnabledBucke5 = false;
            }if(aBucket2[0] != undefined && aBucket1[0].state === true ){
                isEnabledBucke1 = true;
                isEnabledBucke2 = true;
                isEnabledBucke3 = true;
                isEnabledBucke4 = false;
                isEnabledBucke5 = false;
            }if(aBucket3[0] != undefined && aBucket3[0].state === true){
                isEnabledBucke1 = true;
                isEnabledBucke2 = true;
                isEnabledBucke3 = true;
                isEnabledBucke4 = true;
                isEnabledBucke5 = false;
            }if(aBucket4[0] != undefined && aBucket4[0].state === true){
                isEnabledBucke1 = true;
                isEnabledBucke2 = true;
                isEnabledBucke3 = true;
                isEnabledBucke4 = true;
                isEnabledBucke5 = true;
            }  
        }else{
            isEnabledBucke1 = true;
            isEnabledBucke2 = false;
            isEnabledBucke3 = false;
            isEnabledBucke4 = false;
            isEnabledBucke5 = false;
        }     
              
        let buckets = [
            {
                id:bucket[0].id,
                name:bucket[0].name,
                price:bucket[0].price,
                status: (aBucket1[0] != undefined) ? aBucket1[0].state : false,
                expire:getDynamicDates(new Date((aBucket1[0] != undefined) ? new Date(aBucket1[0].dateEnd) : 0)),
                isEnabled:isEnabledBucke1
            },
            {
                id:bucket[1].id,
                name:bucket[1].name,
                price:bucket[1].price,
                status: (aBucket2[0] != undefined) ? aBucket2[0].state : false,
                expire:getDynamicDates((aBucket2[0] != undefined) ? new Date(aBucket2[0].dateEnd) : 0),
                isEnabled:isEnabledBucke2
            },
            {
                id:bucket[2].id,
                name:bucket[2].name,
                price:bucket[2].price,
                status: (aBucket3[0] != undefined) ? aBucket3[0].state : false,
                expire:getDynamicDates((aBucket3[0] != undefined) ? new Date(aBucket3[0].dateEnd) : 0),
                isEnabled:isEnabledBucke3
            },
            {
                id:bucket[3].id,
                name:bucket[3].name,
                price:bucket[3].price,
                status: (aBucket4[0] != undefined) ? aBucket4[0].state : false,
                expire:getDynamicDates((aBucket4[0] != undefined) ? new Date(aBucket4[0].dateEnd) : 0),
                isEnabled:isEnabledBucke4              
            },
            {
                id:bucket[4].id,
                name:bucket[4].name,
                price:bucket[4].price,
                status: (aBucket5[0] != undefined) ? aBucket5[0].state : false,
                expire:getDynamicDates((aBucket5[0] != undefined) ? new Date(aBucket5[0].dateEnd) : 0),
                isEnabled:isEnabledBucke5
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

async function getActiveBucketByUser(user, bucket){
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