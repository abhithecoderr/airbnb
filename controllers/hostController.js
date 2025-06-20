const Home = require('../models/home');
const user = require('../models/user');

exports.getAddHome = (req,res,next)=>{
  res.render('host/editHome', {pageTitle: 'add home', pageUrl: 'addHome', editing: false, isLoggedIn: req.isLoggedIn, user: req.session.user} );
}

exports.getEditHome = (req,res,next)=>{
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

   Home.findById(homeId).then((home) =>{
  
   if (!home) {
    console.log("Home not found");
    return res.redirect('/host/host-home-list')
   }
   res.render('host/editHome', {home: home, pageTitle: 'edit home', pageUrl: 'addHome', editing: editing, isLoggedIn: req.isLoggedIn, user: req.session.user});
  })  
}

exports.postAddHome = (req,res,next)=>{
  const {name, price, location, rating, imageUrl, description} = req.body;
  const home = new Home ({name, price, location, rating, imageUrl, description});
  home.save().then(()=>{
    console.log("home registered successfully");
    res.redirect('/');
  });
}

exports.postEditHome = (req,res,next) => {
  const {_id, name, price, location, rating, imageUrl, description} = req.body;

  Home.findById(_id).then(home=>{
    if(!home) {
      console.log("Home not found for editing");
      return res.redirect('/')
    }
    home.name = name;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.imageUrl = imageUrl;
    home.description = description;
    return home.save();

  }).then(()=> {
       res.redirect('/host/host-home-list');
  }).catch((err)=>{
       console.log("Error while fetching home", err);
  })
}

exports.postDeleteHome = (req,res,next)=>{

  const homeId = req.params.homeId;
  
  Home.findByIdAndDelete(homeId).then(()=>{
     res.redirect('/host/host-home-list')
     }).catch((err)=>{
     console.log("Error while deleting home", err);
  })
}

exports.hostHomeList = (req,res,next)=>{
  Home.find().then((registeredHomes)=>{
    res.render('host/host-home-list', {registeredHomes: registeredHomes, pageTitle: 'host home list', pageUrl: 'hostHome', isLoggedIn: req.isLoggedIn, user: req.session.user });
  });
}

