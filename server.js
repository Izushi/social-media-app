const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const PORT = process.env.PORT || 3000;
// const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

const encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const connectionString = `mongodb+srv://izushi:${encodedPassword}@cluster0.7u4zt.mongodb.net/socialMediaApp?retryWrites=true&w=majority&appName=Cluster0`;

// connect to mongodb
mongoose.connect(connectionString)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log(err);
});

// middleware
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hello, express!");
});

// app.listen(PORT, () => console.log("server up"));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});