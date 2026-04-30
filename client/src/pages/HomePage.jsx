 
 import React, { useEffect } from 'react'
 import { useLocation } from 'react-router-dom'
 import MainBanner from '../components/MainBanner'
 import Categories from '../components/Categories'
 import BestSelleer from '../components/BestSelleer'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'

 const HomePage = () => {
   const { pathname, hash } = useLocation()

   useEffect(() => {
     if (pathname === '/' && hash) {
       const id = hash.replace('#', '')
       const element = document.getElementById(id)
       if (element) {
         element.scrollIntoView({ behavior: 'smooth', block: 'start' })
       }
     }
   }, [pathname, hash])

   return (
     <>
     <MainBanner />
     <Categories />
     <BestSelleer />
     <BottomBanner />
     <NewsLetter />
     
     </>
   )
 }
 
 export default HomePage
 