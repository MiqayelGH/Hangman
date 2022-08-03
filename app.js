import express from "express";
import path from "path";
import mainRouter from "./routers/main-router.js"
import expressLayouts from "express-ejs-layouts"
const app = express();

app.set('view engine','ejs');
app.set('views',path.resolve('views'));
app.set('layout', './layouts/main-layout.ejs');
app.use(expressLayouts);
app.use(express.static(path.resolve('public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/',mainRouter);

app.listen(process.env.PORT || 3000);