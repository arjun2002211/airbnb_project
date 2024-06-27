const mongoose = require('mongoose');
const atlasdbUrl = process.env.ATLASDB_URL;
// console.log(atlasdbUrl);
let initdata = require('./data.js');
let listing = require('../model/listing.js');
main().then(res => { console.log("database connected") }).catch(err => { console.log(err) });

async function main() {
    await mongoose.connect('mongodb+srv://arjunprajapat2002211:pHZ44qQ3szAnQd6b@cluster0.ghqfh9f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
};

const initDb = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '667bf3e4d064a3152390c2ec', geometry: { type: "Point", coordinates: [] } }));
    await listing.insertMany(initdata.data).then(res => { console.log(res) }).catch((err) => { console.log(err) });
}

initDb();