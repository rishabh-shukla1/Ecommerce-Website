
    require('dotenv').config();




// aquiring the server 
const express=require('express')
const app=express();
//requiring the path
const path=require('path')
// aquiring database (mongoose)
const mongoose = require('mongoose');
// requiring the seedDB
const seedDB=require("./seed")

//requiring ejs-mate, it a engine
const ejsMate=require('ejs-mate')
// requiring method-overiding
const methodOverride=require('method-override')

//requiring flash  which is use d for pop-ups
const flash=require('connect-flash');

// requiring express-session
const  session=require('express-session');

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/User')



const{isLogged }=require('./middleware');

const{STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY}=process.env;

// stripe

const stripe=require('stripe')(STRIPE_SECRET_KEY);









// routes
// requiring product routes
const productRoutes=require('./routes/product');
// requiring  review routes
const reviewRoutes=require('./routes/review');
// requiring authentication routes
const authRoutes=require('./routes/auth');
const { parseArgs } = require('util');
//  routes of  cart
const cartRoutes=require('./routes/cart');
const Product = require('./models/Product');
// ROUTES OF PAYMENT
// const paymentRoutes=require('./routes/payment');



 

mongoose.set('strictQuery','false');
mongoose.connect(process.env.MONGODB_URL)  // it returns a promice which a
.then(()=>{
    console.log("Database Connected Successfully")
})
.catch((err)=>{
    console.log("Database Error"+err);
});



// session middle ware ye express -seesion se lia h 
let configSession={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        exprire:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
    
  }


  app.get('/',(req,res)=>{

    res.render('homepage')
  })




app.engine('ejs',ejsMate),
// setting the path for the ejs files
app.set('view engine','ejs'); // set the engine
app.set('views',path.join(__dirname,'views'))// set the path of views
app.use(express.static(path.join(__dirname,'public'))) // use public folder
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(session(configSession)) // express-session taken from express-session npm written in a good way
app.use(flash())

//passport wali
app.use(passport.initialize()); // to use the  things of passport
app.use(passport.session());// this is to store it locally 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success= req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


// PASSPORT 


passport.use(new LocalStrategy(User.authenticate()));
// seeding data
// seedDB()
app.use(productRoutes); // so that incoming request ke lie path check kia ja sake
app.use(reviewRoutes);  // so that incoming request ke lie path check kia ja sake
app.use(authRoutes);
app.use(cartRoutes);  // so that incoming request ke lie path check kia ja sake
// app.use(paymentRoutes);


// payment things


app.post('/checkout/:user', async (req, res) => {
    const { user } = req.params;
    const cartItems = req.body.cart;  
    // This is the cart array sent from the form

    // console.log(cartItems)

    
        // Assuming user details are stored in the database and you have access to them
        const userDetails = await User.findById(user);  // Replace with your user model query

        // Prepare line items for Stripe
        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'inr',  // Assuming INR for the currency
                product_data: {
                    name: item.name,
                    images: [item.img],  // You can send a product image URL here
                },
                unit_amount: item.price * 100,  // Stripe expects price in cents
            },
            quantity: item.quantity,  // You can set the quantity as per your cart
        }));

        // Create a Stripe checkout session with customer details
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: userDetails.email,  // Add customer email here
            success_url: '/complete',  // Redirect to success page after successful payment
            cancel_url: '/cancel',  // Redirect to cancel page if payment is not completed
        });

        

        res.redirect(session.url)
        

        // Redirect the user to the Stripe checkout page
    
});

// buy routes

app.post('/checkout/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
  
    
      const userDetails = await User.findById(userId); // Fetch user info
      const product = await Product.findById(productId); // Fetch product info
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      // Prepare Stripe line items for the product
      const lineItems = [{
        price_data: {
          currency: 'inr',  // Assuming INR for the currency
          product_data: {
            name: product.name,
            images: [product.img],  // Product image URL
          },
          unit_amount: product.price * 100,  // Stripe expects price in cents
        },
        quantity: 1,  // Single product purchase
      }];
  
      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        customer_email: userDetails.email,  // User email from the database
        success_url: '/complete',  // Redirect to success page
        cancel_url: '/cancel',  // Redirect to cancel page
      });
  
      // Redirect to Stripe's checkout page
      res.redirect(session.url);
    
  });


 app.get('/complete',(req,res)=>{

   
    res.render('paymentsuccess');

    
 })

 app.get('/cancel',(req,res)=>{

    
    res.render('paymentfailed');

    
 })








app.listen(8080,()=>{
    console.log("Server connected on the port 8080")
})
