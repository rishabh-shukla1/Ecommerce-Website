// database me data dalna h to  use aquire karna padega
const mongoose=require('mongoose')

// product me data dalna h  to use acquire karna padega 

const Product=require('./models/Product')

const products=[{
        name:"Iphone 14pro",
        img:"https://images.unsplash.com/photo-1680776785024-5223d7a75ea8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8SVBIT05FJTIwMTR8ZW58MHx8MHx8fDA%3D",
        price:130000,
        desc:"Very Costly, aukat ke bahar h ",

    },
    {
        name:"Macbook m2 pro",
        img:"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFjYm9va3xlbnwwfHwwfHx8MA%3D%3D",
        price:230000,
        desc:"Very Costly, Bilkul aukar ke bahar h",
    },
    {
        name:"Iwatch",
        img:"https://images.unsplash.com/photo-1517420879524-86d64ac2f339?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SXdhdGNofGVufDB8fDB8fHww",
        price:51000,
        desc:"ye le lo sasta h",
    },
    {
        name:"Ipad pro",
        img:"https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SXBhZCUyMHByb3xlbnwwfHwwfHx8MA%3D%3D",
        price:232930,
        desc:"Life me kuch cheeze dekhne ke lie hoti h"
    },
    {
        name:"Airpods",
        img:"https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlycG9kc3xlbnwwfHwwfHx8MA%3D%3D",
        price:10000,
        desc:"badia h kamao kamao",
    },


];




async function seedDB(){
    await Product.insertMany(products);
    console.log("seeded successfully");
}

module.exports=seedDB; 