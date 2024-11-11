
const mongoose=require('mongoose');
const Review = require('./Review');


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,

    },
    img:{
        type:String,
        trim:true,
        

        // default
    },
    avgRating:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        // min:0,
        required:true,
    },
    desc:{
        type:String,
        trim:true,
    },

    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],


    author:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    }

})

//middleware jo behind the scene mongodb operations karwane par use hota h iske andar pre and post post middleware hote hai basicaly used over the schema and before the model in js class

productSchema.post('findOneAndDelete', async function(product){

    if(product.reviews.legth>0)
    {
        await Review.deleteMany({_id:{$in:product.reviews}})
    }
})

let Product=mongoose.model('Product',productSchema);

module.exports=Product;

