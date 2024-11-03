import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/connect.js";

dotenv.config({
    path: "./env"
})

const port = process.env.PORT || 3000;

(async () => {
    await connectDB();
    try {
        app.on("error", (err) => {
            console.log("Something bad happened at the server level:", err.message);
        });
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
    } catch (error) {
        console.error("error has occured:- ", error.message);
    }
})();
