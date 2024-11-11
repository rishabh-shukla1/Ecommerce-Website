const express=require('express')
const router=express.Router()// mini instance

const{isLogged}=require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/user/cart',async(req,res)=>{
         let user=await User.findById(req.user._id).populate('cart');
         const totalAmount=user.cart.reduce((sum,curr)=>sum+curr.price,0);
         const productInfo=user.cart.map((p)=>p.desc).join(',');

         res.render('cart/cart',{user,totalAmount,productInfo});

})


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



module.exports=router;