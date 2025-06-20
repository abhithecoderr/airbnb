const Home = require('../models/home');
const Favourites = require('../models/favourites');

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

exports.getFavouritesList = (req,res,next)=>{

  Favourites.find().populate("homeId").then((favourites) =>{
    favHomes = favourites.map((favourite)=> favourite.homeId);
    console.log(favHomes);
    res.render('store/favourites', {favHomes: favHomes, pageTitle: 'my favourites', pageUrl: 'favourites', isLoggedIn: req.isLoggedIn,user: req.session.user });
    })
}


exports.postAddToFavourites = (req,res,next)=>{
  const homeId = req.body.homeId;
  Favourites.findOne({homeId: homeId})
  .then((existingFav)=>{
    if(existingFav) {
      console.log("Home already added to favourites");
    }
    else {
      const fav = new Favourites({homeId: homeId});
      return fav.save();
    }
  }).then(()=>{
    res.redirect("/favourites");
  })
  .catch((err)=>{
    console.log("err while adding favourites", err);
  })
}


exports.postRemoveFromFavourites = (req,res,next)=>{

  const homeId = req.params.homeId;

  Favourites.findOneAndDelete({homeId: homeId}).then(error=>{
   if (error) {
    console.log("Error deleting");
   }
   return res.redirect('/favourites')
  })
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

