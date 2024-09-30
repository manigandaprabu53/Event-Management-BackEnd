import mongoose from "./index.js";
import generateUUID from "../Utils/helper.js";
import validator from '../Utils/validator.js'

const schema = mongoose.Schema;

const userSchema = new schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        email:{
            type: String,
            required: [true, "Email is required"],
            validate: {
                validator: validator.validateEmail,
                message: props=>`${props.value} is not avalid email`
            }
        },
        password:{
            type: String,
            required: [true, "Password is required"],
            validate: {
                validator: validator.validatePassword,
                message: props=>`${props.value} doesn't meet requirement`
            }
        },
        role: {
            type: String,
            enum: {
                values: ["admin", "user", "organizer"],
                message: `{VALUE} not supported`
            },
            default: "user"
        },
        organizerRequestStatus:{
            type: String,
            enum: ['pending', 'approved', 'rejected', 'none'],
            default: 'none',
        },
        token: {
            type: String,
            default: undefined
        },
        tokenExpiry: {
            type: Date,
            default: undefined
        }
    },
    {
        collection: 'users',
        versionKey: false
    }
)

export default mongoose.model('users', userSchema)