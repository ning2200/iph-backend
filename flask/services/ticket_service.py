from config.firebase_config import firestore_db
from google.cloud.firestore import DocumentSnapshot
# from typing import Optional, Dict, Any

class Tickets:
    def __init__(self):
        self.tickets = firestore_db.collection('tickets')

    def _ticket_snapshot(self, ticket_id: str) -> DocumentSnapshot:
        return self.tickets.document(ticket_id).get()

    def ticket_data(self, ticket_id: str): # Optional[Dict[str, Any]]
        snapshot = self._ticket_snapshot(ticket_id)
        return snapshot.to_dict() if snapshot.exists else None

    def ticket_exists(self, ticket_id: str) -> bool:
        return self._ticket_snapshot(ticket_id).exists
    
    def _message_snapshot(self, ticket_id: str, msg_id: int) -> DocumentSnapshot:
        return self.tickets.document(ticket_id).collection('messages').document(msg_id).get()

    def message_data(self, ticket_id: str, msg_id: int): # Optional[Dict[str, Any]]
        snapshot = self._message_snapshot(ticket_id, msg_id)
        return snapshot.to_dict() if snapshot.exists else None
    
    def message_exists(self, ticket_id: str, msg_id: int) -> bool:
        return self._message_snapshot(ticket_id, msg_id).exists

class TicketData(Tickets): # handle error for getters (with status codes?), error handling using wrapper
    def status(self, ticket_id: str) -> str:
        return self.ticket_data(ticket_id).get('status')
    
    def ticket_type(self, ticket_id: str) -> str:
        return self.ticket_data(ticket_id).get('ticket_type')
    
    def ticket_dates(self, ticket_id: str) -> dict[str, str]:
        data = self.ticket_data(ticket_id)
        ticket_open: str = data.get('ticket_date')
        ticket_close: str = data.get('closedAt')
        return {'open': ticket_open, 'close': ticket_close}
    
    def query(self, ticket_id: str, msg_id: int) -> str: # conditionals for attachment, loop and conditionals for checking user/agent role/response, sort by msg id before cascading
        return self.message_data(ticket_id, msg_id).get('content')
    
    def agent_name(): 
        pass


if __name__ == "__main__":
    tickets = Tickets()
    ticket_data = TicketData()
    print(ticket_data.ticket_dates('IPH-ou1JzZS'))