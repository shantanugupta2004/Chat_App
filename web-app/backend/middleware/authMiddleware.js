import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // Ensure it contains both `userId` and `username`
        console.log("User authenticated:", req.user);
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token" });
    }
};
