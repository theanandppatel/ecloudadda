import React, { useState, useEffect } from 'react'
import { AiFillCloseCircle, AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
const orderid = require('order-id')('key');




const Checkout = ({ useremail, user, cart, addToCart, removeFromCart, totalQty, subTotal, fAmt, clearCart }) => {
    const router = useRouter()
    const [paymentmethod, setPaymentmethod] = useState(null)
    const [onlineCheck, setOnlineCheck] = useState(false)
    const [codCheck, setCodCheck] = useState(false)
    const [fname, setFName] = useState('')
    const [lname, setLName] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
      if(useremail!=''){
        setEmail(useremail)
      }
    }, [])
    
    useEffect(() => {
        if (fname.length > 3 && lname.length > 3 && address1.length > 3 && zipcode.length > 3 && phone.length > 3 && (useremail.length > 3 || email.length > 3)) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [fname, lname, address1, address2, zipcode, email, phone])


    const handleChange = async (e) => {


        if (e.target.name == 'fname') {
            setFName(e.target.value)
        }
        else if (e.target.name == 'lname') {
            setLName(e.target.value)
        }
        else if (e.target.name == 'address1') {
            setAddress1(e.target.value)
        }
        else if (e.target.name == 'address2') {
            setAddress2(e.target.value)
        }
        else if (e.target.name == 'zipcode') {
            setZipcode(e.target.value)
            if (e.target.value.length == 6) {
                // let pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
                // let fpin = await pins.json();
                // if (Object.keys(fpin).includes(e.target.value)) {
                //     setState(fpin[e.target.value][1])
                //     setCity(fpin[e.target.value][0])
                // } else {
                //     setState('')
                //     setCity('')
                // }

                let fetchpin =  {pincode:(e.target.value)}
    
                const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fetchpin)
                })
                let res= await data.json()
                if(res.senddetail[0].Status=='Success'){
                    setCity(res.senddetail[0].PostOffice[0].Block)
                    setState(res.senddetail[0].PostOffice[0].State)
                    setCountry(res.senddetail[0].PostOffice[0].Country)
                }
            } else {
                
                setState('')
                setCity('')
                setCountry('')
            }
        }
        else if (e.target.name == 'city') {
            setCity(e.target.value)
        }
        else if (e.target.name == 'state') {
            setState(e.target.value)
        }
        else if (e.target.name == 'country') {
            setCountry(e.target.value)
        }
        else if (e.target.name == 'phone') {
            setPhone(e.target.value)
        }
        else if (e.target.name == 'email') {
            setEmail(e.target.value)
        }

    }

    const handleProceedPay = async () => {
        const getpindetail = await fetch(`https://api.postalpincode.in/pincode/${zipcode}`)
        const senddetail = await getpindetail.json()

        if(email.length==0){
            email=useremail
        }
        if (Object.keys(cart).length == 0) {
            toast.error('There is no item found in your cart', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else if (zipcode.length !== 6) {
            toast.error('Please enter a valid zipcode', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        
        else if (phone.length !== 10) {
            toast.error('Please enter a valid phone number', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        else if(senddetail[0].Status!='Success'){
            toast.error('Sorry! We cant\'t deliver your items to this pincode', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
         else {
            let fullname = fname+ ' ' +lname
            let delinfo = fname+ ' ' +lname+ '\n' +address1+ ', ' +address2+ '\n' +city+ ', ' +state+ '\n' +country+ ' - ' +zipcode

            if (paymentmethod) {
                makePayment(fullname,delinfo)
            }
            else if (paymentmethod == false) {
                makeCOD(delinfo)
            } else {
                toast.error('Please select payment method', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }
    const makeCOD = (deliveryinfo ) => {
        console.log("COD");
    }

    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    const makePayment = async (ofullname,deliveryinfo) => {

        let orderId = ("" + (Math.random() + 1)).substring(2, 13)

        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            return;
        }



        // Make API call to the serverless API
        let data2 = { cart, fAmt, deliveryinfo, email, subTotal, orderId }
        const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/razorpay`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(data2)
        }).then((t) =>
            t.json()
        );

        if (data.success == false) {
            clearCart()
            toast.error(data.error, {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {

            var options = {
                key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
                name: "Ecloud Adda",
                currency: data.currency,
                amount: data.amount,
                order_id: data.id,
                description: "Thankyou for your Shopping",
                image: "/images/circle-logo.png",
                handler: async function (response) {

                    //Update status into orders table after checking transaction status
                    const razorData = {
                        OrderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        razorpaySign: response.razorpay_signature,
                        paymentStatus: response.razorpay_status
                    }
                    // Validate payment at server - using webhooks is a better idea.
                    const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'

                        },
                        body: JSON.stringify(razorData)
                    })

                    if (result.status == 200) {
                        router.push('/order?id=' + orderId)
                        clearCart()
                    }
                    else {
                        toast.error('Internal Server Error Occured', {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                },
                prefill: {
                    name: ofullname,
                    email: email,
                    contact: phone,
                },
            };



            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        }
    };

    return (
        <div>
            <ToastContainer
                position="bottom-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="overflow-y-hidden">
                <div className="flex justify-center 2xl:container 2xl:mx-auto lg:py-16 md:py-12 py-9 px-4 md:px-6 lg:px-20 xl:px-44 ">
                    <div className="flex w-full sm:w-9/12 lg:w-full flex-col lg:flex-row justify-center lg:space-x-10 2xl:space-x-36 space-y-12 lg:space-y-0">
                        <div className="flex w-full  flex-col justify-start items-start">
                            <div>
                                <p className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Check out</p>
                            </div>

                            <div className="mt-12">
                                <p className="text-xl font-semibold leading-5 text-gray-800">Shipping Details</p>
                            </div>
                            <div className="mt-8 flex flex-col justify-start items-start w-full space-y-8 ">
                                <input onChange={handleChange} name='fname' value={fname} className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="text" placeholder="First Name" />
                                <input onChange={handleChange} name='lname' value={lname} className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="text" placeholder="Last Name" />
                                <input onChange={handleChange} name='address1' value={address1} className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="text" placeholder="Address" />
                                <input onChange={handleChange} name='address2' value={address2} className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="text" placeholder="Address (line 02)" />
                                <div className="flex justify-between flex-col sm:flex-row w-full items-start space-y-8 sm:space-y-0 sm:space-x-8">
                                    <input onChange={handleChange} name='zipcode' value={zipcode} className="no-spinner px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="number" placeholder="Zip Code" />
                                    <div className="relative w-full">
                                        <input onChange={handleChange} name='city' value={city} className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="text" placeholder="City" />
                                    </div>
                                </div>
                                <div className="flex justify-between flex-col sm:flex-row w-full items-start space-y-8 sm:space-y-0 sm:space-x-8">
                                    <input onChange={handleChange} name='state' value={state} className="px-2 focus:outline-none focus:ring-2 focus:ring-gray-500 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4 w-full" type="text" placeholder="State" />

                                    <div className="w-full">
                                        <input onChange={handleChange} name='country' value={country} className="focus:outline-none focus:ring-2 focus:ring-gray-500 px-2 border-b border-gray-200 leading-4 text-base placeholder-gray-600 pt-4 pb-3   w-full" type="text" placeholder="Country" />
                                    </div>
                                </div>
                                {user.value ? <input onChange={handleChange} name='email' value={useremail} className="focus:outline-none focus:ring-2 focus:ring-gray-500 px-2 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4   w-full" type="text" placeholder="Email" readOnly /> : <input onChange={handleChange} name='email' value={email} className="focus:outline-none focus:ring-2 focus:ring-gray-500 px-2 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4   w-full" type="text" placeholder="Email" />}
                                <input onChange={handleChange} name='phone' value={phone} className="focus:outline-none focus:ring-2 focus:ring-gray-500 px-2 border-b border-gray-200 leading-4 text-base placeholder-gray-600 py-4   w-full" type="number" placeholder="Phone Number" />
                            </div>
                            <button disabled={disabled} onClick={handleProceedPay} className="disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-8 text-base font-medium focus:ring-ocus:ring-gray-800 leading-4 hover:bg-black py-4 w-full md:w-4/12 lg:w-full text-white bg-gray-800">Proceed to payment</button>

                            <div className="review-cart mt-14 w-full">
                                <p className="text-xl font-bold leading-5 text-gray-800">Review Cart</p>

                                {Object.keys(cart).length > 0 ? <div className="summary item-list mt-4 py-4 pl-4 pr-1 bg-green-200">
                                    <ol className='list-decimal text-xl ml-4 font-semibold'>
                                        {Object.keys(cart).length == 0 && <div className='cart-empty mt-1 font-medium'>Your cart is empty!
                                        </div>}
                                        {Object.keys(cart).map((k) => {
                                            return <li key={k}>
                                                <div className="item flex my-2">
                                                    <div className='w-2/3 font-semibold text-lg'>{`${cart[k].name} ${(cart[k].category != 'stickers' && cart[k].category !== 'mugs') ? '(' + cart[k].size + '/' + cart[k].variant + ')' : ''}`}</div>
                                                    <div className='flex items-center justify-center w-1/3 '><AiOutlineMinusCircle onClick={() => { removeFromCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer mx-2 text-green-800 text-3xl' /><span className='mr-5 ml-5'>{cart[k].qty}</span><AiOutlinePlusCircle onClick={() => { addToCart(k, 1, cart[k].price, cart[k].name, cart[k].size, cart[k].variant) }} className='cursor-pointer mx-2 text-green-800 text-3xl' /></div>
                                                </div>
                                            </li>
                                        })}
                                    </ol>
                                    <div className="cart-inner-subtotal font-bold mt-8 ml-3">
                                        Subtotal: ₹{subTotal}
                                    </div>
                                </div> : <p className='mt-4'>Your cart is empty</p>}
                            </div>
                        </div>
                        <div className="col-2 w-full">
                            <div className="payment-method">
                                <p className="text-xl font-semibold leading-5 text-gray-800 mt-20 pt-2">Payment Method</p>
                                <div className="mt-5 py-8">
                                    <div className="form-check mx-3" onClick={(e) => { setPaymentmethod(true); setOnlineCheck(true); setCodCheck(false) }}>
                                        <input onChange={(e) => { }} className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="onlinepay" id="flexRadioDefault1" checked={onlineCheck} />
                                        <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault1">
                                            Online Payment
                                        </label>
                                    </div>
                                    <div className="form-check mx-3 py-2" onChange={(e) => { setPaymentmethod(false); setOnlineCheck(false); setCodCheck(true) }}>
                                        <input onChange={(e) => { }} className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="cod" id="flexRadioDefault2" checked={codCheck} />
                                        <label className="form-check-label inline-block text-gray-800" htmlFor="flexRadioDefault2">
                                            Cash On Delivery
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className=" bg-gray-50 w-full p-6 md:p-14 h-[45vh] md:h-[60vh] mt-30">
                                <div>
                                    <h1 className="text-2xl font-semibold leading-6 text-gray-800">Order Summary</h1>
                                </div>
                                <div className="flex mt-7 flex-col items-end w-full space-y-6">
                                    <div className="flex justify-between w-full items-center">
                                        <p className="text-lg leading-4 text-gray-600">Total items</p>
                                        <p className="text-lg font-semibold leading-4 text-gray-600">{totalQty}</p>
                                    </div>
                                    <div className="flex justify-between w-full items-center">
                                        <p className="text-lg leading-4 text-gray-600">Total Charges</p>
                                        <p className="text-lg font-semibold leading-4 text-gray-600">₹{subTotal}</p>
                                    </div>
                                    <div className="flex justify-between w-full items-center">
                                        <p className="text-lg leading-4 text-gray-600">Shipping charges</p>
                                        <p className="text-lg font-semibold leading-4 text-gray-600">{subTotal < 1000 && subTotal != 0 ? "₹40" : "FREE"}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full items-center mt-32">
                                    <p className="text-xl font-semibold leading-4 text-gray-800">You have to Pay </p>
                                    <p className="text-lg font-semibold leading-4 text-gray-800">₹{subTotal + (subTotal < 1000 && subTotal != 0 ? 40 : 0)} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout