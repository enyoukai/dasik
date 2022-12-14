require('dotenv').config();

const admin = require('firebase-admin');
const User = require('../models/users');

async function adminAuthenticate(req, res, next) {
    const user = await User.findOne({_id: req.headers.uid});

    if (user === null) return res.sendStatus(404);
    
    if (!user.isAdmin)
    {
        return res.status(401).send('Unauthorized Header. Access Denied');
    }
    next();
 
//end function 
}

module.exports = adminAuthenticate