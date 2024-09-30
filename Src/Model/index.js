import mongoose from "mongoose";
import config from '../Utils/config.js';

async function main(){
    await mongoose.connect(`${config.DB_URL}/${config.DB_NAME}`)
    console.log("MongoDB Connected")
}

main().catch((error)=>console.log("MongoDB Failed ", error))

export default mongoose