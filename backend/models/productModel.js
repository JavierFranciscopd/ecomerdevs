const mongoose = require("mongoose");
const { stdin } = require("process");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "por favor ingrese el nombre del producto"],
        trim:true
    },
    description:{
        type:String,
        required:[true, "por favor ingrese la descripción del producto"]
    },
    price:{
        type:Number,
        require:[true, "por favor ingrese el precio del producto"],
        maxLength:[8, "el precio no puede exceder los 8 caracteres"]
    },
    rating:{
        type: Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Por favor ingrese la categoría del producto"]
    },
    stock:{
        type:Number,
        required:[true,"Ingrese el stock del producto"],
        maxLength:[4, "El stock no puede exceder los 4 caracteres"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },
    createAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("Product",productSchema)