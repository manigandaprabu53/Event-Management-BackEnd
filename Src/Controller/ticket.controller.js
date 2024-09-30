import ticketModel from '../Model/ticket.model.js';
import eventModel from '../Model/event.model.js'
import Stripe from 'stripe';
import config from '../Utils/config.js';

const stripe = new Stripe(config.SEC_KEY)

const purchaseTicket = async (req, res)=>{
    try {
        const {userID, eventID, ticketType, ticketPrice} = req.body;
        console.log(eventID)
        const event = await eventModel.findById(eventID)
        console.log(event);
        
        
        if(!event){
            res.status(404).send({message: "Event Not Found"});
        }
        else{
            let reg = await ticketModel.findOne({user: userID, event: eventID})
            if(!reg){
                const event = await ticketModel.create({user: userID, event: eventID, ticketType: ticketType, ticketPrice: ticketPrice})
                // const tickets = await eventModel.findOne({_id: eventID});
                res.status(201).send({message: "Ticket Booked", data: event});
            }else{
                res.status(400).send({message: "Already Registered"})
            }
            
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`)
        res.status(500).status({message: error.message || 'Internal Server Error'})
    }
}

const payment = async (req, res)=>{
    try {
        const {token, eventID, userID} = req.body;
        console.log(eventID)
        const reg = await ticketModel.findOne({user: userID, event: eventID});
        console.log(reg)
        if(reg){
            console.log("Ticket details found")
            let amount = reg.ticketPrice;
            console.log(amount)
            const charge = await stripe.charges.create({
                amount: amount*100,
                currency: 'usd',
                source: token.id
            })
            res.status(200).send({message: "Payment Successfull", data: reg})
        }
        

    } catch (error) {
        console.log(`Error at ${req.originalUrl}`)
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const findEmail = async(req, res)=>{
    try {
        let {eventID} = req.params;
        const userEmails = await ticketModel.find({event: eventID}).populate({
            path: 'user',
            select: 'email'
        }).select('user').exec();
        
        const emails = userEmails.map(ticket => ticket.user.email);
        res.status(201).send({message: "Email ID's Found", Emails: emails})
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`)
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

export default {
    purchaseTicket,
    payment,
    findEmail
}




