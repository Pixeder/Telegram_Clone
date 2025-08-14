import { Schema , model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = Schema({
        username: {
            required: true,
            type: String,
            unique: true,
            trim: true,
            index: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            sparse: true,
            trim: true 
        },
        avatarURL: {
            type: String,
            default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/800px-User-avatar.svg.png'
        },
        password: {
            required: true,
            type: String,
            minlength: 8,
        },
        refreshToken: {
            type: String,
            default: ''
        }
    }
    ,{timestamps: true}
)

userSchema.pre("save", async function (next){
    if(!this.ismodified("password")) return next();

    this.password = await bcrypt.hash(this.password , 10);
    next();
})

userSchema.method.ispasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.method.generateAccessToken = async function(){
    return jwt.sign(
    {
        id: this._id,
        email: this.email,
        username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
)
}

userSchema.method.generateRefreshToken = async function(){
    return jwt.sign(
    {
        id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
)
}

export const User = model("User" , userSchema)