
import React from 'react'
 import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'
const BestSelleer = () => {

  const { products } = useAppContext();
  return (
    <div id='best-seller' className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium pb-3'>Best Seller</p>

     <div className='grid 
        grid-cols-2 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        gap-4 
        md:gap-6 
        lg:gap-8'>
      {products.filter((product) => product.inStock).slice(0,5).map((product, index) =>(
         <ProductCard key={index} product={product} />
      ))}
       
     </div>
    </div>
  )
}

export default BestSelleer
