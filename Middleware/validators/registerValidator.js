const { body } = require("express-validator")


/*userName
 firstName
 lastName
 email
 dateOfBirth 
 country 
 city 
 password*/


const registerValidatorRules = {
    add: [
        body("userName")
            .trim()
            .isLength({ min: 4, max: 25 })
            .withMessage("UserName should be more than 4 letters and less than 25 letters")
        , body("password")
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
        , body("dateOfBirth")
            .trim()
            .isDate()
            .withMessage("Date is wrong format")
        , body("country")
            .isLength({ min: 1 })
            .withMessage("Country name is required")
        , body("city")
            .isLength({ min: 1 })
            .withMessage("City name is required")
    ]
}
module.exports = registerValidatorRules;