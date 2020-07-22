require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 8000;
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//route objects
const authRoutes = require("./routes/authenticate");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

//middlewares
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());

//App DB Connection
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
 }).then(() => {
     console.log("DB CONNECTED")
 }).catch(error => console.log("something wrog happened"));

//App Routes
app.use("/ecom",authRoutes);
app.use("/ecom",userRoutes);
app.use("/ecom",categoryRoutes);
app.use("/ecom",productRoutes);
app.use("/ecom",orderRoutes);

//Starting server
app.listen(port,()=>{
    console.log(`App is Running on ${port}`);
});