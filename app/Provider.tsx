"use client";
import React from 'react'
import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';



function Provider({ children }: { children: React.ReactNode }) {
    return (
        <LiveblocksProvider authEndpoint='/api/liveblocks-auth'>
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    );
}


export default Provider