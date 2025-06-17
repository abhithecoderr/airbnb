exports.getSignup = (req,res,next) => {
  res.render('auth/signup', {pageTitle: 'signup', pageUrl: 'signup page', isLoggedIn: req.isLoggedIn});
}

exports.postSignup = (req,res,next) => {
  res.redirect('/');
}

exports.getLogin = (req,res,next) => {
  res.render('auth/login', {pageTitle: 'login', pageUrl: 'login page', isLoggedIn: req.isLoggedIn});
}

exports.postLogin = (req,res,next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
}

exports.postLogout = (req,res,next) => {
  req.session.destroy(()=>{
    res.redirect("/login");
  })
}