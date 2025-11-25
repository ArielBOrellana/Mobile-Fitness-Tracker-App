import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json ({
        message: 'API route is working!',
    });
};

{/* Deletes user in database */}
export const deleteUser = async (req, res, next) => {
    if(req.user.id != req.params.id) return next(errorHandler(401, 'Can not delete this account'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error)
    }
}

{/* Function to get the user */}
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return next(errorHandler(404, 'User not found!'));

        const { password: pass, ...rest } = user._doc; //Separating the password from the rest

        res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}

// Update user data (e.g., monthlyGoal). Requires the requester to be the user.
export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'));
    try {
        // Only update allowed fields to avoid privilege escalation
        const allowed = {};
        if (req.body.monthlyGoal !== undefined) allowed.monthlyGoal = req.body.monthlyGoal;
        if (req.body.username !== undefined) allowed.username = req.body.username;
        if (req.body.avatar !== undefined) allowed.avatar = req.body.avatar;

        const updated = await User.findByIdAndUpdate(req.params.id, { $set: allowed }, { new: true });
        if (!updated) return next(errorHandler(404, 'User not found'));

        const { password: pass, ...rest } = updated._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}