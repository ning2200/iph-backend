import firestoreDB from "../config/firebase_config.cjs";
import { Users, Tickets } from "./db.service.js";

const auth = new Users('auth');
const user = new Users('users');
const tickets = new Tickets();

export async function uploadTempUserData(userID, userData) {
    const { rank, userName, unit, phoneNumber, email, consent } = userData;

    await auth.doc(userID).set({
        rank: rank,
        full_name: userName,
        unit: unit,
        phone_number: phoneNumber,
        email_address: email,
        consent: consent,
        status: "pending",
        createdAt: new Date(),
    }, { merge: true });

    return { success: true, message: 'Temp user data uploaded successfully' };
}

export async function transferUserData(userID) {
    await firestoreDB.runTransaction(async (transaction) => {
        const userRef = user.doc(userID);
        const authRef = auth.doc(userID);

        const authDoc = await transaction.get(authRef);
        if (!await auth.exists(userID)) throw new Error(`Failed to authorise ${userID}`);

        const userData = authDoc.data();

        transaction.set(userRef, {
            ...userData,
            status: "approved",
            approvedAt: new Date(),
        }, { merge: true });

        transaction.delete(authRef);
    });

    return { success: true, message: 'User data transferred successfully' };
}

export async function createTicketData(ticket, ticketData) {
    const { 
        ticketStatus, ticketType, ticketDate, msgID, content, userID, userName, role, attachment,
    } = ticketData;

    await tickets.ticketDoc(ticket).set({
        ticket_type: ticketType,
        ticket_date: ticketDate,
        status: ticketStatus,
        closedAt: null,
    }, { merge: true });

    await tickets.messageDoc(ticket, msgID).set({
        sender: {
            id: userID,
            name: userName,
            role: role,
        },
        content: content,
        attachment: attachment,
        createdAt: new Date(),
    });

    return true;
}

export async function userQueryHistory(ticket) {
    const msgsSnapshot = await tickets.msgIDsSnapshot(ticket);
    if (msgsSnapshot.empty) return { messages: [] };

    const messages = [];
    
    msgsSnapshot.forEach(doc => {
        const data = doc.data();
        messages.push({
            id: doc.id,
            content: data.content,
            role: data.sender.role,
        });
    });
    
    messages.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    const lastMsgID = messages[messages.length - 1]?.id || null;

    return { messages, lastMsgID };
}