const jwt = require("jsonwebtoken")

const config = process.env;

const verifyToken = (req, res) => {
  const { token } = req.body

  if (!token) {
    res.status(403).send("A token is required for authentication")
  } else {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET)
      console.log(decoded)
      res.status(200).send('Valid Token')
    } catch (err) {
      res.status(401).send("Invalid Token")
    }
  }
}

module.exports = verifyToken