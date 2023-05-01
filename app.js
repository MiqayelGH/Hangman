import express from "express";
import path from "path";
import mainRouter from "./routers/main-router.js";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs");
app.set("views", path.resolve("views"));
app.set("layout", "./layouts/game-layout.ejs");
app.use(expressLayouts);
app.use(express.static(path.resolve("public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", mainRouter);
app.use("/*", (req, res) => {
  return res.status(404).sendFile(path.resolve("./public/error.html"));
});

app.listen(PORT, () => {
    console.log('listening on port:', PORT)
});
