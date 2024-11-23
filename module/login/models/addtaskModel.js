
import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    TaskName: String,
    UserName: String,
    taskpriority: String,
    UserObjectId:String,
    status: String,
    userId:String,
    date:String,
    discription:String,
    selectedUserId:String
},{timestamps:true});
const newTask = mongoose.model('AddTask', userSchema);
// module.exports = newTask;
export default newTask;
