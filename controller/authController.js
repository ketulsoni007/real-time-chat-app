import userSchema from "../models/User.js";
import bcrypt from "bcryptjs";  // Import bcrypt
import jwt from "jsonwebtoken";  // Import jsonwebtoken
import 'dotenv/config';

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log('Received name, email, password: ', name, email, password);
        const existingUser = await userSchema.findOne({
            $or: [{ user_name:name }, { email }],
        });

        if (existingUser) {
            if (existingUser.user_name === name) {
                return res.status(410).send({
                    message: "Username already taken",
                });
            }

            if (existingUser.email === email) {
                return res.status(410).send({
                    message: "Email already registered",
                });
            }
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        const newUser = new userSchema({
            user_name:name,
            email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        // Remove password from response
        const responseUser = { ...newUser.toObject() };
        delete responseUser.password;

        // Generate JWT token with a 15 days expiration
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,  // Use secret from environment
            { expiresIn: '15d' }    // Token expires in 15 days
        );

        return res.status(200).send({
            message: "userSchema Registered Successfully",
            user: responseUser,
            token,  // Send the JWT token in response
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error In Register",
            error,
        });
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(410).send({
                message: "userSchema not found",
            });
        }

        // Compare the password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(410).send({
                message: "Invalid password",
            });
        }

        // Remove password from response
        const responseUser = { ...user.toObject() };
        delete responseUser.password;

        // Generate JWT token with a 15 days expiration
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,  // Use secret from environment
            { expiresIn: '15d' }    // Token expires in 15 days
        );

        return res.status(200).send({
            message: "Login successful",
            user: responseUser,
            token,  // Send the JWT token in response
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in Login",
            error,
        });
    }
};

export const getAllUserController = async (req, res) => {
    try {
        const { userId } = req;
        const { name } = req.query;
        let query = { _id: { $ne: userId } };
        if (name && name !== undefined) {
            query.user_name = { $regex: name, $options: 'i' };
        }
        const users = await userSchema.find(query).select('_id user_name email');
        return res.status(200).send(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ success: false, message: "Failed to get users" });
    }
};

export const testController = async (req, res) => {
    try {
        const { userId } = req;  // Directly access req.userId
        const user = await userSchema.findById(userId);  // Use await to get the user

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "userSchema not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "userSchema fetched successfully",
            user,  // Ensure you're sending only the necessary user data
        });
    } catch (error) {
        console.error("Error getting user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get user",
            error: error.message,
        });
    }
};