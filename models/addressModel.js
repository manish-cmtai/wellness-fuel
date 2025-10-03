import { Schema } from "mongoose";

const addressSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:[{
        
        state:{type:String,required:true},
        city:{type:String,required:true},
        pinCode:{type:String,required:true},
    }]
})

const Address = model('Address', addressSchema);

export default Address;
