import { body, validationResult } from "express-validator";

const validateRequest = async (req, res, next) => {
  console.log(req.body);
  //1. Setup rules for validation
  const rules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should be postive value"),
    body("imageUrl").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Image is required!");
      }
      return true;
    }),
    // body("imageUrl").isURL().withMessage("Invalid url"),
  ];

  //2. Run those rules
  await Promise.all(rules.map((rule) => rule.run(req)));

  //3. Check if there are any errors after running the rules
  var validationErrors = validationResult(req);
  console.log(validationErrors);

  //4. If errors, return the error message
  if (!validationErrors.isEmpty()) {
    return res.render("new-product", {
      errorMessage: validationErrors.array()[0].msg,
    });
  }

  next();
};

export default validateRequest;
