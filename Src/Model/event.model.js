import mongoose from "./index.js";

const schema = mongoose.Schema;


const eventSchema = new schema({
    title:{
        type: String,
        required: [true, "Title is required"]
    },
    description:{
        type: String,
        required: [true, "Description is required"]
    },
    date:{
        type: Date,
        required: [true, "Date is required"]
    },
    time:{
        type: String,
        required: [true, "Time is required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    // speakers:{
    //     type: String
    // },
    ticketPricing:[
        {
            type: {type: String, required: true},
            price: {type: Number, required: true},
            availableTickets: {type: Number, required: true}
        }
    ],
    category:{
        type: String, 
        required: true
    },
    image: {type: String, required: true},
    // videos: [{type: String, required: true}],
    // schedule:[
    //     {
    //         time: {type: String, required: true},
    //         sessionTitle: {type: String, required: true},
    //         speaker: {type: String, required: true}
    //     }
    // ],
    organizer: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: [true, "Organizer is required"]
    },
    status: {
        type: String,
        enum: {
            values: ["approved", "rejected", "canceled", "none"],
            message: `{VALUE} not supported`
        },
        default: "none"
    },

},
{
    collection: 'event',
    versionKey: false
}
)

export default mongoose.model('event', eventSchema);