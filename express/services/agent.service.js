import { Tickets } from "./db.service.js";

const tickets = new Tickets();

export async function getUserID(ticket, msgID) {
    const msgData = await tickets.messageData(ticket, msgID);
    const userID = msgData.sender && msgData.sender.role === 'user' ? msgData.sender.id : null;
    return { userID };
}

export async function updateTicketData(ticket, ticketData) {
    const { ticketStatus, closedAt, msgID, reply, userID, userName, role } = ticketData;

    await tickets.ticketDoc(ticket).update({
        status: ticketStatus,
        closedAt: closedAt,
    });

    await tickets.messageDoc(ticket, msgID).set({
        sender: {
            id: userID,
            name: userName,
            role: role,
        },
        content: reply,
        attachment: null,
        createdAt: new Date(),
    });

    return true;
}