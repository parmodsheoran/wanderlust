const mongoose = require("mongoose");
const intializedata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/Wanderlust";

// Response from DataBase
main().then(() => {
    console.log("Connected to DataBase");
})
    .catch((err) => {
        console.log(err);
    })

// Connect to DB
async function main() {
    mongoose.connect(MONGO_URl);
};

const initDB = async () => {
    await Listing.deleteMany({});
    intializedata.data = intializedata.data.map((obj) => ({
        ...obj, owner: "677abc3f2b04c0aa8ce458da"
    }));
    await Listing.insertMany(intializedata.data);
    console.log("Data is Saved");
};

initDB();