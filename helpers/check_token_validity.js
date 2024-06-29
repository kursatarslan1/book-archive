const jwt = require("jsonwebtoken");

async function checkTokenValidity(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return resolve(false);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return resolve(false);
      }

      resolve(decoded);
    });
  });
}

module.exports = checkTokenValidity;
