import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";

import swaggerDocument from "./swagger.json" assert { type: "json" };
import authRouter from "./routes/authRouter.js";
import boardsRouter from "./routes/boardsRouter.js";
import columnsRouter from "./routes/columnsRouter.js";
import cardsRouter from "./routes/cardsRouter.js";
import mongoose from "mongoose";
import "dotenv/config";

const { DB_HOST, PORT = 3000 } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", authRouter);
app.use("/api/boards", boardsRouter);
app.use("/api/columns", columnsRouter);
app.use("/api/cards", cardsRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// app.use((_, res) => {
//   res.status(404).json({ message: "Цей сервер не для Вас )))" });
// });
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, './helpers/error.html'));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });

export default app;
