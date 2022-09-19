import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import Order from '../models/Order'
// import mongoose from "mongoose"
import Link from 'next/link'

const Orders = () => {
    const router = useRouter()
    const [orders, setOrders] = useState([])


    useEffect(() => {
        const fetchOrders = async () => {
            const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({ token: JSON.parse(localStorage.getItem('myuser')).token })
            })
            let res = await data.json()
            setOrders(res.userOrders)

        }

        if (!localStorage.getItem('myuser')) {
            router.push('/')
        }
        else {
            fetchOrders()
        }

    }, [])


    return (
        <div>
            <div className="container mx-auto mb-28">
                <h1 className='text-2xl font-bold text-center my-10'>My Orders</h1>
                {
                    orders.length == 0 ? <div className='text-gray-500 text-lg text-center pb-44 pt-8'>You have not placed any order yet</div> :
                        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 pl-3 md:pl-28">
                                            #Order Id
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Product name
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Amount
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Payment Status
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((item) => {
                                        return item.status !== 'Pending' && <tr key={item._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white pl-3 md:pl-28">
                                                {item.orderId}
                                            </th>
                                            <td scope="row" className="py-4 px-6 whitespace-nowrap">{
                                                Object.keys(item.products).length == 1 ? Object.keys(item.products).map((k) => {
                                                    return <span key={k}>{`${item.products[k].name} ${(item.products[k].category != 'stickers' && item.products[k].category != 'mugs') ? '(' + item.products[k].size + '/' + item.products[k].variant + ')' : ''}`}</span>
                                                }) : Object.keys(item.products).map((k) => {
                                                    
                                                    return <ol key={k}><li>
                                                        {`${item.products[k].name} ${(item.products[k].category != 'stickers' && item.products[k].category != 'mugs') ? '(' + item.products[k].size + '/' + item.products[k].variant + ')' : ''}`}
                                                    </li></ol>
                                                })
                                            }
                                            </td>
                                            <td className="py-4 px-6">
                                                ₹{item.amount}
                                            </td>
                                            <td className="py-4 px-6">
                                                {item.status}
                                            </td>
                                            <td className="py-4 px-6 ">
                                                <Link href={'/order?id='+item.orderId}><a className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Details</a></Link>
                                            </td>
                                        </tr>
                                    })}

                                </tbody>
                            </table>
                        </div>
                }
            </div>
        </div>
    )
}
// export async function getServerSideProps(context) {
//     if (!mongoose.connections[0].readyState) {
//         await mongoose.connect(process.env.MONGO_URI)
//     }
//     let order = await Order.findOne({ orderId: context.query.id })
//     console.log(context.query.id)


//     return {
//         props: { order: JSON.parse(JSON.stringify(order)) }, // will be passed to the page component as props
//     }
// }

export default Orders