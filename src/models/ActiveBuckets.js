const Sequelize = require('sequelize');
const db = require('../server/config/db');
const User = require('../models/Users');
const ActiveBuckets = db.define('activebucket',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId:Sequelize.INTEGER,
    bucketId:Sequelize.INTEGER,
    state:Sequelize.BOOLEAN,
    dateInit:Sequelize.DATEONLY,
    dateEnd:Sequelize.DATEONLY
},{
    timestamps:false
});

// ActiveBuckets.belongsTo(User,{foreignKey:'userId'})

module.exports = ActiveBuckets;