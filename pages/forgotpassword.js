import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'

const Forgotpassword = () => {
  const [email, setEmail] = useState('')
  const router = useRouter()
  useEffect(() => {
    if(localStorage.getItem("myuser")){
      router.push('/')
    }
  }, [])
  
  const handleChange = (e) => {
    if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let data = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/sendresetlink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ email: email })
    });

    let res = await data.json()

    if (res.success == true) {
      setEmail('')
      toast.success(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }else{
      setEmail('')
      toast.error(res.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="relative flex flex-col justify-center h-[85vh] overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-semibold text-center text-green-700 underline">
            Forgot Password
          </h1>
          <form className="mt-6">
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Email
              </label>
              <input onChange={handleChange} type="email" value={email} name="email" className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40" />
            </div>
            <div className="mt-6">
              <button onClick={handleSubmit} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
                Send Reset Password Link
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-normal text-center text-green-800">
            Return to Login?
            <Link href={'/login'}>
              <span className='font-bold cursor-pointer'>Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Forgotpassword

