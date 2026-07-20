import Link from 'next/link'
import Image from "next/image";
import React from 'react'

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full shadow-md z-50 h-16 border-white/6 bg-white/7 backdrop-blur-md">
        <nav className="mx-auto flex items-center justify-between h-full max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <Link href="/">
            <Image src="/logo.png" alt="Logo"
            width={100}
            height={100}
            className="h-9 w-auto rounded-md"
            />
            </Link>

            <div>
              
            </div>
        </nav>
    </header>
   )
}

export default Header