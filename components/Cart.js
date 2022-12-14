import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'

import commerce from '../src/commerce';
import { useCart, updateCart} from '../src/cartContext'




export default function Cart() {
    const [{open, items, id: cartId, subtotal, loading}, cartDispatch] = useCart();

    useEffect(()=>{
        updateCart(cartDispatch);
    }, [])

    const removeItem = async id =>{
        
        const item = items.find(elem=>elem.id == id);


        try{
            cartDispatch({type: 'LOADING'})

            if(item.quantity > 1){
                await commerce.cart.update(id, { quantity: item.quantity - 1 })
            }else{
                await commerce.cart.remove(id)
            };

            updateCart(cartDispatch);
    
        }catch(err){
            console.log('err', err)
        }
        
    }

    const closeCart = ()=>{
        cartDispatch({type: 'CLOSE'});
    }

  return (
    
    <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeCart}>
            <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
    
            
            <div className="fixed inset-0 overflow-hidden">
                
                <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                    >
                    <Dialog.Panel className={`relative w-screen max-w-md ${loading? "pointer-events-none" : "pointer-events-auto"}`}>
                    {loading ? 
                        <div className='absolute h-full w-full flex justify-center items-center bg-gray-500 bg-opacity-20 transition-opacity'>
                            <div className="flex justify-center items-center ">
                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-500" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    : null}
                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl ">
                        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                            <div className="flex items-start justify-between">
                            <Dialog.Title className="text-lg font-medium text-gray-900"> Shopping cart </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                                <button
                                type="button"
                                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={closeCart}
                                >
                                <span className="sr-only">Close panel</span>
                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            </div>
    
                            <div className="mt-8">
                            <div className="flow-root">
                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {items && items.map((item) => (
                                    <li key={item.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img
                                        src={item.image.url}
                                        alt={item.image.alt}
                                        className="h-full w-full object-cover object-center"
                                        />
                                    </div>
    
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>
                                            <a href={`/products/${item.permalink}`}> {item.name} </a>
                                            </h3>
                                            <p className="ml-4">{item.price.formatted_with_symbol}</p>
                                        </div>
                                        </div>
                                        <div className='flex gap-4 text-sm mt-2'>
                                            {item.selected_options.map(elem=>(
                                                <p key={elem.group_id} className="text-gray-500">{elem.group_name}: {elem.option_name}</p>
                                            ))}
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-gray-500">Qty {item.quantity}</p>
    
                                        <div className="flex">
                                            <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                            onClick={()=>removeItem(item.id)}
                                            >
                                            Remove
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            </div>
                        </div>
    
                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>{subtotal}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <Link
                                    href="/checkout2"
                                    passHref
                                >
                                    <a className={`flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 ${items && items.length == 0 ? "pointer-events-none bg-opacity-70" : "pointer-events-auto bg-opacity-100"}`}>
                                        Checkout
                                    </a>
                                </Link>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                                or{' '}
                                <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={closeCart}
                                >
                                Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                </button>
                            </p>
                            </div>
                        </div>
                        </div>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </div>
            </Dialog>
    </Transition.Root>
  )
}
