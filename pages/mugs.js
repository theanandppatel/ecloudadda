import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import mongoose from "mongoose";
import Product from '../models/Product';

const Mugs = ({mugs}) => {
  return (
    <div>
    {Object.keys(mugs).length==0 ? <p className='text-gray-600 text-center mt-20 mb-52'>Sorry all the Mugs are currently out of stock. New stock coming soon. Stay Tuned!</p>:
    <section className="text-gray-600 body-font">
      <div className="container px-4 py-24 mx-auto">
        <div className="flex flex-wrap md:ml-24 md:mr-5 justify-center">
          {Object.keys(mugs).map((item)=>{
            return( <Link passHref={true} key={mugs[item]._id} href={`/product/${mugs[item].slug}`}>
            <div className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-6">
              <a className="block rounded overflow-hidden">
                <img alt="tshirt" className="m-auto h-[30vh] md:h-[36vh] block" src={`${mugs[item].img}`} />
              </a>
              <div className="mt-10 text-center md:text-left">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">mugs</h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">{`${mugs[item].title}`}</h2>
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
  let products = await Product.find({category:'mugs'})

  let mugs = {}

    for (let item of products) {
        if(item.title in mugs){

            if(!mugs[item.title].color.includes(item.color) && item.availableQty>0){
                mugs[item.title].color.push(item.color)
            }
            if(!mugs[item.title].size.includes(item.size) && item.availableQty>0){
                mugs[item.title].size.push(item.size)
            }

        }else{
            mugs[item.title] = JSON.parse(JSON.stringify(item))

            if(item.availableQty>0){
                mugs[item.title].color = [item.color]
                mugs[item.title].size = [item.size]
            }
        }
        
    }

  return {
    props: { mugs: JSON.parse(JSON.stringify(mugs)) }, // will be passed to the page component as props
  }
}

export default Mugs
