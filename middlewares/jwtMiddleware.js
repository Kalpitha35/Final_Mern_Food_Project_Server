// const jwt = require('jsonwebtoken');

// const jwtMiddleware = (req, res, next) => {
//     console.log("Inside jwtMiddleware");

//     try {
//         // Extract the token from the Authorization header
//         const authHeader = req.headers["authorization"];
//         if (!authHeader) {
//             return res.status(401).json({ message: "Authorization failed. Token is missing." });
//         }

//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ message: "Authorization failed. Token is invalid." });
//         }

//         // Verify the token
//         const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
//         console.log("JWT Verified:", jwtResponse);

//         // Check if the user is an admin
//         if (jwtResponse.role !== 'admin') {
//             return res.status(403).json({ message: "Access denied. Admins only." });
//         }

//         // Attach the decoded user ID and role to the request for downstream use
//         req.userId = jwtResponse.userId;
//         req.userRole = jwtResponse.role;

//         next(); // Proceed to the next middleware/controller
//     } catch (err) {
//         console.error("JWT Middleware Error:", err.message);
//         res.status(401).json({ message: "Authorization failed. Invalid or expired token." });
//     }
// };

// module.exports = jwtMiddleware;


// const jwt = require('jsonwebtoken')

// const jwtMiddleware = (req,res,next)=>{
//     console.log("inside jwtMiddleware");
//     const token = req.headers["authorization"].split(" ")[1]
//     console.log(token);
//     if(token){
//         try {
//             const jwtResponse = jwt.verify(token,process.env.JWTPASSWORD)
//             console.log(jwtResponse);
//             req.userId = jwtResponse.userId
//             next()
//             } 
//         catch (err) {
//             res.status(401).json("Authorization Failed... Please Login!!!")
//         }
//     }else{
//         res.status(404).json("Authorization Failed...  Token is missing")
//     }
    
// }

// module.exports = jwtMiddleware



const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside jwtMiddleware");

    // Check if 'Authorization' header exists and is formatted correctly
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        return res.status(401).json("Authorization Failed... Token is missing");
    }

    // Extract the token from the "Bearer <token>" format
    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json("Authorization Failed... Token is missing");
    }

    try {
        // Verify the token using the secret key
        const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
        console.log("JWT Verified:", jwtResponse); // Remove or modify this line in production

        // Attach the userId to the request for further use in routes
        req.userId = jwtResponse.userId;
        
        // Continue to the next middleware or route handler
        next();
    } catch (err) {
        console.error("JWT Verification Failed:", err); // Log errors in case of failed verification
        return res.status(401).json("Authorization Failed... Invalid or expired token");
    }
};

module.exports = jwtMiddleware;

