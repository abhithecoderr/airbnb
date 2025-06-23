const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');

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

const randomString = (length) => {
  let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null, 'uploads/')
  },
  filename: (req,file,cb)=>{
    cb(null, randomString(10) + '-' + file.originalname);
  }
})

const fileFilter = (req,file,cb) =>{
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true)
  }
  else {
    cb(null,false)
  }
}

const multerOptions = {
  storage, fileFilter
}

app.use((req,res,next)=>{
  console.log(req.url, req.method);
  next();
})

app.use(express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));
app.use(multer(multerOptions).single('imageUrl'));

app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: 'Mewtwo',
  resave: false,
  saveUninitialized: true,
  store: store
}));



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

const PORT= 3008;

mongoose.connect("mongodb+srv://root:rootA2@cluster0.lexqax8.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0").then(()=> {
   app.listen(PORT, ()=>{
  console.log(`Server created at http://localhost:${PORT}`)
})
})



