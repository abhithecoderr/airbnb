exports.error404 = (req,res,next)=>{
  res.status(404).render('404', {pageTitle: '404 not found', pageUrl: '404', isLoggedIn: req.isLoggedIn});
}