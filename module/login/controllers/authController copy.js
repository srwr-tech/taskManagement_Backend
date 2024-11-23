const User = require('../models/userModel'); // Require the Mongoose User model
const referralUser = require('../models/referralSignupModel'); // Require the Mongoose User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretkey = process.env.secretkey || "sarwar";

const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const url = "mongodb://127.0.0.1:27017"; // MongoDB connection URL
const client = new MongoClient(url);

const session = require('express-session');
const nodemailer = require('nodemailer');
const signUp = async (req, res) => {
    const { username, email, password, mobile_no, referral, group_id } = req.body;

    try {
        // Check if the email already exists in MongoDB
        const existingUser = await User.findOne({ email });
        const doctoruser = await referralUser.findOne({ email });
        const bulkuser = await get_third__add_customer_data(email);
        if (existingUser || doctoruser || bulkuser) {
            return res.status(400).send('Email already in use. Please choose another.');
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to MongoDB
        const user = new User({ username, email, password: hashedPassword, mobile_no, referral, group_id });
        await user.save();

        // Sign JWT token
        jwt.sign({ user }, secretkey, { expiresIn: '300s' }, (err, token) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error signing token');
            }
            res.send({ user, auth: token });
        });

    } catch (error) {
        console.error("Error saving user to MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
};


const referralSignUp = async (req, res) => {

    const { selectedTitle, firstName, middleName, lastname, selectedCategory, selectedQualification, selectedSpecifization, countryCode, country, state, city, pincode, language, email, gpsLocation, clinicName, hospitalname, contactNo, alternativeNo, password, group_id, username, userid } = req.body;

    try {
        // Check if the email already exists in MongoDB
        const existingUser = await referralUser.findOne({ email });
        if (existingUser) {

            return res.status(400).send('Email already in use. Please choose another.');

        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to MongoDB
        const user = new referralUser({ selectedTitle, firstName, middleName, lastname, selectedCategory, selectedQualification, selectedSpecifization, countryCode, country, state, city, pincode, language, email, gpsLocation, clinicName, hospitalname, contactNo, alternativeNo, password: hashedPassword, group_id, status: 'inactive', userid, username });
        await user.save();

        // Sign JWT token
        const verificationToken = jwt.sign({ email }, secretkey, { expiresIn: '1d' });

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'layerlife5@gmail.com', // Replace with your actual Gmail email
                pass: 'twib xgoz uqyt ansj', // Replace with your actual Gmail password or an app password
            },
        });

        const mailOptions = {
            from: 'layerlife5@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `
            Dear Sir,

            I hope this email finds you well. We are thrilled to invite you to join our Referral Program and become a valuable part of our community.
            
            Our Referral Program is designed to reward our loyal customers like you for sharing your positive experience with others. By referring your friends, family, or colleagues to our services, you not only help them discover the quality we offer but also have the chance to earn exciting rewards.
            Click the following link to verify your email: http://192.168.1.14:3000/auth/verify?token=${verificationToken}


            Note : after varify email your password woulbe first 4 digit of name an
            d last four digit of mobile no, now you can got to reset password and reset your password after entering password and your security question. 
            Link to reset your password :  {http://localhost:8080/resetpassword}
            
            
            
            `,
        };

      

    } catch (error) {
        console.error("Error saving user to MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
};

const referalUserVerify = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretkey);
        const email = decoded.email;

        // Find the user in MongoDB
        const user = await referralUser.findOne({ email });

        // Check if the user exists and is still inactive
        if (!user || user.status === 'active') {
            return res.status(400).send('Invalid verification link.');
        }

        // Update user status in MongoDB (e.g., set 'verified' field to true)
        await referralUser.updateOne({ email }, { $set: { status: 'active' } });

        res.send('Email verified successfully. You can now login.');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Email verification failed.');
    }
}

const getReferalTable = async (req, res) => {
    try {
        // Assuming the user ID is available in the request object after authentication

        const userId = req.params.userId;

        // Fetch events that match the user ID
        const events = await referralUser.find({ userid: userId });

        res.json(events);
    } catch (err) {
        console.error('Error while fetching events:', err);
        res.status(500).json({ error: 'Error while fetching events.' });
    }
};

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in MongoDB by email
        const userfirst = await User.findOne({ email });
        const doctoruser = await referralUser.findOne({ email });
        const bulkuser = await get_third__add_customer_data(email);
       
        let user;
        if (bulkuser !== null && doctoruser != '') {
            user = bulkuser;
        }
        else if (doctoruser !== null && doctoruser != '') {
            user = doctoruser;
        } else if (user !== null && user != '') {
            user = userfirst;
        }

        if (user) {
            // Check if the user status is active

            if (user.status === 'active') {
                // Compare the entered password with the stored hashed password
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    // Sign JWT token
                    jwt.sign({ user }, secretkey, { expiresIn: '300s' }, (err, token) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Error signing token');
                        }
                        res.send({ user, auth: token });
                    });
                } else {
                    res.status(401).send('Wrong email/password. Please try again!');
                }
            } else {
                res.status(401).send('Account is inactive. Please contact support.');
            }
        } else {
            res.status(401).send('Wrong email/password. Please try again 2');
        }

    } catch (error) {
        console.error("Error finding user in MongoDB:", error);
        res.status(500).send("Internal Server Error");
    }
};

const resetpassword = async (req, res) => {

    try {

        const { lastpassword, confirmnewpassword, email, newpassword, petname } = req.body;

        const user = await referralUser.findOne({ email: email });
        // Check if the old password and pet name match the user's stored values

        if (user && bcrypt.compareSync(lastpassword, user.password) && petname === user.petname & lastpassword !== newpassword) {

            if (newpassword == confirmnewpassword) {
                // Hash the new password before updating
                const hashedPassword = bcrypt.hashSync(newpassword, 10);

                // Update the user's password in the database

                await referralUser.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } });

                // Send a success response
                res.status(200).send('Password updated successfully!');
            } else {
                // Send an error response if new password and confirm new password do not match
                res.status(400).send('New password and confirm new password do not match.');
            }
        } else {
            // Send an error response if old password or pet name is incorrect
            res.status(401).send('Incorrect old password or pet name.');
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Internal Server Error');
    }
}
//forgot password






// for authentication of bulk user
const get_third__add_customer_data = async (_this) => {

    await client.connect();
    const db = client.db("CRM");
    const collection = db.collection("third__add_customer_data");
    const query = { email: _this };
    const data = await collection.findOne(query);
    return data;
};


module.exports = {
    signUp,
    signIn,
    referralSignUp,
    referalUserVerify,
    resetpassword,
    getReferalTable
};
