import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'



export const Header = () => {
  const pathname = usePathname()
  return (
  
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Inventory Management System</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
            <li className="mr-4 font-bold hover:text-indigo-500">Home</li>
          </Link>

          <Link
            className={`link ${pathname === '/dashboard/blog' ? 'active' : ''}`}
            href="/dashboard/blog"
          >
            <li className="mr-4 font-bold hover:text-indigo-500">Blog</li>
          </Link>

          <Link
            className={`link ${pathname === '/dashboard/about' ? 'active' : ''}`}
            href="/dashboard/about"
          >
            <li className="mr-4 font-bold hover:text-indigo-500" >About</li>
          </Link>

          <Link
            className={`link ${pathname === '/dashboard/contact' ? 'active' : ''}`}
            href="/dashboard/contact"
          >
            <li className="mr-4 font-bold hover:text-indigo-500" >Contact</li>
          </Link>
        </nav>
      </div>
    </header>
  
  )
}
export default Header
