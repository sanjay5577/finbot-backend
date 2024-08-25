const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

console.log("Starting application...");

mongoose 
.connect(config.mongoose.url)
.then(() => {
    console.log("Connected to database")
    const server = app.listen(config.port, () => {
        console.log(`Server listening on ${config.port}`)
    })
})
.catch((err) => console.log(err));
