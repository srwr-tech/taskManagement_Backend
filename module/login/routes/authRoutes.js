// Correctly importing express and using express.Router()
import express from 'express';
import  { signUp, signIn }  from '../controllers/authController.js';  // Ensure you're importing the named export correctly
 import {newTask,getUpdatedData, getTask,getUserTask,getSelectedTask,deleteSelectedTask,updateSelectedTask,updateTask} from '../controllers/addTask.js'
 
// Create an instance of express Router
const router = express.Router();

// Define the route for signup
router.post('/signup', signUp);  // Use the named import directly here
 router.post('/signin', signIn);  // Use the named import directly here
 router.post('/addTask', newTask);  // Use the named import directly here
    router.get('/getTask', getTask)
    router.get('/getUserTask/:id', getUserTask)
    router.get('/getUpdatedData/:id', getUpdatedData)
    router.get('/getSelectedTask/:id', getSelectedTask);
    router.delete('/deleteSelectedTask/:_id', deleteSelectedTask);
    router.put('/updateSelectedTask/:_id', updateSelectedTask);
    router.put('/updateTask/:_id', updateTask);
// Export the router to be used in other modules
export default router;
