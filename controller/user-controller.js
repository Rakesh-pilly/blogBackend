import userModel from "../model/user-model";
import bcrypt from "bcryptjs"
export const getAllUser = async(req,res,next)=> {

    let users;

    try {
        users = await userModel.find();
    } catch (error) {
        console.log(error);
    }

    if(!users){
        res.status(404).json({message: "No users Found"});
    }

    return res.status(200).json({users})
}


export const singup = async(req,res,next)=> {

    const {name, email,password} = req.body;

    let existingUser;

    try {
        existingUser = await userModel.findOne({email});


    } catch (error) {
        
    }

    if(existingUser){
        res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = bcrypt.hashSync(password)

    const user = new userModel({
        name,email,password : hashedPassword,
        blogs: [],
    })



    try {
       await user.save();
    } catch (error) {
        console.log(error);
    }

    return res.status(201).json({user})

}

export const login = async(req,res,next)=> {

    let {email, password} = req.body;

    let existingUser ;

    try {
        existingUser = await userModel.findOne({email})
    } catch (error) {
        console.log(error)
    }

    if(!existingUser){
        res.status(400).json({message: "user not found singup"})
    }

   let passwrodCoreet =  bcrypt.compareSync(password,existingUser.password)

    if(passwrodCoreet){
        res.status(200).json({ message: "login Successfull", existingUser})
    }else{
        res.status(400).json({message: "check email and password"})
    }







}