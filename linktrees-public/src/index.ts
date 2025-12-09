import express from "express";
import { getPublicLinktree } from "./controller/linktrees-public-controller.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.use((req, _res, next) => {
  console.log("PUBLIC PATH:", req.method, req.url);
  next();
});

app.get("/linktrees/:linktreeSuffix", getPublicLinktree);

app.listen(PORT, () => {
  console.log(`Linktrees Public Service is running on port ${PORT}`);
});
