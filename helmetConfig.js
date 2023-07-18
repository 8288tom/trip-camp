
const imagesObject = require("./seeds/cloudinaryImagesData")

module.exports.scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
module.exports.styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
];
module.exports.connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
module.exports.fontSrcUrls = [];

module.exports.imgSrcUrls = ["https://res.cloudinary.com/dcvbxxryo/",
    "https://res.cloudinary.com/dcvbxxryo/image/upload",
    "https://images.unsplash.com/",

]



const cloudinaryImgsUrl = function () {
    imagesObject.images.forEach((element) => {
        module.exports.imgSrcUrls.push(element.url);
        const transformedUrl = element.url.replace("/upload/", "/upload/w_200/");
        module.exports.imgSrcUrls.push(transformedUrl);
    });
};

cloudinaryImgsUrl()
