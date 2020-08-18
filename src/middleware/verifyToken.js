const jwt = require('jsonwebtoken');

exports.TokenValidation = (req, res, next) => {
    try {        
        let token = req.header('auth-token');                        
        if(!token) return res.status(400).json('Access denied');
        const payload = jwt.verify(token.replace(/['"]+/g, ''), process.env.TOKEN_SECRET || 'gR7cH95vfj8JLe4c186Ghs48hheb3902nh5DsAr0l4s');      
        req.userid = payload.id;                        
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json('Session expired');        
    }
}