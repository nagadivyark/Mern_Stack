const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization) return res.status(403).json({msg: "Not authorized. No token"})
        console.log("Authorization Header:", req.headers.authorization);

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
              console.log("JWT Error:", err.message);
              return res.status(403).json({ msg: "Wrong or expired token" });
            } else {
              console.log("Token decoded successfully:", data);
              req.user = data;
              next();
            }
          });
    }
}

module.exports = verifyToken