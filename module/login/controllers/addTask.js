// Import necessary packages and models
import AddTask from '../models/addtaskModel.js'
import GetData from '../models/userModel.js'
import mongoose from 'mongoose';
const newTask = async (req, res) => {
    try {
        const user = new AddTask(req.body);  // Instantiate but don't await here
        await user.save();  // Await save, since this returns a promise
    
        res.status(200).send(user); // Optional: send back response indicating task created
    } catch (error) {
        console.error("Error saving user to MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
};
const getUserTask = async (req, res) => {
    try {
        const userId = req.params.id;  // Extract user ID from URL params
    

        // Query both 'userId' and 'selectedUserId' fields
        const getData = await AddTask.find({
            $or: [
                { userId: userId },      // Find tasks with userId
                { selectedUserId: userId } // Find tasks with selectedUserId
            ]
        });

    

        // Return the tasks found
        res.json(getData);

    } catch (err) {
        console.error("Error during getting data:", err);
        res.status(500).send("Internal Server Error");
    }
};

const getUpdatedData=async (req,res)=>{
    try {
    const userId = req.params.id;
    
    const getData = await AddTask.find({ _id: new mongoose.Types.ObjectId(userId) });
    res.json(getData);
    
    }
    catch (err){
        console.error(err,"error during getting data");
        res.status(500).send("Internal Server Error");

    }
}
const getSelectedTask=async (req,res)=>{
    try {
    const userId = req.params.id;
    
    const getData = await AddTask.find({_id: new mongoose.Types.ObjectId(userId) });
    
        res.json(getData);
    
    }
    catch (err){
        console.error(err,"error during getting data");
        res.status(500).send("Internal Server Error");

    }
}
const updateSelectedTask=async (req,res)=>{
    try {
    const userId = req.params._id;

    const newStatus = 'Completed';
    const updateData = await AddTask.findOneAndUpdate({_id: new mongoose.Types.ObjectId(userId) },{status: newStatus},
    { new: true }  );
    
    res.json(updateData);
    
    }
    catch (err){
        console.error(err,"error during getting data");
        res.status(500).send("Internal Server Error");

    }
}
const updateTask=async (req,res)=>{
    try {
    const userId = req.params._id;
    
    const updatedTaskData=req.body
        

    const updateData = await AddTask.findOneAndUpdate(
        { _id:  new mongoose.Types.ObjectId(userId) },
        { $set: updatedTaskData },
        { new: true }
      );
    res.json(updateData);
    
    }
    catch (err){
        console.error(err,"error during getting data");
        res.status(500).send("Internal Server Error");

    }
}
const deleteSelectedTask=async (req,res)=>{
    try {


    const userId = req.params._id;

    const getData = await AddTask.findOneAndDelete({_id: new mongoose.Types.ObjectId(userId) });
    
    res.json(getData);
    
    }
    catch (err){
        console.error(err,"error during getting data");
        res.status(500).send("Internal Server Error");

    }
}
const getTask=async (req,res)=>{
    try {
   
    
    const getData = await GetData.find();
    res.json(getData);
    
    }
    catch (err){
        console.error(err,"error during getting data");
        res.status(500).send("Internal Server Error");

    }
}



export { newTask ,getTask,getUserTask,getSelectedTask,deleteSelectedTask,updateSelectedTask,updateTask,getUpdatedData};
