const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds")
const catchAsync = require("../utils/catchAsync"); // instead of try/catch on every async function 
const { isAuthor, validateCampground, isLoggedIn } = require("../middleware.js");
const multer = require("multer")
const { storage } = require("../cloudinary/index")
const upload = multer({ storage })



router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground))


// Order matters here, because it will look for campgrounds with "new" id otherwise
router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))




router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


router.get("/geolocation", (req, res) => {
    const response = `
    <script>
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      function showPosition(position) {
        console.log("Latitude: " + position.coords.latitude);
        console.log("Longitude: " + position.coords.longitude);
        // You can perform any further processing with the latitude and longitude values here
      }
    </script>
  `;

    res.send(response);
})




module.exports = router;