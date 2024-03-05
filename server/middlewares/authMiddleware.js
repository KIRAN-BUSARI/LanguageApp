import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
    // const token = req.cookies.token || null;
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "") || null;
    // console.log("TOKEN", token);
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Login to access this route"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'LanguageTranslatorApp');
        // console.log(decoded.userId);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next(); // Call next middleware
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            message: "Unauthorized, please login to continue"
        });
    }
};


const adminMiddleware = (...roles) =>
    async (req, res, next) => {
        // const token = req.cookies.token;
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "") || null;
        // console.log(token);

        if (!token) {
            res.status(400).json({
                success: false,
                message: "Unauthorized, please login to continue"
            })
        }

        try {
            const decodedRole = jwt.verify(token, process.env.JWT_SECRET || 'LanguageTranslatorApp');
            // console.log(decodedRole.role);
            if (!decodedRole.role) {
                res.status(400).json({
                    success: false,
                    message: "Role information not found in the token"
                })
            }

            req.user = req.user || {};

            req.user.role = decodedRole.role;
            // console.log(req.user.role);
            // console.log(roles);


            if (!roles.includes(req.user.role)) {
                res.status(403).json({
                    success: false,
                    message: "You don't have permission to access this route"
                })
            }

            next();
        } catch (err) {
            res.status(403).json({
                success: false,
                message: "Could not verify the token"
            })
        }
    };


export {
    isLoggedIn,
    adminMiddleware
}
