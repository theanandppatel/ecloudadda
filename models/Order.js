const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    orderId: {type:String,required:true},
    razorOrderId : {type:String,required:true},
    email:{type:String,required:true},
    paymentInfo:{type:String,default:''},
    products:{type:Object,required:true},
    deliveryinfo:{type:String,required:true},
    bcharge:{type:Number,required:true},
    amount:{type:Number,required:true},
    status: {type:String,default:'Pending',required:true},
    deliveryStatus: {type:String,default:'Not Shipped Yet',required:true}
  },{timestamps:true});

  export default mongoose.models.Order || mongoose.model("Order",OrderSchema);