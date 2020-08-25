const Sequelize = require('sequelize');
const db = require('../server/config/db');
const Sender = require('../models/Users');
const Payment = db.define('payment',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId: Sequelize.INTEGER,
    sender:Sequelize.INTEGER,
    hash:Sequelize.STRING,
    amount:Sequelize.DECIMAL(10,4),
    bucketId:Sequelize.INTEGER,
    date:Sequelize.DATEONLY
},{
    timestamps:false
});
// Payment.belongsTo(User,{foreignKey:'userId'});
Payment.belongsTo(Sender,{foreignKey:'sender'});
module.exports = Payment;