const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(
            'Trending',
            'Rooms',
            'Iconic-cities',
            'Mountains',
            'Castles',
            'Amazing-view',
            'Amazing-pools',
            'Camping',
            'Farms',
            'Domes',
            'Boats'
        ).required(),
        image: Joi.object({
            filename: Joi.string().default("listingimage"),
            url: Joi.string().uri().allow('').required(), // Validate that the image.url is a valid URI
        }).optional(), // Make the image field optional if it might not be included
    }).required(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})