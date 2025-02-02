const express=require('express')
const router=express.Router()// mini instance

const{isLogged}=require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/user/cart', async (req, res) => {
    let user = await User.findById(req.user._id).populate('cart');
    
    const totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    const productInfo = user.cart.map((p) => p.desc).join(',');

    // Pass query to the cart view
    const query = req.query.q || '';  // Fetch the query parameter from the URL or default to an empty string

    res.render('cart/cart', { user, totalAmount, productInfo, query });
});



router.post('/user/:productId/add',isLogged,async(req,res)=>{
    let {productId}=req.params

    let userId=req.user._id;

    let product=await Product.findById(productId);
    let user=await  User.findById(userId);

    user.cart.push(product);
    await user.save();
    req.flash('success','Product added successfully')
    res.redirect('/user/cart');



})

router.post('/cart/:itemId/remove',async (req,res)=>{

    let {itemId}=req.params;

    let userId=req.user._id;

    let user=await  User.findById(userId);

    user.cart = user.cart.filter(item => item._id.toString() !== itemId);
    await user.save();

    req.flash('success','Item removed')
    res.redirect('/user/cart')





}
)



// to  seller can see the  products they have added 


router.get('/seller/products', isLogged, async (req, res) => {
    // Check if the user is a seller

    const query = req.query.q || '';
    if (req.user.role !== 'seller') {
        req.flash('error', 'You must be a seller to view this page.');
        return res.redirect('/'); // Redirect to home if not a seller
    }

    // Fetch all products where the author matches the current user's ID
    const products = await Product.find({ author: req.user._id });

    if (products.length === 0) {
        req.flash('error', 'No products added yet. Please add some products!');
    }

    // Render the 'seller/products' view and pass the products
    res.render('products/userView', { products, currentUser: req.user ,query});
});



module.exports=router;