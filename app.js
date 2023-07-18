if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

require("dotenv").config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //to use layouts
const methodOverride = require("method-override"); // to use more http requets
const { campgroundSchemaValidation, reviewSchemaValidation } = require("./schemas")
const ExpressError = require("./utils/ExpressError");
const session = require("express-session")
const MongoStore = require('connect-mongo');

const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user")
const mongoSanitize = require('express-mongo-sanitize');
const helmetConfig = require("./helmetConfig")
const favicon = require('express-favicon');
const dbUrl = process.env.DB_URL;
// const dbUrl = "mongodb://127.0.0.1:27017/yelp-camp"

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})


// routes:
const reviewRoutes = require("./routes/reviews")
const campgroundRoutes = require("./routes/campground");
const userRoutes = require("./routes/users");
const helmet = require("helmet")


const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))


app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(favicon(path.join(__dirname, 'public', 'favicon', 'tree.png')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'ooooh,whatasecret!ssa!'
    }
});

store.on("error", function (e) {
    console.log("Session store error:", e)
})

const sessionConfig = {
    store,
    name: "ss41",
    secret: "ooooh,whatasecret@ss41!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(mongoSanitize());
app.use(helmet({
    xContentTypeOptions: false
}))


app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...helmetConfig.connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...helmetConfig.scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...helmetConfig.styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:", ...helmetConfig.imgSrcUrls
            ],
            fontSrc: ["'self'", ...helmetConfig.fontSrcUrls],
            upgradeInsecureRequests: null,
            reportUri: null
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// The belwo app.use adds the flash and user_id to every request
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})



// using routes:
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews", reviewRoutes)

app.get("/", (req, res) => {
    res.render("home")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})
// The above and below routes are connected, when no route is matched it will invoke the app.all which
// will send to the next middleware 
// and will use the ExpressError message and status
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    // res.status(err.statusCode).send(err.message)
    res.status(statusCode).render("error", { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
