require('./config/config');
const express = require('express');
require('dotenv').config();
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('../routes/index');
// Conection db
const db = require('./config/db');
//models
require('../models/Users');
require('../models/Matrix');
require('../models/ActiveBuckets');
require('../models/Buckets');
require('../models/Payments');
require('../models/PaymentStatus');
db.sync()
    .then(() => console.log('conected success!'))
    .catch(error => console.log(error));

const app = express();


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());
// Enable CORS
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });



// Directorio Público
app.use(express.static(path.join(__dirname, '../../build')));

// Rutas 
app.use('/api', routes)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../../build','index.html'));
})

app.listen(process.env.PORT || 5000, (err) => {

    if (err) throw new Error(err);

    console.log(`Server runner in port ${ process.env.PORT }`);

});