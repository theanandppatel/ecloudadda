import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import mongoose from "mongoose";
import Product from '../models/Product';

const Hoodies = ({hoodies}) => {
  return (
    <div>
    {Object.keys(hoodies).length==0 ? <p className='text-gray-600 text-center mt-20 mb-52'>Sorry all the Hoodies are currently out of stock. New stock coming soon. Stay Tuned!</p>:
    <section className="text-gray-600 body-font">
      <div className="container px-4 py-24 mx-auto">
        <div className="flex flex-wrap md:ml-24 md:mr-5 justify-center">
          {Object.keys(hoodies).map((item)=>{
            return( <Link passHref={true} key={hoodies[item]._id} href={`/product/${hoodies[item].slug}`}>
            <div className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-6">
              <a className="block rounded overflow-hidden">
                <img alt="tshirt" className="m-auto h-[30vh] md:h-[36vh] block" src={`${hoodies[item].img}`} />
              </a>
              <div className="mt-4 text-center md:text-left">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Hoodies</h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">{`${hoodies[item].title}`}</h2>
                <div className="flex w-full justify-between">
                <div className=" mt-1 flex">
                {hoodies[item].color.includes('white') && <div className='border-2 border-gray-800 bg-white-500 rounded-full w-4 h-4 focus:outline-none'></div>}
                {hoodies[item].color.includes('black') && <div className='border-2 border-gray-800 bg-black rounded-full w-4 h-4 focus:outline-none'></div>}
                {hoodies[item].color.includes('blue') && <div className='border-2 border-gray-800 bg-blue-500 rounded-full w-4 h-4 focus:outline-none'></div>}
                {hoodies[item].color.includes('green') && <div className='border-2  border-gray-800 bg-green-500 rounded-full w-4 h-4 focus:outline-none'></div>}
                {hoodies[item].color.includes('red') && <div className='border-2  border-gray-800 bg-red-500 rounded-full w-4 h-4 focus:outline-none'></div>}
                {hoodies[item].color.includes('purple') && <div className='border-2  border-gray-800 bg-purple-500 rounded-full w-4 h-4 focus:outline-none'></div>}
                {hoodies[item].color.includes('yellow') && <div className='border-2  border-gray-800 bg-yellow-500 rounded-full w-4 h-4 focus:outline-none'></div>}
                </div>
                <p className="mt-1 text-xl text-black font-bold">{`₹${hoodies[item].price}`}</p>

                </div>
                <div className="mt-1">
                  {hoodies[item].size.includes('S') && <span className='border border-gray-600 mx-1 px-2'>S</span>}
                  {hoodies[item].size.includes('M') && <span className='border border-gray-600 mx-1 px-2'>M</span>}
                  {hoodies[item].size.includes('L') && <span className='border border-gray-600 mx-1 px-2'>L</span>}
                  {hoodies[item].size.includes('XL') && <span className='border border-gray-600 mx-1 px-2'>XL</span>}
                  {hoodies[item].size.includes('XXL') && <span className='border border-gray-600 mx-1 px-2'>XXL</span>}
                </div>
              </div>
            </div>
          </Link>
          )
          })}
        </div>
      </div>
    </section>}
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }
  let products = await Product.find({category:'hoodies'})

  let hoodies = {}

    for (let item of products) {
        if(item.title in hoodies){

            if(!hoodies[item.title].color.includes(item.color) && item.availableQty>0){
                hoodies[item.title].color.push(item.color)
            }
            if(!hoodies[item.title].size.includes(item.size) && item.availableQty>0){
                hoodies[item.title].size.push(item.size)
            }

        }else{
            hoodies[item.title] = JSON.parse(JSON.stringify(item))

            if(item.availableQty>0){
                hoodies[item.title].color = [item.color]
                hoodies[item.title].size = [item.size]
            }
        }
        
    }

  return {
    props: { hoodies: JSON.parse(JSON.stringify(hoodies)) }, // will be passed to the page component as props
  }
}

export default Hoodies
