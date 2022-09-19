import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const [passwordshow, setPasswordshow] = useState("true");
  const [passwordicon, setPasswordicon] = useState("true");

  const handlePassShow = () => {
    setPasswordicon(!passwordicon);
    setPasswordshow(!passwordshow)
  }

  const handleChange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'phone') {
      setPhone(e.target.value)
    }
    else if (e.target.name == 'password') {
      setPassword(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let data = { name, email, phone, password }

    let url = `${process.env.NEXT_PUBLIC_HOST}/api/signup`
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(data)
    });

    let response = await res.json()
    setName('')
    setEmail('')
    setPhone('')
    setPassword('')
    toast.success('Your account created successfully', {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={4000}
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
            Sign up
          </h1>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-800"
              >
                Name
              </label>
              <input
                onChange={handleChange} value={name} type="text" name='name'
                className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Email
              </label>
              <input
                onChange={handleChange} value={email} type="email" name='email'
                className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-gray-800"
              >
                Contact Number
              </label>
              <input
                onChange={handleChange} value={phone} type="tel" name='phone'
                className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 right-0 flex items-center px-4">
                  {passwordicon ? <AiFillEye onClick={handlePassShow} className="cursor-pointer text-xl" /> : <AiFillEyeInvisible onClick={handlePassShow} className="cursor-pointer text-xl" />}
                </div>
                <input onChange={handleChange} value={password} name='password' className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40" id="password" type={passwordshow ? "password" : "text"} autoComplete="off"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-normal text-center text-green-800">
            Already have an account?
            <Link href={'/login'}>
              <span className='font-bold cursor-pointer'>Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
