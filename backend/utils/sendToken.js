const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {

  // Create JWT token
  const token = user.getJWTToken();

  // Cookie options (FIXED for production)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,        // 🔥 REQUIRED for HTTPS (Render + Netlify)
    sameSite: "None",    // 🔥 REQUIRED for cross-origin cookies
  };

  // Send cookie
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // Response
  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

module.exports = sendToken;
