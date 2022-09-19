import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillCloseCircle, AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { IoBagCheck } from 'react-icons/io5'
import { BsFillBagXFill } from 'react-icons/bs'
import { RiLoginBoxFill } from 'react-icons/ri'
import { MdAccountCircle } from 'react-icons/md'
import { useRouter } from 'next/router'
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Router from 'next/router'

const Navbar = ({ logout, user, cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const router = useRouter()
  const [dropdown, setDropdown] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    Object.keys(cart).length != 0 && setSidebar(true)

    let exempted = ['/checkout','/order','/orders']
    if(exempted.includes(router.pathname)){
      setSidebar(false)
    }

    if(localStorage.getItem("myuser")){
      setToken(JSON.parse(localStorage.getItem("myuser")).token)
    }
  }, [])

  const toggleCart = () => {
    setSidebar(!sidebar)
    // if (ref.current.classList.contains('translate-x-0')) {
    //   ref.current.classList.remove('translate-x-0')
    //   ref.current.classList.add('translate-x-full')
    // }
    // else if (!ref.current.classList.contains('translate-x-0')) {
    //   ref.current.classList.remove('translate-x-full')
    //   ref.current.classList.add('translate-x-0')
    // }
  }

  const handleLogout = () => {
    setDropdown(!dropdown)
    logout()
  }

  return (
    <>

      {!sidebar && dropdown && <div className='fixed right-8 md:right-10 mt-4 mr-5 bg-green-300 shadow-lg border top-6 py-4 rounded-md px-5 w-32 z-20'>
        <ul>
          <Link href={'/myaccount?usertoken=' + token}><a><li className='py-1 hover:text-green-700 text-sm font-bold'>My account</li></a></Link>
          <Link href={'/orders'}><a><li className='py-1 hover:text-green-700 text-sm font-bold'>Orders</li></a></Link>
          <li onClick={handleLogout} className='cursor-pointer py-1 hover:text-green-700 text-sm font-bold'>Logout</li>
        </ul>
      </div>}


      <div className={`sticky top-0 z-10 shadow-md bg-white ${!sidebar && 'overflow-hidden'}`}>
        <div className="flex flex-col md:flex-row md:justify-start justify-center items-center py-2">
          <div className="logo mr-44 md:mx-5">
            <Link href={'/'}><a><Image height={60} width={200} src="/images/navbar-logo.png" alt="E-cloud logo" /></a></Link>
          </div>
          <div className="nav">
            <ul className='flex space-x-4 font-bold md:text-base'>
              <Link href={'/tshirts'}><a><li className='hover:text-green-600'>Tshirts</li></a></Link>
              <Link href={'/hoodies'}><a><li className='hover:text-green-600'>Hoodies</li></a></Link>
              <Link href={'/stickers'}><a><li className='hover:text-green-600'>Stickers</li></a></Link>
              <Link href={'/mugs'}><a><li className='hover:text-green-600'>Mugs</li></a></Link>
            </ul>
          </div>

          <div className="cursor-pointer items-center cart absolute right-0 top-6 mx-5 flex ">
            {!user.value && <button onClick={() => { router.push('/login') }} className='bg-green-600 px-2 py-2 rounded-md text-sm font-medium flex text-white mx-3 hover:bg-green-700'>Login <span className='text-black text-xl ml-2'><RiLoginBoxFill /></span></button>}
            <span onClick={() => { setDropdown(!dropdown) }} className='top-4'>
              {user.value && <MdAccountCircle className='text-xl md:text-2xl mx-2' />}
            </span>

            <AiOutlineShoppingCart onClick={toggleCart} className='text-xl md:text-2xl' />
            {Object.keys(cart).length > 0 && <span className="absolute top-1 md:top-1 right-1 inline-block w-3 h-3 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>}
          </div>

          <div className={`w-80 h-[100vh] sidecart overflow-y-auto absolute top-0 transition-all bg-green-200 py-10 pl-6 ${sidebar ? 'right-0' : '-right-96'} `}>
            <h2 className='font-bold text-xl text-center'>Shopping cart</h2>
            <span onClick={toggleCart} className="absolute top-5  right-2 cursor-pointer text-2xl text-green-800"><AiFillCloseCircle /></span>
            <div className="item-list pl-3 pr-1">
              <ol className='list-decimal font-semibold'>
                {Object.keys(cart).length == 0 && <div className='cart-empty mt-7 font-medium'>Your cart is empty!
                </div>}
                {Object.keys(cart).map((k) => {
                  return <li key={k}>
                    <div className="item flex my-5">
                      <div className='w-2/3 font-semibold'>{`${cart[k].name} ${(cart[k].category != 'stickers' && cart[k].category !== 'mugs') ? '(' + cart[k].size + '/' + cart[k].variant + ')' : ''}`}</div>
                      <div className='flex items-center justify-center w-1/3 '><AiFillMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer mx-2 text-green-800 text-lg' />{cart[k].qty}<AiFillPlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer mx-2 text-green-800 text-lg' /></div>
                    </div>
                  </li>
                })}
              </ol>
            </div>


            <div className="cart-subtotal font-bold mt-16 ml-3">
              Subtotal: ₹{subTotal}
            </div>
            <div className="cart-button flex">

              <Link href={'/checkout'}><button disabled={Object.keys(cart).length == 0} className="disabled:bg-green-300 flex my-3 mx-2 text-white bg-green-500 border-0 py-1 px-2 focus:outline-none hover:bg-green-600 rounded text-lg"><IoBagCheck className='text-xl mt-1 mr-1' />Checkout</button></Link>
              <button disabled={Object.keys(cart).length == 0} onClick={() => { clearCart() }} className="disabled:bg-green-300 flex my-3 mx-2 text-white bg-green-500 border-0 py-1 px-2 focus:outline-none hover:bg-green-600 rounded text-lg"><BsFillBagXFill className='text-lg mt-1 mr-1' />Clear Cart</button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Navbar
