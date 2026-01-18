const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

console.log('--- START DEBUG ---');
const logFile = 'debug_log.txt';
fs.writeFileSync(logFile, 'Starting debug script...\n');

const safeUri = process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED';
fs.appendFileSync(logFile, `URI: ${safeUri}\n`);

// Check IP
console.log('Checking IP...');
https.get('https://api.ipify.org?format=json', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const ip = JSON.parse(data).ip;
            fs.appendFileSync(logFile, `Public IP: ${ip}\n`);
            console.log(`Your public IP address is: ${ip}`);
            console.log('Please add this IP address to your MongoDB Atlas IP whitelist.');
            connectDB();
        } catch (e) {
            fs.appendFileSync(logFile, `IP Parse Error: ${e.message}\n`);
            connectDB();
        }
    });
}).on('error', (err) => {
    fs.appendFileSync(logFile, `IP Request Error: ${err.message}\n`);
    console.log('Could not automatically determine your IP address.');
    console.log('Please find your public IP address by searching "what is my IP" in your web browser.');
    console.log('Then, add that IP address to your MongoDB Atlas IP whitelist.');
    connectDB();
});

function connectDB() {
    console.log('Connecting to DB to test connection...');
    fs.appendFileSync(logFile, 'Attempting Mongoose connect...\n');
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            fs.appendFileSync(logFile, 'CONNECTION SUCCESS\n');
            console.log('MongoDB connection successful after whitelisting.');
            process.exit(0);
        })
        .catch((err) => {
            fs.appendFileSync(logFile, `CONNECTION FAILED: ${err.name} - ${err.message}\n`);
            if (err.cause) fs.appendFileSync(logFile, `Cause: ${JSON.stringify(err.cause)}\n`);
            console.log('MongoDB connection failed. Please double check your IP whitelist and MONGODB_URI.');
            process.exit(1);
        });
}