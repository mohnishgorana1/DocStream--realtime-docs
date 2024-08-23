'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators'
import { Input } from './ui/input'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'

function CollaborativeRoom({ roomId, roomMetadata }: CollaborativeRoomProps) {

    const currentUserType = "editor"
    
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title || "")

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // frontend me to ho gya ab backend me bhi to kro..
        if (e.key === 'Enter') {
            setLoading(true)

            try {
                if (documentTitle !== roomMetadata.title) {
                    // update function
                    const updatedDocument = await updateDocument(roomId, documentTitle)
                    if (updatedDocument) {
                        setLoading(false)
                    }
                }
            } catch (error) {
                console.log("Error Updating Document Title", error);
            }
            setLoading(false)
        }
    }


    useEffect(() => {
        // ye useEffect to chalga hi jab documentTitle me change aega
        // lkin ye handleClickOutside fn tab chalga jab eventlistener hoga

        const handleClickOutside = (e: MouseEvent) => {
            // check if containerRef.current donot have that element as Node in it tree
            // then setEditing to false so that it again displays default and updateDocument too for backend
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false)
                updateDocument(roomId, documentTitle);
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.addEventListener('mousedown', handleClickOutside)
        }
    }, [documentTitle])

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing])
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<div>Loading…</div>}>
                <div className="collaborative-room">
                    <Header>
                        <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                            {
                                editing && !loading ? (
                                    <Input
                                        type='text'
                                        value={documentTitle}
                                        ref={inputRef}
                                        placeholder='Enter title'
                                        onChange={(e) => setDocumentTitle(e.target.value)}
                                        onKeyDown={updateTitleHandler}
                                        disabled={!editing}
                                        className='document-title-input'
                                    />
                                ) : (
                                    <>
                                        <p className='document-title'>{documentTitle}</p>
                                    </>
                                )
                            }

                            {currentUserType === "editor" && !editing && (
                                <Image src={'/assets/icons/edit.svg'}
                                    width={24}
                                    height={24}
                                    alt='edit'
                                    onClick={() => setEditing(true)}
                                    className='pointer'
                                />
                            )}

                            {currentUserType !== "editor" && !editing && (
                                <p className="view-only-tag">View Only</p>
                            )}

                            {loading && <p className='text-sm text-gray-400'>saving...</p>}

                        </div>
                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollaborators />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborativeRoom