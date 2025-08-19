import firestoreDB from "../config/firebase_config.cjs";

class Users {
    constructor(collectionName) {
        this.collection = firestoreDB.collection(collectionName);
    }

    doc(userID) { // ✅
        return this.collection.doc(userID);
    }

    async snapshot(userID) {
        return await this.doc(userID).get();
    }

    async exists(userID) { // ✅
        return (await this.snapshot(userID)).exists;
    }

    async data(userID) { // ✅
        return await this.exists(userID) ? (await this.snapshot(userID)).data() : null;
    }

    async delete(userID) { // ✅
        if (!await this.exists(userID)) return { success: false, message: 'User data not found' };
        await this.doc(userID).delete() 
        return { success: true, message: 'User data deleted successfully' };
    }
}

class Tickets {
    constructor() {
        this.collection = firestoreDB.collection('tickets');
    }

    ticketDoc (ticket) { // ✅
        return this.collection.doc(ticket.toString());
    }

    messagesCollection(ticket) {
        return this.ticketDoc(ticket.toString()).collection('messages');
    }

    async msgIDsSnapshot(ticket) { // ✅
        return await this.messagesCollection(ticket.toString()).get();
    }

    messageDoc(ticket, msgID) { // ✅
        return this.messagesCollection(ticket.toString()).doc(msgID.toString());
    }

    async messageSnapshot(ticket, msgID) {
        return await this.messageDoc(ticket, msgID).get();
    }

    async messageData(ticket, msgID) { // ✅
        return (await this.messageSnapshot(ticket, msgID)).data();
    }
}

export { Users, Tickets };