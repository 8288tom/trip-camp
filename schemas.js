// to validate easily on server side 
const Joi = require("joi")


module.exports.campgroundSchemaValidation = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }
    ).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchemaValidation = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})