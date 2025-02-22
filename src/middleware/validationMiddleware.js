export const validate = (schema) => {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false });
        
        if (validation.error) {
            const errors = validation.error.details.map(error => ({
                field: error.path[0],
                message: error.message
            }));
            
            return res.status(400).json({
                status: 'error',
                errors: errors
            });
        }
        
        req.validatedData = validation.value;
        next();
    };
};