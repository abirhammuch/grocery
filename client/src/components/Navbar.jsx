
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'
import { FaShoppingCart } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa';
import {useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast';

import React from 'react'

const Navbar2 = () => {
  const [open , setOpen] = useState(false);
  const {user , setUser , setShowUserLogin, navigate ,searchQuery, setSearchQuery, getCartCount, axios} = useAppContext();

  const logout = async () =>{

    try {
      const { data } = await axios.get('api/user/logout')
      if(data.success){
        toast.success(data.message)
        setUser(null);
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    
  }

  useEffect(()=>{
    if(searchQuery.length > 0){
      navigate('/products')
    }
  }, [searchQuery])

  return (
    <nav className='flex items-center justify-between px-4 md:px-14 py-4 border-b border-gray-300 bg-white relative transition-all h-[70px]'>

        
      <NavLink to='/' onClick={()=>{setOpen(false)}}>
        <img src={assets.logo} alt ="logo" />
      </NavLink>
      

      <div className='hidden sm:flex items-center gap-8'>
        <NavLink to='/' className='hover:text-gray-500'>Home</NavLink>
        <NavLink to='/products' className='hover:text-gray-500' >All Product</NavLink>
        <NavLink to='/contact'className='hover:text-gray-500' >Contact</NavLink>

        <div className='hidden lg:flex items-center text-sm gap-2 border-gray-300 px-3 not-first:rounded-full relative'>

            <input  className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500 border  border-gray-300  px-2  '  type='text'placeholder='Search Products' onChange={(e)=>setSearchQuery(e.target.value)} />
            <img src ={assets.search_icon}className='absolute right-4 w-6' />
        </div>

        <div onClick={()=>{navigate('/cart')}} className='relative cursor-pointer'>
            <img src={assets.cart_icon} alt="Cart" className='w-6 opacity-80' />
            <button className='absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full'>{getCartCount()}</button>
        </div>

          {!user ? (
              <button onClick={()=>setShowUserLogin(true)} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full '>
          Login
        </button>
          ):(
            <div className='relative group'>
              
              <img src={assets.profile_icon} alt='profile'className='w-9 cursor-pointer' />
              <ul className='absolute hidden group-hover:block top-10 right-0 bg-white shadow border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                <li onClick={()=>{navigate('/my-orders')}} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
                <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logoout</li>
              </ul>
             </div>
          )}
        

        </div>
         

         {/* mobile desplay*/}
        <div className='sm:hidden flex z-100'>

          <div className='flex items-center sm:hidden'>

            <div onClick={()=>{navigate('/cart')}} className='relative cursor-pointer'>
            <img src={assets.cart_icon} alt="Cart" className='w-6 opacity-80' />
            <button className='absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full'>{getCartCount()}</button>
        </div>
            
        <button onClick={() =>{open ? setOpen(false):setOpen(true)}} aria-label='Menu' className=' flex justify-center p-2 m-3'>
            <FaBars  className='cursor-pointer text-2xl text-gray-500 border-none'/>
        </button>
          </div>

        
        {open && (
          <div className= {`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden `}>
          <NavLink to='/'onClick={()=>{setOpen(false)}} className='hover:text-gray-500'>Home</NavLink>
          <NavLink to='/products'onClick={()=>{setOpen(false)}} className='hover:text-gray-500'>All product</NavLink>
          {user &&
          <NavLink to='/my-orders' onClick={()=>{setOpen(false)}}className='hover:text-gray-500'>My Order</NavLink>
          }
          <NavLink to='/'onClick={()=>{setOpen(false)}} className='hover:text-gray-500'>Contact</NavLink>

          {!user ?(
            <button onClick={()=>{
              setOpen(false);
              setShowUserLogin(true)

            }} className='cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm'>Login</button>
          ):
          (<button onClick={logout} className='cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm'>Logout</button>)
          }


        </div>
        )}

      </div>


    </nav>
  )
}

export default Navbar2
