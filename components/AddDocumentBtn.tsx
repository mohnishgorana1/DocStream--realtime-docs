'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument } from '@/lib/actions/room.actions'
import { useRouter } from 'next/navigation'
import Loader from './Loader'
import { BiMessageSquareAdd } from "react-icons/bi";
import { IoDocumentText } from "react-icons/io5";
import { Loader2 } from 'lucide-react'
function AddDocumentBtn({ userId, email, roomLength }: AddDocumentBtnProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();

    const addDocumentHandler = async () => {
        try {
            setIsLoading(true)
            const room = await createDocument({ userId, email })
            if (room) {
                router.push(`/documents/${room.id}`)
                setIsLoading(false)
            }
        } catch (error) {
            console.log("Error Creating a Room", error);
        }
    }

    return (
        <>
            {
                roomLength > 0 ? (
                    <>
                        <Button type='submit' onClick={addDocumentHandler} className='gradient-blue gap-1 shadow-md hidden sm:flex'>
                            {
                                !isLoading && <Image
                                    src={'/assets/icons/add.svg'}
                                    width={20} height={20} alt="add"
                                />
                            }
                            <p className="">{isLoading ? <Loader /> : "Start a blank document"}</p>
                        </Button>
                        {
                            !isLoading ? (
                                <BiMessageSquareAdd
                                    className='sm:hidden p-0 size-8 bg-transparent text-blue-400 cursor-pointer'
                                    onClick={addDocumentHandler}
                                    type='submit'
                                />
                            ) : (
                                <Loader2 className='sm:hidden animate-spin text-blue-600 p-0 size-8' />
                            )
                        }
                    </>
                ) : (
                    <Button type='submit' onClick={addDocumentHandler} className='gradient-blue gap-1 shadow-md'>
                        {
                            !isLoading && <Image
                                src={'/assets/icons/add.svg'}
                                width={20} height={20} alt="add"
                            />
                        }
                        <p className="">{isLoading ? <Loader /> : "Start a blank document"}</p>
                    </Button>
                )
            }
        </>
    )
}

export default AddDocumentBtn