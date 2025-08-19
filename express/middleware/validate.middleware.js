import Joi from "joi";

function validate(req, res, next) {
    const schema = Joi.object({
        // ?
    });

    const { err } = schema.validate(req.body);
    if (err) return res.status(400).json({ message: err.details[0].message });

    next();
}

export default validate;

// make it util