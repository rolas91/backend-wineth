const Bucket = require('../models/Buckets');

exports.getAllBucket = async(req, res) => {
    try {
        const result = await Bucket.findAll();
        res.status(200).json({buckets:result});
        
    } catch (error) {
        res.status(200).json({error:'bad request'});
    }
}

exports.createBucket = async(req, res) => {
    try {
        const {name, price} = req.body;
        const result = await Bucket.create({
            name: name,
            price: price
        });
        if(result){
            res.status(200).json({success:'register success'});
        } else{
            res.status(200).json({error:'please send name bucket and price'});
        }
        
    } catch (error) {
        res.status(400).json({error:'bad request server'});
    }
}