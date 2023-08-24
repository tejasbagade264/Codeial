const User = require('../../../models/user');
const JWT = require('jsonwebtoken');
const passport = require('passport');


module.exports.createSession = async function (req, res) {
    try {
        let user = await User.findOne({email: req.body.email}).select('+password');

        if (!user || user.password != req.body.password) {
            return res.status(422).json({
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            message: 'Sign in successful. Here is your token. Keep it safe!',
            data: {
                token: JWT.sign(user.toJSON(), 'codeial', {expiresIn: '1000000'})            }
        });

    } catch (err) {
        console.log('******', err);
        return res.status(500).json({
            message: "Internal Server Error in JWT"
        });
    }
}
