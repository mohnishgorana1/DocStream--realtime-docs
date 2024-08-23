'use server'

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';


export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();
    try {
        const metadata = {
            createdId: userId,
            email,
            title: "Untitled"
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ['room:write']
        });

        revalidatePath('/')

        return parseStringify(room)
    } catch (error) {
        console.log("Error happened while creating the room", error);
    }

}

export const getDocument = async ({ roomId, userId }: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        // TODO
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        // if (!hasAccess) {
        //     throw new Error("You don't have access to this document")
        // }
        // console.log("GET",room.metadata);
        
        return parseStringify(room)
    } catch (error) {
        console.log("Error getting document or room", error);

    }
}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        console.log("Doc to upload", roomId, title);

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        })
        console.log("Updated Document", updateDocument);

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    } catch (error) {
        console.log("Error Updating Document", error);

    }

}

export const listDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email })

        // rooms.data.map((r) => {
        //     console.log("ID", r.id, "metadata", r.metadata);
        // })
        // console.log("rooms", rooms);

        return parseStringify(rooms)
    } catch (error) {
        console.log("Error Fetching all Documents or Rooms", error);

    }
}