import { Users } from "../services/db.service.js";
import { 
    createTicketData, transferUserData, uploadTempUserData, userQueryHistory
} from "../services/user.service.js";

const auth = new Users('auth');
const user = new Users('users');

export async function authenticateUser(req, res) { // ✅
    try {
        const { userID } = req.params;
        const userData = req.body;

        if (Object.keys(userData).length === 0) {
            return res.status(404).json({ message: 'User data not found' });
        }

        const result = await uploadTempUserData(userID, userData);
        return res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to authenticate user' });
    }
}

export async function approveUser(req, res) { // ✅
    try {
        const { userID } = req.params;

        const result = await transferUserData(userID);
        return res.status(201).json(result); 
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to approve user' });
    }
}

export async function rejectUser(req, res) { // ✅
    try {
        const { userID } = req.params;

        const result = await auth.delete(userID);
        return res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to reject user' });
    }
}

export async function userExists(req, res) { // ✅
    try {
        const { userID } = req.params;

        const authExists = await auth.exists(userID);
        const userExists = await user.exists(userID);
        return res.status(200).json({ userExists, authExists });
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to verify user existence' });
    }
}

export async function retrieveUserData(req, res) { // ✅
    try {
        const { userID } = req.params;

        const userData = await user.data(userID);
        return res.status(200).json({ user: userData });
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to retrieve user data' });
    }
}

export async function saveUserQuery(req, res) { // ✅
    try {
        const { ticket } = req.params;
        const queryData = req.body;

        if (Object.keys(queryData).length === 0) {
            return res.status(404).json({ message: 'Query data not found' });
        }

        const result = await createTicketData(ticket, queryData);
        return res.status(201).json({ success: result, message: 'Query saved successfully' });
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to save user inquiry' });
    }
}

export async function retrieveQueryHistory(req, res) { // ❓
    try {
        const { ticket } = req.params;

        const result = await userQueryHistory(ticket);
        return res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: e.message, fail: 'Unable to retrieve query history '});
    }
}