const Sequelize = require('sequelize');
const db = require('../server/config/db');

const Bucket = db.define('bucket',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:Sequelize.STRING,
    price:Sequelize.DECIMAL(10,2)    
},{
    timestamps:false
});
module.exports = Bucket;