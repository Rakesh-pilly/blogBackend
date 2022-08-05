import express from "express";
import mongoose from "mongoose";
import blogRouter from "./routes/blog-routes";
import router from "./routes/user-routes";
import cors from "cors"
//uOSswrI6nrLH3HcF
// FUH68ngULGGyYJD0
// mongodb+srv://admin:<password>@cluster0.4dpcr.mongodb.net/?retryWrites=true&w=majority
const app = express();


app.use(cors())
app.use(express.json())


app.use("/api/user",router)
app.use("/api/blog",blogRouter)


mongoose
  .connect(
    "mongodb+srv://admin:FUH68ngULGGyYJD0@cluster0.4dpcr.mongodb.net/Blog?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .then(()=> console.log("connected to Database and listeting to localhost"))
  .catch((err)=> console.log(err))


