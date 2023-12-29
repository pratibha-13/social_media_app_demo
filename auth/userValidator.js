const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    body("fullName").notEmpty().withMessage("Please fill out the mandatory fields.please fill out the fullName.").isString().withMessage("full name should be string"),
    body("userName").notEmpty().withMessage("Please fill out the mandatory fields.please fill out the userName.").isString().withMessage("user name should be string"),
    body("email").notEmpty().withMessage("Please fill out the mandatory fields.please fill out the email.").isString().withMessage("email should be string"),
  ]
}
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate
};