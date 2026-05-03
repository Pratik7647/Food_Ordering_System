const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const aiRoutes = require("./routes/ai.routes");
const errorMiddleware = require("./middlewares/errors");

// ✅ CORS CONFIG (FINAL)
app.use(cors({
  origin: "https://tiny-salmiakki-456361.netlify.app", // 🔥 your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Optional: Stripe proxy (only if needed)
app.use("/proxy", (req, res) => {
  const request = require("request");
  const url = "https://checkout.stripe.com" + req.url;
  req.pipe(request(url)).pipe(res);
});

// Routes
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const cart = require("./routes/cart");

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));

app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/eats/cart", cart);
app.use("/api/v1/ai", aiRoutes);

// View engine (optional)
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
