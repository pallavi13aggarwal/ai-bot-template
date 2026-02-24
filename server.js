
import express from "express";
import cors from "cors";
import chatRoute from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
