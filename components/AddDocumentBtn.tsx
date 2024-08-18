'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument } from '@/lib/actions/room.actions'
import { useRouter } from 'next/navigation'
import Loader from './Loader'

function AddDocumentBtn({ userId, email }: AddDocumentBtnProps) {
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
        <Button type='submit' onClick={addDocumentHandler} className='gradient-blue flex gap-1 shadow-md'>
            {isLoading! && (
                <Image
                    src={'/assets/icons/add.svg'}
                    width={24} height={24} alt="add"
                />
            )}

            <p className="hidden sm:block">{isLoading ? <Loader /> : "Start a blank document"}</p>
        </Button>
    )
}

export default AddDocumentBtn