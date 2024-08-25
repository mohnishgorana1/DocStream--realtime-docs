"use client";
import React from 'react'
import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';
import { documentUsers, getClerkUsers } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';



function Provider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser } = useUser()
    return (
        <LiveblocksProvider
            authEndpoint='/api/liveblocks-auth'
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUsers({ userIds });
                return users;
            }}
            resolveMentionSuggestions={async ({ text, roomId }) => {
                const roomUsers = await documentUsers({
                    roomId,
                    currentUser: clerkUser?.emailAddresses[0].emailAddress!,
                    
                    userToMentionText: text,
                })
                return roomUsers
            }}
        >
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    );
}


export default Provider