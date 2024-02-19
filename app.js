require("express-async-errors");
const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const Sequelize = require("sequelize");
const app = express();
const port = 5001;
const router = require("./src/routers");
const errorHandlerMiddleware = require("./src/middlewares/errorHandler");

//MiddleWares
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
//sequelize connection for session store
const sequelize = new Sequelize('conquerer', 'newuser', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

app.use(session({
  secret: '3BolIeqFta',
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 //1 hour
  }
}));

// Force sync database
sequelize.sync();

app.get("/", (req, res) => {
    res.send("Welcome to Conquerer API!");
  });
app.use("/", router);  //Main router

//Exception handling
 app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is alive on port ${port}...`);
});
