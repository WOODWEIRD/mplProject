const { body } = require("express-validator")


/*
 firstName
 lastName
 email
 country 
 city 
 password*/

const editProfileValidatorRules = {
    add: [
        body("password")
            .trim()
            .isLength({ min: 5 })
            .withMessage("Password should be atleast 5 charecters")
        , body("firstName")
            .isLength({ min: 1 })
            .withMessage("first name is required")
        , body("lastName")
            .isLength({ min: 1 })
            .withMessage("last name is required")
        , body("email")
            .trim()
            .isEmail()
            .withMessage("Email is wrong format")
        , body("country")
            .isLength({ min: 1 })
            .withMessage("Country name is required")
        , body("city")
            .isLength({ min: 1 })
            .withMessage("City name is required")
    ]
}
module.exports = editProfileValidatorRules;