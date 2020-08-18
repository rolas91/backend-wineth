const Sequelize = require('sequelize');
const db = require('../server/config/db');

const PaymentStatus = db.define('paymentstatus',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId:Sequelize.INTEGER,
    bucketId:Sequelize.INTEGER,
    status:Sequelize.INTEGER
},{
    timestamps:false
});
module.exports = PaymentStatus;