export const authorize = (roles) => {
    return (req, res, next) => {
        console.log('User:', req.user); 
        if (!req.user) {
            return res.status(401).send({ status: 'error', message: 'No autenticado' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ status: 'error', message: 'Acceso denegado' });
        }
        next();
    };
};