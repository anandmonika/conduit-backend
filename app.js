require("dotenv").config();
const express = require("express");
const app = express();
const userRouter =require("./api/users/user.router");
const articleRouter = require("./api/article/article.router")

app.use(express.json());

app.use("/api", userRouter);
app.use("/api", articleRouter);

app.listen(process.env.APP_PORT, ()=>{
    console.log("Server up and running on PORT:",process.env.APP_PORT);
})