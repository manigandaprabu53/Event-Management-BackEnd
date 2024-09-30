import userModel from '../Model/users.model.js';
import auth from '../Utils/auth.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import 'dotenv/config'

const createUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        let user = await userModel.findOne({email: email})
        if(!user){
            req.body.password = await auth.hashData(password);
            let docs = await userModel.create(req.body);
            res.status(201).send({message: "User Registered Successfully"});
        }else{
            res.status(400).send({message: `User ${email} already exist`});
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`)
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const loginUser = async (req, res)=>{
    try {
        let {email, password} = req.body;
        let user = await userModel.findOne({email: email});
        if(user){
            if(await auth.compareHash(password, user.password))
            {
                console.log("Password Matched");
                let token = auth.createToken({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                })
                res.status(200).send({message: "User Login Successfull", token: token, data: user, role: user.role})
            }
            else{
                res.status(401).send({message: "Incorrect Password"});
            }
        }
        else{
            res.status(401).send({message: "Unauthorized User"})
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`)
        res.status(500).status({message: error.message || 'Internal Server Error'})
    }
}

const forgotPassword = async(req, res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email});
        if(!user){
            res.status(400).send({message: "User Not Found"})
        }else{
            user.token = crypto.randomBytes(10).toString('hex');
            user.tokenExpiry = Date.now()+600000;
            await user.save();

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: true,
                auth: {user: 'manigandaprabumani96271@gmail.com', pass: 'jkta zqzx gsyt dxzg'}
            });

            const mailOptions = {
                from: 'passwordreset@demo.com',
                to: user.email,
                subject: 'Password Reset',
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://localhost:5173/resetPassword/${user.token}\n\n  If you did not request this, please ignore this email and your password will remain unchanged.\n`
            }

            transporter.sendMail(mailOptions, (err)=>{
                if(err){
                    return res.status(500).send({message: "Error Sending Mail", err})
                }
                else{
                    res.status(200).send({message: "Password Reset Mail Sent"})
                }
            })
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
}

const resetPassword = async(req, res)=>{
    try {
        console.log("Password Reset Block")
        let token = req.params.token;
        console.log(req.params.token+"pppppppppppppppppp")
        console.log(req.body.password+"xxxxxxxxxxxxx")
        const user = await userModel.findOne({token: token, tokenExpiry: {$gt: Date.now()}})

        if (!user) return res.status(400).send({message: 'Password reset token is invalid or has expired'});
        console.log(req.body.password)
        user.password = await auth.hashData(req.body.password);
        user.token = null;
        user.tokenExpiry = null;
        user.save();

        res.status(200).send({message: "Password Has Been Reset"})
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
}

const getAllUsers = async (req, res)=>{
    try {
        let users = await userModel.find({}, {_id:1, password:0});
            if(users.length)
            {
                res.status(200).send({
                message: 'User Data Fetched successfully',
                data: users
                })
            }
            else{
                res.status(400).send({message: "No Users Found"})
            }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}

const editUserById = async (req, res)=>{
    try {
        let {id} = req.params;
        let user = await userModel.findOne({_id: id});
        if(user){
            const {name, email, role} = req.body;
            user.name = name?name : user.name;
            user.email = email?email : user.email;
            user.role = role?role : user.role;
            await user.save();
            res.status(200).send({message: 'Data Modified Successfully'})
        }
        else{
            res.status(400).send({message: 'Invalid ID'})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error)
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const deleteUserById = async (req, res)=>{
    try {
        const {id} = req.params;
        let data = await userModel.deleteOne({_id: id})
        if(data.deletedCount){
            res.status(200).send({message: 'User Deleted Successfully'})
        }
        else{
            res.status(400).send({message: 'Invalid ID'})
        }

    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const memberForm = async (req, res)=>{
    try {
        let {id, email, password} = req.body;
        let user = await userModel.findOne({_id: id, email: email});
        if(user && user.role === 'user'){
            if(await auth.compareHash(password, user.password))
            {
                user.role = 'organizer';
                user.organizerRequestStatus = 'pending';
                user.save();
                res.status(200).send({message: "Waiting For Approval"})
            }
            else{
                res.status(401).send({message: "Incorrect Password"});
            }
        }
        else{
            res.status(404).send({message: "Not Found or Already Organizer"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const pendingOrganizers = async (req, res)=>{
    try {
        let docs = await userModel.find({role: "organizer", organizerRequestStatus: 'pending'})
        if(docs){
            res.status(200).send({message: "Organizers Awaiting Approval", data: docs});
        }
        else{
            res.status(400).send({message: "No Pending Approvals"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const approveOrganizer = async (req, res)=>{
    try {
        const {id} = req.body;
        let user = await userModel.findOne({_id: id});
        if(user){
            user.organizerRequestStatus = 'approved';
            user.save();
            let docs = await userModel.find({role: "organizer", organizerRequestStatus: 'pending'});
            res.status(200).send({message: "Approved", data: docs})
        }
        else{
            res.status(401).send({message: "User Not Found"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const rejectOrganizer = async (req, res)=>{
    try {
        const {id} = req.body;
        let user = await userModel.findOne({_id: id});
        if(user){
            user.organizerRequestStatus = 'rejected';
            user.role = 'user';
            user.save();
            let docs = await userModel.find({role: "organizer", organizerRequestStatus: 'pending'});
            res.status(200).send({message: "Rejected", data: docs})
        }
        else{
            res.status(401).send({message: "User Not Found"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

export default{
    createUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    editUserById,
    deleteUserById,
    memberForm,
    pendingOrganizers,
    approveOrganizer,
    rejectOrganizer
}