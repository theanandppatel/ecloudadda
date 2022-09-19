import React,{useState,useEffect} from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from 'next/router';

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if(localStorage.getItem('myuser')){
            router.push('/')
        }
    },[])
    
    const handleChange = (e) => {
        if (e.target.name == 'email') {
          setEmail(e.target.value)
        }
        else if (e.target.name == 'password') {
          setPassword(e.target.value)
        }
      }

      const handleSubmit = async (e) => {
        e.preventDefault()
    
        let data = { email, password }
    
        
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
    
          },
          body: JSON.stringify(data)
        });
    
        let response = await res.json()
        setEmail('')
        setPassword('')
        if(response.success){
            localStorage.setItem("myuser",JSON.stringify({token:response.token,email:response.email}))
            toast.success('Successfully logged in', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });

            setTimeout(() => {
                router.push('/')
            }, 2000);
                
        }
        else{
        toast.error('Invalid Credentials', {
          position: "top-center",
          autoClose: 4000,
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
      <div className="relative flex flex-col justify-center h-[80vh] overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-green-700 underline">
                   Sign in
                </h1>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            onChange={handleChange} type="email" name='email' value={email}
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
                        <input
                            onChange={handleChange} type="password" name='password' value={password}
                            className="block w-full px-4 py-2 mt-2 text-green-700 bg-white border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <Link href={'/forgotpassword'}>
                        Forgot Password?
                    </Link>
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-700 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600">
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs font-normal text-center text-green-700">
                    Don&apos;t have an account?
                    <Link href={'/signup'}>
                    <span className='font-bold cursor-pointer'>Sign up</span>
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login
