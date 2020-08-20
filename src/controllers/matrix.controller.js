const Matrix = require('../models/Matrix');
const User = require('../models/Users');
const Bucket = require('../models/Buckets');
const ActiveBuckets = require('../models/ActiveBuckets');
const PaymentStatus = require('../models/PaymentStatus');
const cofig = require('../config/config');
exports.RegisterUserRed = async(req, res) => {  
   try {
        const userId = req.userid; 

        const validaUserRed = await Matrix.findAll({where:{
            userId:userId
        }});        
        
        if(validaUserRed.length > 0) return res.status(400).json({status:400, message:'user is already registered to the network'})
             
        const userPromise =  User.findAll({
            where:{
                id:userId
            }
        });        
        
        const redPromise =  Matrix.findAll({limit:1, order:[['id','DESC']]});
        
        const [user, red] = await Promise.all([userPromise, redPromise]);            
        
        const sponsorPromise =  User.findAll({
            where:{
                id:user[0].sponsorId
            }
        });

        const [sponsor] = await Promise.all([sponsorPromise]);
               

        const orderMatrix = red[0].orderMatrix + 1;
        const sponsorId = sponsor[0].id; 

        const spillOverPromise = Matrix.findAll({
            where:{
                userId:sponsorId
            }
        });
        const [spillOverData] = await Promise.all([spillOverPromise]);
        const spillOver = spillOverData[0].orderMatrix;
        

        //EJECUTAMOS FUNCIÓN PARA DAR POSICIÓN EN LA RED

        let respuesta = await derrameBinaria(spillOver, sponsorId);        
        
        //GENERAR LA POSICIÓN CORRESPONDIENTE

        let posicionLetra;

        if (respuesta.posicionLetra == "" || respuesta.posicionLetra == "B"){
            posicionLetra = "A";
        }

        if (respuesta.posicionLetra == "A"){				
            posicionLetra = "B";
        }
                
        const RegisterUserRed = await Matrix.create({
            userId:userId,
            orderMatrix:orderMatrix,
            spillOver:respuesta.spillOver,
            positionMatrix: posicionLetra,
            sponsor:sponsorId,
            createdAt: Date.now(),
            updatedAt:Date.now()
        });                   

        res.status(200).json({status:200,message:'register success :) '});
   } catch (error) {
        console.error(error)
        res.status(400).json({status:400,message:'Bad Request :( '});
   }
       
}
exports.getSponsorForPay = async(req, res) => {
    const userId = req.userid;  
    const {bucket} = req.params;
    const AscendingLine = await getAscendingLine(userId, bucket);
    res.status(200).json({
        AscendingLine
    })
    
}
exports.getTreeMatrix = async(req, res) => {
    const {userid} = req.params;    
    try {                
        const validateuserMatrix = await Matrix.findAll({
            where:{userId:userid}
        })       
        if(validateuserMatrix.length==0) {            
            res.status(400).json({status:400, message:'no data tree'});
        }else if(validateuserMatrix.length>0){                        
            const treeView = await createTreeData(userid);
            res.status(200).json(treeView);
        }
        
    } catch (error) {
        console.error(error)
    }
}

async function createTreeData(userid){
    let level1 = []
    let level2 = []
    let level3 = [];

    let getOrderMatixSponsor =  await Matrix.findOne({
        where:{userid},
        include:User
    });          
   
    for(let i=0; i < 1; i++){        
        let response = await Matrix.findAll({
            where:{spillOver:getOrderMatixSponsor.orderMatrix},
            include:[
                {model: User, include:ActiveBuckets}
            ]
        })       
        
        for(let a=0; a<response.length; a++){                       
            level1.push({
                sponsors:{
                    id:getOrderMatixSponsor.user.id,
                    wallet:getOrderMatixSponsor.user.addressWallet,
                    referers:{
                        referer:{
                            id:response[a].user.id,
                            wallet:response[a].user.addressWallet,
                            positionMatrix:response[a].positionMatrix, 
                            // buckets:bucketlevel1                           
                        }
                    }
                }
            })
        }        
        for(let j=0; j<response.length; j++){
            let response2 = await Matrix.findAll({
                where:{spillOver:response[j].orderMatrix},
                include:[
                    {model: User, include:ActiveBuckets}
                ]
            })                                      
                                    
            for(let s=0; s<response2.length; s++){                                                                           
                level2.push({
                    sponsors:{
                        id:response[j].user.id,
                        wallet:response[j].user.addressWallet,
                        referers:{
                            referer:{
                                id:response2[s].user.id,
                                wallet:response2[s].user.addressWallet,
                                positionMatrix:response2[s].positionMatrix,                                                                 
                            }
                        }
                    }
                })
            }
            
            for(let y=0; y<response2.length; y++){
                let response3 = await Matrix.findAll({
                    where:{spillOver:response2[y].orderMatrix},
                    include:[
                        { model: User, include:ActiveBuckets}
                    ]
                })                 
                for(let r=0; r<response3.length; r++){
                    level3.push({
                        sponsors:{
                            id:response2[y].user.id,
                            wallet:response2[y].user.addressWallet,
                            referers:{
                                referer:{
                                    id:response3[r].user.id,
                                    wallet:response3[r].user.addressWallet,
                                    positionMatrix:response3[r].positionMatrix
                                }
                            }
                        }
                    }) 
                }
                       
           }
        }
    }    
    
   
    
    return  {
        treeView:{    
            level1,
            level2,
            level3                   
        }
    }
}

async function derrameBinaria(spillOverMatrix, patrocinadorRed){

    const lineaDescendientePromise =  Matrix.findAll({
        where:{spillOver:spillOverMatrix}
    });
    const lineaDescendiente = await Promise.all([lineaDescendientePromise]);

            
    //CUANDO NO HAY LÍNEA DESCENDIENTE

   

    if(lineaDescendiente[0].length === 0){

        let datos = {
            posicionLetra:"",
            spillOver: spillOverMatrix
        }        
       	return datos	
    }

    //CUANDO SOLO HAY UNA LÍNEA DESCENDIENTE
  
    else if(lineaDescendiente[0].length === 1){
        let datos = {
            posicionLetra:"A",
            spillOver: spillOverMatrix
        }        
       	return datos	
    }else{

        //CUANDO EL DERRAME VIENE DIRECTAMENTE DE LA EMPRESA        

        if(patrocinadorRed === cofig.config.masterCode){	

            let datos = await derrameBinaria(spillOverMatrix + 1, patrocinadorRed);            

            return datos;

        }else{          
            
            let datos = await derrameBinariaPatrocinador(lineaDescendiente[0][1].orderMatrix);
            
            return datos;

        }

    }

}
//DERRAME BINARIA PATROCINADOR
async function derrameBinariaPatrocinador(spillOverMatrix){
   
    const lineaDescendientePromise =  Matrix.findAll({
        where:{spillOver:spillOverMatrix}
    });
    const lineaDescendiente = await Promise.all([lineaDescendientePromise]);

    //CUANDO NO HAY LÍNEA DESCENDIENTE

    if(lineaDescendiente[0].length === 0){

        let datos = {
            posicionLetra:"",
            spillOver: spillOverMatrix
        }
       	return datos	
    }

    //CUANDO SOLO HAY UNA LÍNEA DESCENDIENTE

    else if(lineaDescendiente[0].length === 1){
        let datos = {
            posicionLetra:"A",
            spillOver: spillOverMatrix
        }
       	return datos	
     
    }else{

        let datos = derrameBinariaPatrocinador(spillOverMatrix + 1);

        return datos;
        
    }

}
//Obtengo linea Ascendiente de pago
async function getAscendingLine(userid, bucketid){ 
    let statusLevel1, statusLevel2, statusLevel3 = '';  
    const resultMatrix = await Matrix.findAll({
        where:{
            userId:userid
        },        
        include:{
            model:User
        }
    });
    

    if(resultMatrix[0] === undefined ){       
        return {
            code:404,
            message:'User not found'
            
        }
    }    
  

    let nivel1 = await validateLevels1(resultMatrix[0], bucketid);    
    let nivel2 = await validateLevels2(resultMatrix[0], bucketid);
    let nivel3 = await validateLevels3(resultMatrix[0], bucketid);

    const bucket = await Bucket.findAll({where:{id:bucketid}});

    const paymentStatus = await PaymentStatus.findOne({
        where:{
            userId:userid,
            bucketId:bucketid
        }
    });

    if(paymentStatus !== null){
        if(paymentStatus.status === 1){
            statusLevel1 = 'processed';
            statusLevel2 = 'pending'
            statusLevel3 = 'pending'
        }else if(paymentStatus.status === 2){
            statusLevel1 = 'processed';
            statusLevel2 = 'processed'
            statusLevel3 = 'pending'
        }else if(paymentStatus.status === 3){
            statusLevel1 = 'processed';
            statusLevel2 = 'processed'
            statusLevel3 = 'processed'
        }
    }else{
        statusLevel1 = 'pending';
        statusLevel2 = 'pending'
        statusLevel3 = 'pending'
    }

    
    let amountLevel1AndLevel2 = (bucket[0].price * 5) / 100;
    let amountLevel3 = (bucket[0].price * 90) / 100;
    
    
    const levels = {
        nivel1:{            
            'user':nivel1[0].userId,
            'address':nivel1[0].user.addressWallet,
            'amount':parseFloat(amountLevel1AndLevel2.toFixed(3)),
            'status':statusLevel1,
            'wei': Math.round(amountLevel1AndLevel2/0.000000000000000001)
            
        },
        nivel2:{           
            'user':nivel2[0].userId,
            'address':nivel2[0].user.addressWallet,
            'amount':parseFloat(amountLevel1AndLevel2.toFixed(3)),
            'status':statusLevel2,
            'wei': Math.round(amountLevel1AndLevel2/0.000000000000000001)
        }, 
        nivel3:{            
            'user':nivel3[0].userId,
            'address':nivel3[0].user.addressWallet,
            'amount':parseFloat(amountLevel3.toFixed(3)),
            'status':statusLevel3,
            'wei': Math.round(parseFloat(amountLevel3.toFixed(3)) /0.000000000000000001)
        }
    }
    return levels;
}
async function validateLevels1(data, bucketid){ 
    try {        
        let spillOver = data.spillOver;          
        let linea1 = await Matrix.findAll({
            where:{
                userId:spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        }) 

        let linea2 = await Matrix.findAll({
            where:{
                userId:linea1[0].spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })  
        let linea3 = await Matrix.findAll({
            where:{
                userId:linea2[0].spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })       
        if(linea1[0] !== undefined && linea1[0].user.activebuckets[0] !== undefined && linea1[0].user.activebuckets[0].bucketId == bucketid && linea1[0].user.activebuckets[0].state == true){                               
            return linea1
        }else if(linea2[0] !== undefined && linea2[0].user.activebuckets[0] !== undefined && linea2[0].user.activebuckets[0].bucketId == bucketid && linea2[0].user.activebuckets[0].state == true){                                                   
            return linea2
        }else if(linea3[0] !== undefined && linea3[0].user.activebuckets[0] !== undefined && linea3[0].user.activebuckets[0].bucketId == bucketid && linea3[0].user.activebuckets[0].state == true){
            return linea3
        }else{                   
            return await Matrix.findAll({
                    where:{
                            userId:1
                    },
                    include:{
                            model:User
                    }
                }) 
            }                       
    } catch (error) {
        console.error(error)        
    }
}
async function validateLevels2(data, bucketid){ 
    try {        
        let spillOver = data.spillOver;        
        let linea1 = await Matrix.findAll({
            where:{
                userId:spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })              
        linea2 = await Matrix.findAll({
            where:{
                userId:linea1[0].spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })
        let linea3 = await Matrix.findAll({
            where:{
                userId:linea2[0].spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })       
        if(linea2[0] !== undefined && linea2[0].user.activebuckets[0] !== undefined && linea2[0].user.activebuckets[0].bucketId == bucketid && linea2[0].user.activebuckets[0].state == true){                               
           return linea2
        }else if(linea3[0] !== undefined && linea3[0].user.activebuckets[0] !== undefined && linea3[0].user.activebuckets[0].bucketId == bucketid && linea3[0].user.activebuckets[0].state == true){ 
            return linea3
        }else{
            return await Matrix.findAll({
                where:{
                    userId:1
                },
                include:{
                    model:User
                }
            }) 
        }                                 
    } catch (error) {
        console.error(error)        
    }
}
async function validateLevels3(data, bucketid){ 
    try {        
        let spillOver = data.spillOver;              

        let linea1 = await Matrix.findAll({
            where:{
                userId:spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })      
        
        linea2 = await Matrix.findAll({
            where:{
                userId:linea1[0].spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        })  

        let linea3 = await Matrix.findAll({
            where:{
                userId:linea2[0].spillOver
            },
            include:[
                {
                    model:User , include:ActiveBuckets       
                }
            ]
        }) 

        if(linea3[0] !== undefined && linea3[0].user.activebuckets[0] !== undefined && linea3[0].user.activebuckets[0].bucketId == bucketid && linea3[0].user.activebuckets[0].state == true){                               
           return linea3
        }else{             
            return await Matrix.findAll({
                    where:{
                        userId:1
                    },
                    include:{
                        model:User
                    }
                }) 
            }                                 
    } catch (error) {
        console.error(error)        
    }
}