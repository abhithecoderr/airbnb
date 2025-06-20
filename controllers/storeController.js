const Home = require('../models/home');
const User = require('../models/user');


exports.index = (req,res,next)=>{
  Home.find().then((registeredHomes)=>{
    res.render('store/index.ejs', {registeredHomes: registeredHomes, pageTitle: 'index', pageUrl: 'index', isLoggedIn: req.isLoggedIn, user: req.session.user });
  });
}

exports.getHomes = (req,res,next)=>{
   Home.find().then((registeredHomes)=>{
    res.render('store/home-list', {registeredHomes: registeredHomes, pageTitle: 'home list', pageUrl: 'home', isLoggedIn: req.isLoggedIn, user: req.session.user });
  });
}

exports.bookings = (req,res,next)=>{
  res.render('store/bookings', {pageTitle: 'my bookings', pageUrl: 'bookings', isLoggedIn: req.isLoggedIn, user: req.session.user });
}

exports.getFavouritesList = async (req,res,next)=>{
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render('store/favourites', {favHomes: user.favourites, pageTitle: 'my favourites',  pageUrl: 'favourites',  isLoggedIn: req.isLoggedIn, user: req.session.user });
}


exports.postAddToFavourites = async (req,res,next)=>{
  const homeId = req.body.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if(!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
   res.redirect("/favourites");
}

exports.postRemoveFromFavourites = async (req,res,next)=>{

  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);

  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect('/favourites');
}

exports.getHomeDetails = (req,res,next)=>{

    const homeId = req.params.homeId;
  
    Home.findById(homeId).then((home) =>{
      if(!home) {
        res.redirect('/homes');
      }
      else {
      res.render('store/home-detail', {home: home, pageTitle: 'home list', pageUrl: 'home', isLoggedIn: req.isLoggedIn, user: req.session.user });
    }
  })
};

