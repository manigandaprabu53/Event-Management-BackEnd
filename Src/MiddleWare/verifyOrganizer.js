import auth from '../Utils/auth.js';
import userModel from '../Model/users.model.js';

const verifyOrganizer = async (req, res, next)=>{
    let token = req.headers?.authorization?.split(" ")[1];
    console.log(token);
    if(token){
        console.log("Backend Token")
        let payload = auth.decodeToken(token);
        let user = await userModel.findOne({_id: payload.id, email: payload.email, role: payload.role});
        if(user && user.role === 'organizer'){
            next()
        }
        else{
            res.status(401).send({message: "Access Denied Contact Admin"});
        }
    }else{
        res.status(401).send({message: "Token Not Found"});
    }
}

export default verifyOrganizer;