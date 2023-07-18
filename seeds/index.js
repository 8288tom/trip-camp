const mongoose = require("mongoose")
const Campground = require("../models/campground")
const cities = require("./cities")
const descriptors = require("./seedHelpers").descriptors
const description = require("./seedHelpers").descriptions
const places = require("./seedHelpers").places
const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, perspiciatis incidunt? Laborum reprehenderit iure aut quos, necessitatibus excepturi, ab mollitia ipsum atque quod repellat distinctio, dolore autem non vitae eum."
const imagesJson = require("./cloudinaryImagesData.js")




mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})


const sample = (array) => array[Math.floor(Math.random() * array.length)]




const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random98 = Math.floor(Math.random() * 98);
        const random1000 = Math.floor(Math.random() * 1000);
        const random422 = Math.floor(Math.random() * 422)
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // admin user
            author: "64995f40fcd3e99dccc18631",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [imagesJson.images[random422], imagesJson.images[(random422 + 1) % 422]],
            description: description[random98],
            price: price,
            geometry: { "type": "Point", "coordinates": [cities[random1000].longitude, cities[random1000].latitude] }
        },
        )
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})


