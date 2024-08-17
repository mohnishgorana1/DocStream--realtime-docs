import { Liveblocks } from "@liveblocks/node";



// Users can only interact with rooms they have access to. 
// You can configure permission access in an api/liveblocks-auth endpoint by 
// creating the app/api/liveblocks-auth/route.ts file  with the following code. 
// This is where you will implement your security and define 
// if the current user has access to a specific room.

export const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});