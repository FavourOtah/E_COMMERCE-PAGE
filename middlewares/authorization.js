import jwt from "jsonwebtoken";

export const authorization = (req, res, next) => {
    try {
        const { accessToken } = req.cookies
        if (!accessToken) { return res.status(401).json({ message: "No token found." }) }

        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {});

        req.token = { userId: payload.userId, isAdmin: payload.isAdmin }

        next()
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message })

    }
};