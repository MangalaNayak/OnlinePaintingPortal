const { User } = require('../models/user/index');
const _ = require('lodash');


module.exports = (function () {
    return {
        //Register
        register: async (req, res) =>{
            let body = await _.pick(req.body, ['email', 'username', 'contactNumber', 'password', 'confirm']);
            
            let user = await User.findOne({ email: body.email })
            if (user) { res.status(400).send({ "message": "User with that emailid already exists" }) }
            try {
                let user = await new User(body);
                let token = await user.generateAuthToken()
                user.token = token
                res.status(200).send(user);
            }
            catch (error) {
                res.status(400).send(error);
            }
        },
        //Login
        login: async (req, res) => {
            let body = await _.pick(req.body, ['email', 'password']);
            let user = await User.findByCredentials(body.email, body.password)
            let token = await user.generateAuthToken();
            user.token = token;
            user.save();
            res.send(user);
        },
        //Logout
        logout: async (req, res) => {
            let token = await req.header('Authorization');
            if (!token) {res.status(401).send()};
            let user = await User.findOneAndUpdate({ token }, { $set: { token: "" } })
            if (!user)
                res.status(404).send("No such user exists.");
            else res.send({ "message": "Logged out" })
        }
    }
}());
