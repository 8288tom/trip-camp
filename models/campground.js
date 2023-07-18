const mongoose = require("mongoose");
const Review = require("./review");
const { number } = require("joi");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,

})
ImageSchema.virtual("thumbnail")
    .get(function () {
        return this.url.replace("/upload", "/upload/w_200")
    })
// Below options is used to work with data that has been turned into JSON with mongoose
const options = { toJSON: { virtuals: true }, timestamps: true }
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

}, options);

// mapboxGL Virtuals for index page
CampgroundSchema.virtual("properties.popUpMarkup")
    .get(function () {
        return '<strong><a href="/campgrounds/' + this._id + '">' + this.title + '</a></strong><p>' + this.description.substring(0, 80) + '...</p>'
    })

CampgroundSchema.virtual("properties.thumbnail")
    .get(function () {
        return `<a href="/campgrounds/${this._id}"><img src="${this.images[0].url}" alt="" class="img-thumbnail"></img></a>`
    })

// When deleting a campground the below middleware will remove all the reviews inside the reviews array
CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        console.log(doc.reviews)
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

    }
})

module.exports = mongoose.model("Campground", CampgroundSchema)