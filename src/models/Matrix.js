const Sequelize = require('sequelize');
const db = require('../server/config/db');
const User = require('../models/Users');
const Bucket = require('../models/Buckets');
const Matrix = db.define('matrix',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId:Sequelize.INTEGER,
    orderMatrix:Sequelize.INTEGER,
    spillOver:Sequelize.INTEGER,
    positionMatrix:Sequelize.STRING,
    sponsor:Sequelize.STRING    
},{
    timestamps:true
});
Matrix.belongsTo(User);
Matrix.belongsTo(Bucket);
module.exports = Matrix;