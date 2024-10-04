import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req,res) => {
   try {
        const {message} = req.body;
        const {id: receiverId} = req.params
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        // using this method would slowthe code a bit more and we we require it to be a bit more optimized, which is why we would use line 34
        // await conversation.save(); 
        // await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()])

        // SOCKETIO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            // io.to(<socketID>).emit() is used to send event to specific clients
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        res.status(201).json(newMessage);
   } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({error: 'Internal Server Error'})
   }
} 

export const getMessage = async(req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages") //Using the populate gives the message and not just the Id reference

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages

        res.status(200).json(messages);
    } catch (error) {
        console.log('Error in getMessage controller', error.message);
        res.status(500).json({error: 'Internal Server Error' });
    }
}