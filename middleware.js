
const Product = require('./models/Product');
const{productSchema,reviewSchema}=require('./schema ');


const validateProduct=(req,res,next)=>{

    const{name, img, price, desc}=req.body;
  const{error}=productSchema.validate({name, img, price, desc});
  if(error)
  {
    return res.render('error',{err:error});
  }
  next();
};
const validateReview=(req,res,next)=>{
    
    const{rating , comment}=req.body;
  const{error}=reviewSchema.validate({rating , comment});
  if(error)
  {
    return res.render('error',{err:error});
  }
  next();
};

const isLogged=(req,res,next)=>{

  if(!req.isAuthenticated())
  {
    req.flash('error','PLEASE LOGIN FIRST')
    return res.redirect('/login')
  }
  next();

}
const isSeller=(req,res,next)=>{
  if(!req.user.role)
  {
    req.flash('error','You do not have the permission to do that');
    return res.redirect('/products');
  }
  else if(req.user.role !== 'seller')
  {
    req.flash('error','You do not have the permission to do that');
    return res.redirect('/products');
    
  }
  next();
}

const isProductAuthor=async(req,res,next)=>{
  
    let{id}=req.params;// product id
    let product=await Product.findById(id); //entire product

      // console.log(product);
      // console.log(req.user._id);
    if(!product.author)
    {
      req.flash('error','You are not a authorised User ');

      return res.redirect('/products');
      

    }
    else if(!product.author.equals(req.user._id)){

      req.flash('error','You are not a authorised User ');

      return res.redirect('/products');
    }

  next();
}

module.exports={isProductAuthor,isSeller,isLogged,validateProduct,validateReview};