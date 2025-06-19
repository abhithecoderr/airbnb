const {check, validationResult} = require('express-validator');
const User = require('../models/user.js');

exports.getSignup = (req,res,next) => {
  res.render('auth/signup', 
    {
      pageTitle: 'signup',
      pageUrl: 'signup page',
      isLoggedIn: req.isLoggedIn, 
      errors: [],
      oldInput: {firstName: '', lastName: '', email: '', password: '', confirmPassword: '', userType: '', termsAccepted: '' }
  });
}

exports.postSignup = [
  
  check('firstName')
  .trim()
  .isLength({min: 2})
  .withMessage('First name must be at least 2 characters long')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('First name must contain only letters and spaces'),

  check('lastName')
  .trim()
  .isLength({min: 2})
  .withMessage('Last name must be at least 2 characters long')
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage('Last name must contain only letters and spaces'),

  check('email')
  .isEmail()
  .withMessage('Please enter a valid email address')
  .normalizeEmail(),

  check('password')
  .trim()
  .isLength({min: 8})
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[!@#$]/)
  .withMessage('Password must contain at least one special character (!@#$)'),

  check('confirmPassword')
  .trim()
  .custom((value, {req})=> {
    if(value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true;
  }),
  
  check('userType')
  .notEmpty()
  .withMessage('User type is required')
  .isIn(['guest', 'host'])
  .withMessage('Invalid user type'),

  check('termsAccepted')
  .custom((value, {req})=> {
    if(value !=='on' ) {
      throw new Error('You must accept the terms and conditions')
    }
    return true;
  }),

  (req,res,next) => {
    const {firstName, lastName, email, password, confirmPassword, userType, termsAccepted} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).render('auth/signup', {
        pageTitle: "Sign Up",
        isLoggedIn: false,
        errors: errors.array().map(err=>err.msg),
        oldInput: {firstName, lastName, email, password, confirmPassword, userType, termsAccepted }
      })
    }
    const user = new User({firstName, lastName, email, password, userType});
    
    user.save().then(()=>{
      res.redirect('/login')
    })
    .catch((err)=>{
      return res.status(400).render('auth/signup', {
        pageTitle: "Sign Up",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: {firstName, lastName, email, password, confirmPassword, userType, termsAccepted }
      })
    })
  }
]


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