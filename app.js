const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');

const MongoDbStore = require('connect-mongodb-session')(session);

const path = require('path');
const rootDir = require('./utils/pathUtil.js');

const storeRouter = require(path.join(rootDir, 'routes', 'storeRouter'));
const hostRouter = require(path.join(rootDir, 'routes', 'hostRouter'));
const authRouter = require(path.join(rootDir, 'routes', 'authRouter'));
const errorController = require('./controllers/error.js');

const app = express();

const store = new MongoDbStore({
  uri: "mongodb+srv://root:rootA2@cluster0.lexqax8.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0",
  collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req,res,next)=>{
  console.log(req.url, req.method);
  next();
})

app.use(express.urlencoded({extended:true}));

app.use(session({
  secret: 'Mewtwo',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(express.static(path.join(rootDir, 'public')));

app.use((req,res,next)=>{
  req.isLoggedIn = req.session.isLoggedIn;
  next()
})

app.use(storeRouter);

app.use("/host", (req,res,next)=>{
  if(!req.isLoggedIn) {
    res.redirect("/login")
  }
  else {
    next();
  }
})

app.use("/host", hostRouter);

app.use(authRouter);
app.use(errorController.error404);

const PORT= 3006;

mongoose.connect("mongodb+srv://root:rootA2@cluster0.lexqax8.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0").then(()=> {
   app.listen(PORT, ()=>{
  console.log(`Server created at http://localhost:${PORT}`)
})
})



