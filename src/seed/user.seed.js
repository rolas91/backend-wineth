const User = require('../models/Users')
const Matrix = require('../models/Matrix');
const shortid = require('shortid');

let users = [
    {addressWallet:shortid.generate(), sponsorId:0},
    {addressWallet:shortid.generate(), sponsorId:1},
    {addressWallet:shortid.generate(), sponsorId:2},
    {addressWallet:shortid.generate(), sponsorId:3},
    {addressWallet:shortid.generate(), sponsorId:4},
    {addressWallet:shortid.generate(), sponsorId:5},
    {addressWallet:shortid.generate(), sponsorId:6},
    {addressWallet:shortid.generate(), sponsorId:7},
    {addressWallet:shortid.generate(), sponsorId:8},
    {addressWallet:shortid.generate(), sponsorId:9},
    {addressWallet:shortid.generate(), sponsorId:10},
    {addressWallet:shortid.generate(), sponsorId:11},
    {addressWallet:shortid.generate(), sponsorId:12},
    {addressWallet:shortid.generate(), sponsorId:13},
    {addressWallet:shortid.generate(), sponsorId:14},
    {addressWallet:shortid.generate(), sponsorId:15},
    {addressWallet:shortid.generate(), sponsorId:16},
    {addressWallet:shortid.generate(), sponsorId:17},
    {addressWallet:shortid.generate(), sponsorId:18},
    {addressWallet:shortid.generate(), sponsorId:19},
    {addressWallet:shortid.generate(), sponsorId:20},
    {addressWallet:shortid.generate(), sponsorId:21},
    {addressWallet:shortid.generate(), sponsorId:22},
    {addressWallet:shortid.generate(), sponsorId:23},
    {addressWallet:shortid.generate(), sponsorId:24},
    {addressWallet:shortid.generate(), sponsorId:25},
]

users.forEach((user, i) => User.create({    
    addressWallet:user.addressWallet,
    sponsorId:i
}));

Matrix.create({
    userId:1,
    orderMatrix:1,
    spillOver:0,
    positionMatrix:'',
    sponsor:0,
    active:true,
    bucketId:null
})