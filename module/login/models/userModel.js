// userModel.js

import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    mobile_no:String,
    referral:String,
    group_id:String,
    status: {
        type: String,
        enum: ['inactive', 'active'],
        default: 'inactive',
    },
    
});
const User = mongoose.model('RegistrationUser', userSchema);


// module.exports = User;
export default User;