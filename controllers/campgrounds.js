const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
let geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const { page = 1, limit = 15 } = req.query;
    const allCampgrounds = await Campground.find({});
    let countPages = await Campground.countDocuments();
    countPages = (countPages / 15) + 1

    const campgrounds = await Campground.find({})
        .sort("-createdAt")
        .limit(limit * 1)
        .skip((page - 1) * limit)
    res.render("campgrounds/index", { campgrounds, countPages, currentPage: parseInt(page), allCampgrounds })
    // res.send(campgrounds)

}
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
        .catch((e) => {
            console.log(e)
        })
    // The below try/catch can be replaced by: catchAsync(body)  coming from utils
    const campground = new Campground((req.body.campground))
    campground.geometry = (geoData.body.features[0].geometry)
    // take req.files, map them to array
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            }
            )
            .populate("author");
        if (!campground) {
            req.flash("error", "Campground not found")
            return res.redirect("/campgrounds/")
        }
        res.render("campgrounds/show", { campground, currentUser: req.user })

    } catch (e) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")

    }

}
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground not found")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // take the imgs array, and spread the data into campground.images
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Successfully updated!")
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    const campgroundDelete = await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted")
    res.redirect("/campgrounds")
}