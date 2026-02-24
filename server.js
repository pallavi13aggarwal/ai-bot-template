
import express from "express";
import cors from "cors";
import chatRoute from "./routes/chat.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
app.use("/widget", express.static(path.join(__dirname, "widget")));

app.use("/chat", chatRoute);

app.use("/widget", express.static("widget"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
