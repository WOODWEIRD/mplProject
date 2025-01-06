const { body } = require("express-validator")


/*
 title
 content
 tags
 author 
*/

const blogValidatorRules = {
    add: [
        body("title")
            .trim()
            .isLength({ min: 1 })
            .withMessage("title is required")
        , body("content")
            .trim()
            .isLength({ min: 5 })
            .withMessage("content is required")
        , body("tags")
            .trim()
            .isLength({ min: 1 })
            .withMessage("tags are required")
    ]
}
module.exports = blogValidatorRules;