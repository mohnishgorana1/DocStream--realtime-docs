'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import '../app/globals.css'
import { usePathname } from 'next/navigation'
import { TextGenerateEffect } from './ui/text-generate-effect'

function Header({ children, className }: HeaderProps) {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isDocumentPage = pathname.startsWith('/documents/');

    const AppDescription = "Collaborative Document Editor, Live and Interactive."
    return (
        <div className={`header ${className}`}>
            <Link href={'/'} className='md:flex-1 flex items-center'>
                {/* <Image
                    src={'/assets/icons/logo.svg'}
                    width={120}
                    height={32}
                    className='cursor-pointer hidden md:block'
                    alt='logo with name'
                /> */}
                <Image
                    src={'/assets/icons/logo-icon.svg'}
                    width={36}
                    height={36}
                    className='cursor-pointer mr-2 '
                    alt='logo without name'
                />
                {
                    isHomePage && (
                        <h1
                            className='text-3xl text-[#7fd3fa] font-bold tracking-wide '
                            style={{
                                fontFamily: "'Poppins', sans-serif", // Apply the custom font
                                textShadow: "0 0 10px #51c3f8",
                                animation: "glow 2s ease-in-out infinite",
                            }}
                        >DocStream</h1>
                    )
                }
                {
                    isDocumentPage && (
                        <h1
                            className='hidden md:block text-3xl text-[#7fd3fa] font-bold tracking-wide '
                            style={{
                                fontFamily: "'Poppins', sans-serif", // Apply the custom font
                                textShadow: "0 0 10px #51c3f8",
                                animation: "glow 2s ease-in-out infinite",
                            }}
                        >DocStream</h1>
                    )
                }


            </Link>
            {children}
        </div>
    )
}

export default Header