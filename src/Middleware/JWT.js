const jwt = require("jsonwebtoken");

const Authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decodetoken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodetoken;
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "token is not found" });
  }
};

module.exports = Authentication;
