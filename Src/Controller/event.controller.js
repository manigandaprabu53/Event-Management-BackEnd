import eventModel from '../Model/event.model.js';
import userModel from '../Model/users.model.js';


// Create Event
const createEvent = async (req, res)=>{
    try {
        let event = await eventModel.create(req.body);
        res.status(201).send({message: "Event created Successfully", data: event});
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

// Get All Events
const getAllEvents = async (req, res)=>{
    try {
        let {id} = req.params;
        let docs = await eventModel.find({status: "approved", organizer: id});
        if(docs){
            res.status(200).send({message: "Approved Events", events: docs});
        }
        else{
            res.status(400).send({message: "No Approved Events"});
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

const getEventById = async (req, res)=>{
    try {
        console.log("Entered Events")
        let {id} = req.params;
        console.log("This ID : "+id)
        let docs = await eventModel.findOne({_id: id});
        if(docs){
            res.status(200).send({message: "Event Fetched", data: docs});
        }
        else{
            res.status(400).send({message: "Events Not Found"});
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

const getApprovedEvents = async (req, res)=>{
    try {
        
        let docs = await eventModel.find({status: "approved"});
        if(docs){
            console.log("Docs Found")
            res.status(200).send({message: "Approved Events", events: docs});
        }
        else{
            res.status(400).send({message: "No Approved Events"});
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}


// const eventRegistration = async (req, res)=>{
//     try {
//         const {userID, eventID} = req.body;
//         let user = await userModel.findOne({id: userID});
//         let event = await eventModel.findOne({id: eventID});
        
//         if(!user || !event){
//             res.status(404).send({message: "User or Event not found"});
//         }
//         else
//         {
//             let docs = await eventRegistrationModel.create({user: userID, event: eventID});
//             res.status(201).send({message: "Regstered to event", data: docs});
//         }
//     } catch (error) {
//         console.log(`Error at ${req.originalUrl}`)
//         res.status(500).status({message: 'Internal Server Error' || error.message})
//     }
// }


// Search events with filters (date, location, category, price range)
const searchEvents = async (req, res)=>{
    try {
        const {date, location, title, minPrice, maxPrice} = req.query;
        let filters = {};
        
        if(date){
            filters.date = {$gte: new Date(date)}
            console.log(date)
        }
        if(location){
            filters.location = {$regex: location, $options: 'i'}
        }
        if(title){
            filters.title = {$regex: title, $options: 'i'}
        }
        if(minPrice){
            filters['ticketPricing.price'] = {$gte: Number(minPrice)}
        }
        if(maxPrice){
            filters['ticketPricing.price'] = {$lte: Number(maxPrice)}
        }
        const event = await eventModel.find(filters);
        if(event){
            res.status(200).send({message: "Search result matched", data: event});
        }
        else{
            res.status(400).send({message: "Search not matched"});
        }
    } catch (error) {
        console.log(`Error at ${req.originalUrl}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

const pendingEvents = async (req, res)=>{
    try {
        let docs = await eventModel.find({status: "none"});
        if(docs){
            res.status(200).send({message: "Events Pending", data: docs});
        }
        else{
            res.status(400).send({message: "No Pending events"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

const approveEvent = async (req, res)=>{
    try {
        const {id} = req.body;
        let docs = await eventModel.findOne({_id: id});

        if(docs){
            docs.status = "approved";
            docs.save();
            let events = await eventModel.find({status: "none"});
            console.log(events)
            res.status(200).send({message: "Event Approved", data: events});
        }else{
            res.status(400).send({message: "Event Not Found"});
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

const rejectEvent = async (req, res)=>{
    try {
        const {id} = req.body;
        let docs = await eventModel.findOne({_id: id});
        if(docs){
            docs.status = "rejected";
            docs.save();
            let events = await eventModel.find({status: "none"});
            console.log(events)
            res.status(200).send({message: "Event Rejected", data: events});
        }else{
            res.status(400).send({message: "Event Not Found"});
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

const cancelEvent = async (req, res)=>{
    try {
        const {id} = req.params;
        let event = await eventModel.findOne({_id: id});
        if(event && event.status === "approved"){
            event.status = "canceled";
            event.save();
            res.status(200).send({message: "Event Cancelled"});
        }else{
            res.status(400).send({message: "Event Not Found"});
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'});
    }
}

export default{
    createEvent,
    getAllEvents,
    getEventById,
    getApprovedEvents,
    searchEvents,
    pendingEvents,
    approveEvent,
    rejectEvent,
    cancelEvent
}