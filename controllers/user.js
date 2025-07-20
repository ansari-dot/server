import User from '../model/User.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import sendOTP from '../utils/sendOTP.js';

import { setOTP, verifyOTP, removeOTP } from '../utils/otpStore.js';

class userController {
    // Step 1: Send OTP
    async requestOTP(req, res) {
            const { email } = req.body;
            if (!email) return res.status(400).json({ message: "Email is required" });

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already registered" });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await sendOTP(email, otp);
            setOTP(email, otp);

            res.json({ message: "OTP sent to your email" });
        }
        // Step 2: Verify OTP and Register
    async register(req, res) {
            const { fullname, email, birthDate, gender, shehrityId, password, role, otp } = req.body;

            if (!fullname || !email || !birthDate || !gender || !shehrityId || !password || !role || !otp) {
                return res.status(400).json({ message: "All fields including OTP are required" });
            }

            if (!verifyOTP(email, otp)) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            try {
                const saltRounds = parseInt(process.env.SALT) || 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                const newUser = new User({
                    fullname,
                    email,
                    birthDate,
                    gender,
                    shehrityId,
                    password: hashedPassword,
                    role
                });

                await newUser.save();
                removeOTP(email); // Clear OTP after registration

                res.status(201).json({ message: "User successfully registered" });
            } catch (err) {
                console.error("Registration error:", err);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
        // Step 3 : Verify User:

    async login(req, res) {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({
                    message: "Please fill all the fields",
                    success: false,
                });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    message: "Invalid email or password",
                    success: false,
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password",
                    success: false,
                });
            }
            const JWT_SECRET = process.env.JWT_SECRET
            const token = jwt.sign({ id: user._id }, JWT_SECRET, {
                expiresIn: "2h",
            });

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 2 * 60 * 60 * 1000,
            });

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                success: true,
            });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({
                message: "Server error",
                success: false,
            });
        }
    }
    

    async resetPassword(req, res) {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required" });
        }
        if (!verifyOTP(email, otp)) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const saltRounds = parseInt(process.env.SALT) || 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
            await user.save();
            removeOTP(email);
            res.status(200).json({ message: "Password reset successful" });
        } catch (err) {
            console.error("Reset password error:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }
}

export default new userController();