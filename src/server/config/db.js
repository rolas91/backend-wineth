const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB_NAME || process.env.DB_NAME_DEV, process.env.DB_USER || process.env.DB_USER_DEV, process.env.DB_PASS || process.env.DB_PASS_DEV, {
  host: process.env.DB_HOST ||process.env.DB_HOST_DEV,
  dialect:  'mysql',
  port:process.env.DB_PORT,  
  define:{
    timestamps:false
  },
  pool:{
      max:5,
      min:0,
      acquire:30000,
      idle:10000
  }
});
module.exports = db;