import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
@injectable()
class UserValidator {
  createUserSchema() {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address.",
        "any.required": "Email is required.",
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "Password must not be empty.",
        "any.required": "Password is required.",
        "string.min": "Password should have a minimum length of 6 characters.",
      }),
      dateOfBirth: Joi.date().iso().required().messages({
        "date.iso":
          "Please enter a valid ISO date format (YYYY-MM-DD) for the date of birth.",
        "any.required": "Date of birth is required.",
      }),
      gender: Joi.required().messages({
        //"boolean.base": "Gender must be a boolean value (true or false).",
        "any.required": "Gender is required.",
      }),
      fullName: Joi.string().min(2).optional().messages({
        "string.empty": "Name must not be empty.",
        "any.required": "Name is required.",
        "string.min": "Name should have a minimum length of 2 characters.",
      }),
      maritalStatus: Joi.string()
        .valid("Single", "Married", "Divorced", "Widowed")
        .required()
        .messages({
          "any.only":
            "Marital status must be one of: 'Single', 'Married', 'Divorced', 'Widowed'.",
          "any.required": "Marital status is required.",
        }),
      children: Joi.number().integer().min(0).optional().messages({
        "number.base": "Number of children must be a valid integer.",
        "number.min": "Number of children cannot be negative.",
        "any.required": "Number of children is required.",
      }),
      hoursOfWork: Joi.number().integer().min(0).optional().messages({
        "number.base": "Hours number of work must be a valid integer.",
        "number.min": "Hours number of work  cannot be negative.",
      }),

      profession: Joi.string().required().messages({
        "string.empty": "Profession must not be empty.",
        "any.required": "Profession is required.",
      }),
      placeOfWork: Joi.string().optional().messages({
        "string.empty": "place Of Work must not be empty.",
      }),
      deviceToken: Joi.string().required().messages({
        "string.empty": "deviceToken must not be empty.",
        "any.required": "deviceToken is required.",
      }),
    });

    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  }
}

export default UserValidator;
