import mongoose from "./index.js";

const schema = mongoose.Schema;

const ticketSchema = new schema(
    {
        user:{
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: [true, "user ID is required"]
        },
        event:{
            type: mongoose.Types.ObjectId,
            ref: "event",
            required: [true, "Event ID is required"]
        },
        ticketType:{
            type: String,
            required: [true, "Ticket type is required"]
        },
        ticketPrice:{
            type: Number,
            required: [true, "Ticket price is required"]
        },
        purchaseDate:{
            type: Date,
            default: Date.now()
        }
    },
    {
        collection: "ticket",
        versionKey: false
    }
)

export default mongoose.model('ticket', ticketSchema);