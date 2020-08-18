const Sequelize = require('sequelize');

const db = require('../server/config/db');
const ActiveBuckets = require('../models/ActiveBuckets');
const  Users = db.define('users',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    addressWallet:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },  
    sponsorId: Sequelize.INTEGER,
    
}, {
    timestamps:true,    
});
Users.hasMany(ActiveBuckets,{foreignKey:'userId'});
module.exports = Users;