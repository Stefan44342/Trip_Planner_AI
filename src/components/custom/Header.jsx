import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    console.log(user);
  })
  
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserInformation(codeResp),
    onError: (error) => console.log(error)
  })

  const GetUserInformation = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Application/json'
        }
      }).then((resp) => {
        console.log(resp);
        localStorage.setItem('user', JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload();
      })
  }

  return (
    <header className={`sticky top-0 py-3 px-4 md:px-8 flex justify-between items-center w-full z-50 transition-all duration-300 
      ${scrolled 
        ? 'bg-blue-900/80 backdrop-blur-md shadow-lg' 
        : 'bg-blue-900/40 backdrop-blur-sm'
      }`}>
      <a href='/'>
        <img src='/logo3.png' className='h-16 w-auto object-contain' />
      </a> 
      {user ? (
        <div className='flex items-center gap-3'>
          <a href='/create-trip'>
            <Button className='bg-teal-500 hover:bg-teal-400 text-white rounded-lg transition-all shadow-md hover:shadow-lg'>
              + Create trip
            </Button>
          </a>
          <a href='/my-trips'>
            <Button className='bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition-all'>
              My trips
            </Button>
          </a>
          <a href='/dashboard'>
            <Button className='bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg transition-all'>
              Dashboard
            </Button>
          </a>
          <Popover>
            <PopoverTrigger>
              <div className="h-10 w-10 rounded-full border-2 border-teal-400 overflow-hidden shadow-md hover:shadow-teal-400/30 transition-all">
                <img src={user?.picture} className='h-full w-full object-cover' alt="User" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-blue-900/90 backdrop-blur-md border border-white/20 text-white shadow-lg p-0 overflow-hidden">
              <div className="p-3 border-b border-white/10">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-300 truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full text-left p-2 hover:bg-white/10 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Button 
          onClick={() => setOpenDialog(true)} 
          className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          Sign In
        </Button>
      )}
      
      <Dialog open={openDialog}>
        <DialogContent className="bg-blue-900/90 backdrop-blur-lg border border-white/20 text-white shadow-xl">
          <DialogHeader>
            <DialogDescription>
              <img src='/logo3.png' className='h-20 w-auto mx-auto' />
              <h2 className='font-bold text-xl mt-6 text-white text-center'>Sign in with Google</h2>
              <p className="text-gray-300 text-center mb-4">Sign in to the App with Google authentication securely</p>
              <Button 
                onClick={login} 
                className='w-full py-3 flex gap-4 items-center justify-center bg-white hover:bg-gray-100 text-blue-900'
              >
                <FcGoogle className='h-6 w-6' />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default Header