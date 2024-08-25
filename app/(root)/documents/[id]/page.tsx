import CollaborativeRoom from '@/components/CollaborativeRoom'
import Header from '@/components/Header'
import { getDocument } from '@/lib/actions/room.actions'
import { getClerkUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress
  })
  if (!room) redirect('/')

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds })  // all clerkUsers in our app

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write') ? "editor" : "viewer"
  }))
  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? "editor" : "viewer"
  

  console.log("userIds", userIds);
  console.log("users", users);
  console.log("usersData", usersData);
  console.log("currentUserType", currentUserType);


  return (
    <main className='flex w-full flex-col items-center'>
      {/* this page needs liveblock  CollaborativeRoom and room provider in it, 
        having header with live docName and and live Editor  
      */}

      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />

    </main>
  )
}

export default Document