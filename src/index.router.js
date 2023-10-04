
import connectDB from '../DB/connection.js'
import userRouter from './modules/user/user.router.js'
import postRouter from './modules/post/post.router.js'
import authRouter from './modules/auth/auth.router.js'
import commentRouter from './modules/comment/comment.router.js'
import replyRouter from './modules/reply/reply.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'

const bootstrap = (app , express)=>{
    app.use(express.json())

   app.use("/auth", authRouter)
   app.use("/user", userRouter)
   app.use("/post", postRouter)
   app.use("/comment", commentRouter)
   app.use("/reply", replyRouter)

   app.use("*",(req,res,next)=>{
    return res.json({message:"In-valid Routing"})
   });
   app.use(globalErrorHandling)

   connectDB()
}

export default bootstrap