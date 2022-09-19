import React from 'react'
import Order from '../models/Order'
import mongoose from "mongoose"
import {useRouter} from 'next/router'

const MyOrder = ({cart,subTotal,order}) => {
  console.log(order);
  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-14 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">ECLOUD ADDA</h2>
              <h1 className="text-gray-900 text-2xl md:text-3xl title-font font-medium mb-4">Order: #{order.orderId}</h1>
              <p className="leading-relaxed mb-4">Yayy! Your order has been successfully placed!</p>
              <p className="leading-relaxed mb-4">Order Placed On: </p>
              <p className="leading-relaxed mb-4">Your Payment Method is <span className='text-black font-bold'>COD</span> </p>
              <div className="flex py-2 font-bold">
                <span className="text-black w-1/3">Item</span>
                <span className=" text-black w-1/3 text-center">Quantity</span>
                <span className=" text-black w-1/3 text-center">Amount</span>
              </div>
              
              {/* {Object.keys(order.products).map((item)=>{
                  return <div key={item} className="flex border-t border-b border-gray-200 py-2">
                <span className="text-black  w-1/3 ">{order.products[item].name}</span>
                <span className=" text-black  w-1/3 text-center">{order.products[item].qty}</span>
                <span className=" text-black  w-1/3 text-center">₹{order.products[item].price}</span>
                </div>
                })} */}
                {Object.keys(order.products).map((item)=>{
                return <div key={item} className="flex border-t border-b border-gray-200 py-2">
                <span className="text-black  w-1/3 ">{`${order.products[item].name} ${(order.products[item].category!='stickers' && order.products[item].category!=='mugs') ? '('+order.products[item].size+'/'+order.products[item].variant+')':'' }`}</span>
                <span className=" text-black  w-1/3 text-center">{order.products[item].qty}</span>
                <span className=" text-black   text-center w-16 md:w-1/3 ml-7 md:ml-0">₹{order.products[item].price} × {order.products[item].qty} = ₹{order.products[item].price*order.products[item].qty}</span>
                </div>
              })}
              
              
              <div className="mt-10">
              <div className="title-font font-medium text-xl text-gray-900">Delivery Charge:
              {order.bcharge < 1000 && order.bcharge != 0 ? " ₹40" : " FREE"}</div>
              
                <div className="title-font mt-10 font-medium text-2xl text-gray-900">Subtotal: ₹{order.amount}</div>
                <p className='mt-5'>Tracking link will be sent via Email once your order is shipped! If you still have any issues, feel free to call our customer support number</p>
              </div>
            </div>
            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-[70vh] h-64 object-cover object-center rounded" src="https://www.codeswear.com/order.jpg"/>
          </div>
        </div>
      </section>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let order = await Order.findOne({ orderId: context.query.id })
  

  return {
    props: { order: JSON.parse(JSON.stringify(order)) }, // will be passed to the page component as props
  }
}

export default MyOrder
