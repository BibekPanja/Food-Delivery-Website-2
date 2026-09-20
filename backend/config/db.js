import mongoose from "mongoose";
export const connectDB = async () => {
    await mongoose
.connect("mongodb+srv://bibekpanja5_db_user:xcP6INwnd3fUQNKi@cluster0.ko9vmve.mongodb.net/food-del"
)
.then(() => console.log("DB Connected"));

}