import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        app.on("error", (err) => {
            console.error("something bad happens", err.message);
        } )
        app.listen(port, () => {
            console.log(`server is running on port ${port}`);
        })
    } catch (error) {
        console.error("error has occured", error.message)
    }
};

start();