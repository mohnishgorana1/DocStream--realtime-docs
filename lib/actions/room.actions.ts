'use server'

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation';


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
            defaultAccesses: []
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

export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType
        }

        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses
        })

        if (room) {
            const notificationId = nanoid();
            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                roomId: roomId,
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email
                }
            })
        }

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(room)
    } catch (error) {
        console.log("Error Updating Room Access", error);

    }

}

export const removeCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        if (room.metadata.email === email) {
            throw new Error("You can't remove yourself")
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        })
    } catch (error) {
        console.log("Error removing Collaborator", error);

    }
}


export const deleteDocument = async (roomId: string) => {
    try {
        const deletedRoom = await liveblocks.deleteRoom(roomId);

        if (deletedRoom!) {
            console.log("Room Deleted Successfully");
        }

        revalidatePath('/')
        redirect('/')
    } catch (error) {
        console.log("Error on deleting room ", error);

    }
}