import "reflect-metadata";
import express from "express";
import AppDataSource from "./data-source.js";
import * as linktreeController from "./controllers/linktree-controller.js";
import * as linksController from "./controllers/links-controller.js";

const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());

async function initializeApp() {
  await AppDataSource.initialize();
  console.log("Database connected using TypeORM");

  app.get("/", linktreeController.getLinktrees);

  app.post("/", linktreeController.createLinktree);

  app.get("/:linktreeId", linktreeController.getLinktreeByIdAndUserId);

  app.delete(
    "/:linktreeId",

    linktreeController.deleteLinktree
  );

  app.post("/:linktreeId/links", linksController.createLink);

  app.delete("/:linktreeId/links/:linkId", linksController.deleteLink);

  app.patch("/:linktreeId/links/:linkId", linksController.updateLink);

  app.get("/:suffix/public", linktreeController.getLinktreeBySuffix);

  app.listen(PORT, () => {
    console.log(`Linktrees Management Service is running on port ${PORT}`);
  });
}

initializeApp().catch((error) => {
  console.error("Error initializing app:", error);
  process.exit(1);
});
