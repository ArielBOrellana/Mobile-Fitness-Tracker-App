import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Method to sign up and create new user with hashed password
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10); //Hashing password
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
};

//Method to check user credentials and creating secret key
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //Creating a hashed token using JWT
        const { password: pass, ...rest } = validUser._doc; //Making sure not to send the password back to the user, danger for leaks
        
        res 
            .status(200)
            .json({
                ...rest,
                token: token,
            });
    } catch (error) {
        next(error);
    }
}

{/* Method for signing out the user */}
export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token'); //Clearing cookie/access_token
        res.status(200).json('User has been signed out');
    } catch (error) {
        next(error)
    }
}