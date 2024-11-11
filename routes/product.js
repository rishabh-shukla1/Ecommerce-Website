const express=require('express')
const Product = require('../models/Product')
 const Review=require('../models/Review')

 const{validateProduct,isLogged, isSeller ,isProductAuthor}=require('../middleware');
 
const router=express.Router()// mini instance

// where all the products are their move to that page
router.get('/products',async(req,res)=>{

    try{ let products=await Product.find({});
    res.render('products/index',{products});
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }

   


})

// to show the form of new product
router.get('/product/new',isLogged,(req,res)=>{
    try{res.render('products/new');

    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})

//to  add new product
router.post('/products', validateProduct , isLogged, isSeller ,async(req,res)=>{


    try{  const{name,img,price,desc}=req.body

    await Product.create({name,img,price,desc,author:req.user._id});
    req.flash('success','product added successfully')

    res.redirect('/products')
}
  



    catch(e){
        res.status(500).render('error',{err:e.message});
    }

    


})

// to show a particular product
router.get('/products/:id',isLogged,async(req,res)=>{
    try{
         let{id}=req.params;

    let foundELement=await Product.findById(id).populate('reviews'); // name of the array populated with that only

    res.render('products/show',{foundELement,msg:req.flash('success'),user:req.user})
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})
//  to show the edit form 
router.get('/products/:id/edit',isLogged,isProductAuthor,async(req,res)=>{

    try{  
        let{id}=req.params;

    let foundELement=await Product.findById(id);

    res.render('products/edit',{foundELement})
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }

})

// form to edit the product
router.patch('/products/:id',validateProduct,isLogged,isProductAuthor,async(req,res)=>{  // this validate product will act as a middleware

    try{
        let {id}=req.params;
    let {name, img, price,desc}=req.body;
    await Product.findByIdAndUpdate(id,{name, img, price,desc})
    req.flash('success','product edited successfully')
    res.redirect(`/products/${id}`);
      }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})
// to delete a product route
router.delete('/product/:id',isLogged, isProductAuthor,async(req,res)=>{

    try{
        let{id}=req.params;
     let product=await Product.findById(id);

    //  for(let id of product.reviews)
    //  {
    //     await Review.findByIdAndDelete(id);
    //  }
    await Product.findByIdAndDelete(id);
    req.flash('success','product deleted successfully')
    res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});
    }
})




module.exports=router;

