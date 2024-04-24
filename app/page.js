// Import statements should reflect the correct paths to your components.
"use client"
import Header from '@/components/Header'; // Assuming `Header` is the default export in Header.js
import Footer from '@/components/Footer'; // Assuming `Footer` is the default export in Footer.js
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [aleart, setAleart] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json();
      setProducts(rjson.products)
    }
    fetchProducts()

  }, [])

  const buttonAction = async (action, slug, initialQuantity) => {
    //Immediately change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug)
    console.log(index)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1
      console.log(newProducts[index], quantity)
    }
    else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)

    //Immediately change the quantity of the product with given slug in dropdown
    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    console.log(indexdrop)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
      console.log(newDropdown[index], quantity)
    }
    else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)


    console.log(action, slug)
    setLoadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    let r = await response.json()
    console.log(r)
    setLoadingaction(false)
  }

  // Function to handle form submission
  const addProduct = async (e) => {
    try {
      // Send a POST request to your API endpoint
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      // Check if the request was successful (you can add more error handling here)  
      if (response.ok) {
        //product added successfully
        console.log('Product added successfully');
        setAleart("Your Product has been Added!")
        setProductForm({})
      } else {
        //handle error case
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
      e.preventDefault();
    }
    //fetch all the product again to sync back
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
  };

  const handleChange = (e) => {

    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length > 3) {
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false)
    }
    else {
      setDropdown([])
    }
  }


  return (
    <>
      <div>
        <Header />
        <div className="container my-8 mx-auto">
          <div className="text-green-600 text-center">{aleart}</div>
          <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
          <div className="flex mb-2">
            <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" className="flex-1 border border-gray-300 px-4 py-2 round-r-md form-input mt-1 block w-full" />
            <select className="border border-gray-300 px-4 py-2 round-r-md">
              <option value="">All</option>
              <option value="category2">Category 1</option>
              <option value="category2">Category 2</option>

            </select>
          </div>
          {loading && <div className='flex justify-center item-center '> <svg fill="#000000" width="180" height="180" version="1.1" id="Layer_1" viewBox="0 0 330 330">
          <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" stroke="#000" strokeWidth="4" strokeDasharray="31.415, 31.415" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" dur="0.5s" from="0" to="62.83" repeatCount="indefinite" />
            <animate attributeName="strokeDasharray" dur="0.5s" values="31.415,31.415; 0,62.83; 31.415, 31.415;" repeatCount="indefinite" />
          </circle>
        </svg> </div>
        }
          <div className="dropcontainer absolute w-[72vw] border-1 bg-purple-100 round-md">

            {dropdown.map(item => {
            return <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">
              <span className="slug" >{item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className='mx-5'>
                <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract inline-block px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold  rounded-lg shadow-md cursor-pointer disabled:bg-purple-200">-</button>
                <span className="quantity mx-3">{item.quantity}</span>
                <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="add inline-block px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold  rounded-lg shadow-md cursor-pointer disabled:bg-purple-200">+</button>
              </div>

            </div>
          })}
          </div>
        </div>
        <div className="container my-8 mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Add a Product</h1>

          <form className="mb-4">

            <div className="mb-4">
              <label htmlFor="productName" className="block text-gray-800 font-bold">Product Slug:</label>
              <input value={productForm?.slug || ""} name='slug' onChange={handleChange} type="text" id="productName" className=" border border-gray-300 px-4 py-2 round-r-md form-input mt-1 block w-full" />
            </div>

            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 font-bold">Quantity:</label>
              <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" id="quantity" className="border border-gray-300 px-4 py-2 round-r-md form-input mt-1 block w-full" />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-1000 font-bold">Price:</label>
              <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" id="price" className="border border-gray-300 px-4 py-2 round-r-md form-input mt-1 block w-full" />
            </div>

            <button onClick={addProduct} type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md">
              Add Product
            </button>
          </form>
        </div>
        <div className="container my-8  mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Display Current Stock</h1>

          <table className="table-auto w-full">
            <thead>
              <tr>

                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                return <tr key={product.slug}>
                  <td className="border px-4 py-2 ">{product.slug}</td>
                  <td className="border px-4 py-2 ">{product.quantity}</td>
                  <td className="border px-4 py-2 ">₹{product.price}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
    </>
  );
}
