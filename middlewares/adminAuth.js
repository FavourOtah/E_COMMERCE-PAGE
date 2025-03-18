export const adminAuthorization = (req, res, next) => {
    //checking if the user is logged in and is an admin
    if (req.token && req.token.isAdmin) {
        next()
    } else {
        return res.status(403).json({
            message: "Admins only"
        })
    }

};