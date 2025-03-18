import jwt from "jsonwebtoken";

export const createToken = (user) => {
    //creating the tokens with jwt.sign

    const accessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken }

};