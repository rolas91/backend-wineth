const jwt = require('jwt-simple');
const moment = require('moment');

const SECRET_KEY = "gR7cH95vfj8JLe4c186Ghs48hheb3902nh5DsAr0l4s";

exports.createAccessToken = (user) => {
    const payload = {
        id: user.id,
        wallet:user.addressWallet,        
        // exp:moment()
        //     .add(3,"hours")
        //     .unix()
    };
    return jwt.encode(payload,SECRET_KEY);
}

exports.createRefreshToken = (user) => {
    const payload = {
        id: user._id,
        // exp:moment()
        //     .add(3,"hours")
        //     .unix()
    };
    return jwt.encode(payload,SECRET_KEY);
}

