import mongoose from "mongoose";

const connectDB  = async()=>{
    return await mongoose.connect(process.env.DB_URL).then(result =>{
        console.log(`connected DB -----`);
    }).catch(err=>{
        console.log(`Fail to connect DB ------ ${err}`);
    })
}
export default connectDB
