const express=require('express');
const User = require('../models/User');
const passport = require('passport');

const router=express.Router()// mini instance

//to show the form  of sign in 
router.get('/register',(req,res)=>{

    res.render('auth/signup');

})
 
// to actually get registered
router.post('/register',async(req,res)=>{

   try{  
    const{username,email,password,role}=req.body;
    const user=new User({username,email,role})
    let newuser=await User.register(user,password); // when ever you work with database ypu wait for it
    // req.flash('success','Registered Successfully')
    // res.redirect('/login');  after registering we should gove him direct login other than
    req.login(newuser,function(err){
        if(err){return next(err)}
        req.flash('success','Welcome , you are now a registered user')
        return res.redirect('/products');

    })} 
    catch(err){
        req.flash('error','err.message');
        
        return res.redirect('/signup')
    }
  


})


// to show the login form 

router.get('/login',(req,res)=>{ 

    res.render('auth/login');

})
// to actually login by the database

router.post('/login', 
    passport.authenticate('local',
         { 
            failureRedirect: '/login' ,
            failureMessage: true 
         }),
         (req,res)=>{

            // console.log(req.user);

            req.flash('success','WELCOME BACK');
            res.redirect('/products')

})


// logout

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {  // Destroy session
      if (err) {
        return res.redirect('/products');  // If there's an error, redirect to products page
      }
      res.clearCookie('connect.sid');  // Clear the session cookie (if using session cookie)
      res.redirect('/');  // Redirect to the landing page
    });
  });
  




 
module.exports=router;

