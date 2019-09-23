const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose")
const { UserSchema } = require('./schema');

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ["email", "username", "token"]);
};

UserSchema.methods.generateAuthToken = async function () {
    try {
        let user = this;
        let token = await jwt.sign({ _id: user._id.toHexString() }, 'abc123').toString();
        user.token = token;
        user.save()
        return token;
    }
    catch (e) {
        console.log(e);
    }
};

UserSchema.statics.findByToken = async function (token) {
    let User = this;
    let decoded;

    try {
        decoded = await jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'token': token,
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // bcrypt.compare compares password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = { User }