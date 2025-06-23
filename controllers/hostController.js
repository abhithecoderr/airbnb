const Home = require('../models/home');
const user = require('../models/user');
const fs = require('fs');

exports.getAddHome = (req,res,next)=>{
  res.render('host/editHome', {pageTitle: 'add home', pageUrl: 'addHome', editing: false, isLoggedIn: req.isLoggedIn, user: req.session.user} );
}

exports.getEditHome = async (req,res,next)=>{
  const homeId = req.params.homeId;
  const hostId = req.session.user._id;
  const editing = req.query.editing === 'true';

  const home = await Home.findOne({_id: homeId, hostId: hostId})

   if (!home) {
    console.log("Home not found");
    return res.redirect('/host/host-home-list')
   }
   res.render('host/editHome', {home: home, pageTitle: 'edit home', pageUrl: 'addHome', editing: editing, isLoggedIn: req.isLoggedIn, user: req.session.user});
}

exports.postAddHome = (req,res,next)=>{
  const {name, price, location, rating, description} = req.body;
  console.log(req.file);
  const hostId = req.session.user._id;
 
  const imageUrl = req.file.path;
  const home = new Home ({name, price, location, rating, imageUrl, description, hostId});

  if(!req.file) {
    return res.status(400).send('No image provided');
  }

  home.save().then(()=>{
    console.log("home registered successfully");
    res.redirect('/');
  });
}

exports.postEditHome = async (req,res,next) => {
  const {_id, name, price, location, rating, description} = req.body;
  const hostId = req.session.user._id;
  const home = await Home.findOne({_id: _id, hostId: hostId})

    if(!home) {
      console.log("Home not found for editing");
      return res.redirect('/')
    }
    home.name = name;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    if(req.file) {
    fs.unlink(home.imageUrl, (err)=>{
      if(err) {
        console.log("Error while deleting file", err)
      }
    })
    home.imageUrl = req.file.path;
    }

    await home.save();

    res.redirect('/host/host-home-list');
}

exports.postDeleteHome = (req,res,next)=>{

  const homeId = req.params.homeId;
  const hostId = req.session.user._id;
  Home.findOneAndDelete({hostId: hostId}).then(()=>{
     res.redirect('/host/host-home-list')
     }).catch((err)=>{
     console.log("Error while deleting home", err);
  })
}

exports.hostHomeList = async (req,res,next)=>{
  const hostId = req.session.user._id;
  const registeredHomes = await Home.find({hostId: hostId});
    res.render('host/host-home-list', {registeredHomes: registeredHomes, pageTitle: 'host home list', pageUrl: 'hostHome', isLoggedIn: req.isLoggedIn, user: req.session.user });
}

