import express from "express"
import cors from "cors"
import connectDb from "./src/database/database.js"
import blogRouter from "./src/routers/blog.router.js"
import userRouter from "./src/routers/user.router.js"
const app=express()

app.use(express.json())
app.use(cors())

app.use("/api/user",userRouter)
app.use("/api/blog",blogRouter)

app.listen(8000,()=>{
    console.log("Server is listen on port 8000")
    connectDb()
})