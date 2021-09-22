const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const Question = require("./Question");


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true,"Please provide a name."]
    },
    email: {
        type: String,
        required: [true,"Please provide a email"],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user","admin"]
    },
    password: {
        type: String,
        required: [true,"Please provide a password"],
        minlength: [6,"Please provide a password with min 6 characters"],
        select: false
    },
    createdAt: {
        type: Date,
        default:  Date.now()
    },
    title: {
        type: String
    },
    about: {
        type: String
    },
    place: {
        type: String
    },
    website: {
        type: String
    },
    profil_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }
});
// UserSchema methods
UserSchema.methods.generateJwtFromUser = function() {

    const payload = {
        id: this._id,
        name: this.name
    }

const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRE
});

    return token;
}


UserSchema.methods.getResetPasswordTokenFromUser = function() {
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
}

// Pre Hooks
UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        next();
    }

    bcrypt.genSalt(10, (err,salt) => {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err,hash) => {
            if(err) next(err);
            this.password = hash;
            next();
        });
    });

});

UserSchema.post("remove",async function(){
    await Question.deleteMany({
        user: this._id
    });
});

module.exports = mongoose.model("User",UserSchema);