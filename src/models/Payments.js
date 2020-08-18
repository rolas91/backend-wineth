const Sequelize = require('sequelize');
const db = require('../server/config/db');

const Payment = db.define('payment',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId: Sequelize.INTEGER,
    sender:Sequelize.INTEGER,
    amount:Sequelize.DECIMAL(10,2),
    bucketId:Sequelize.INTEGER,
    date:Sequelize.DATEONLY
},{
    timestamps:false
});

module.exports = Payment;