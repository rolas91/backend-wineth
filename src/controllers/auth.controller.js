const Users = require('../models/Users');
const ActiveBuckets = require('../models/ActiveBuckets');
const {createAccessToken, createRefreshToken} = require('../services/jwt');
exports.signUp = async(req, res) => {
    try {
        const {wallet, sponsorId} = req.body; 

        const validateSponsor = await Users.findOne({
            where:{id:sponsorId}           
        });

        if(!validateSponsor) return res.status(400).json({status:400, message:'sponsor not found'});

        const validaAddressExist = await Users.findOne({
            where:{addressWallet:wallet},
            include:ActiveBuckets
        });         
        if(!validaAddressExist){
            const user = await Users.create({
                addressWallet:wallet,
                sponsorId:sponsorId
            });
            res.status(200).json({
                status:200,
                accessToken:createAccessToken(user),
                isActiveBucket:false,
                message:'register success :)'
            });
        }else{
            res.status(200).json({status:400,message:'user already exists :( '});
        }                
    } catch (error) {
        res.status(200).json({status:400,message:`bad request :( ${error}`});
    }    
}

exports.signIn = async(req, res) =>{
    try {
        const {wallet} = req.body;        
        const user = await Users.findOne({where:{addressWallet:wallet}});
        const lastBucket = await ActiveBuckets.findAll({
            where:{userId:user.id}, 
            order: [ [ 'id', 'DESC' ]]
        }); 
        if(!user) return res.status(400).json({status:400, message:'wallet is wrong'})       
        res.status(200).json({
            status:200,            
            accessToken:createAccessToken(user),
            isActiveBucket:(lastBucket.length != 0 && lastBucket.state > 0) ? lastBucket.state : false,
            message:'user is authenticated'            
            // refreshToken:createRefreshToken(user)
        })
        
    } catch (error) {
        res.status(400).json({status:400, message:error})
    }
}

exports.signAnyUser = async(req, res) =>{
    try {
        const {id} = req.body;        
        const user = await Users.findOne({
            where:{
                id:id
            }
        });       
        if(!user) return res.status(400).json({status:400, message:'user is wrong'})       
        res.status(200).json({
            status:200,                       
            message:'user is authenticated'            
            // refreshToken:createRefreshToken(user)
        })
        
    } catch (error) {
        console.error(error)
        res.status(400).json({status:400, message:error})
    }
}