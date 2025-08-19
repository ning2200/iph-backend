import { getUserID, updateTicketData } from "../services/agent.service.js";

// export async function saveAgentMessage(req, res) {
//     try {
//         const { userID } = req.params;
//         const { refCode, agentName, agentMessage } = req.body;

//         const result = await uploadAgentMessage(userID, refCode, agentName, agentMessage);
//         return res.status(200).json(result);
//     } catch (e) {
//         res.status(500).json({ message: e.message, fail: 'unable to save agent message' });
//     }
// }

export async function retrieveUserIDFromTicket(req, res) { // ✅
    try {
        const { ticket, msgID } = req.params;

        const result = await getUserID(ticket, msgID);
        return res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to retrieve userID from ticket' });
    }
}

export async function updateRestrictedQuery(req, res) { // ✅
    try {
        const { ticket } = req.params;
        const ticketData = req.body;

        if (Object.keys(ticketData).length === 0) {
            return res.status(404).json({ message: 'Restricted query data not found' });
        }

        const result = await updateTicketData(ticket, ticketData);
        return res.status(200).json({ success: result, message: 'Restricted query updated successfully' });
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to update restricted query' });
    }
}