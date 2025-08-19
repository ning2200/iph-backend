from config.firebase_config import firestore_db
from google.cloud.firestore import DocumentSnapshot
from typing import Optional, Dict, Any
from cryptography.fernet import Fernet

class Users:
    def __init__(self):
        self.users = firestore_db.collection('users')

    def _user_snapshot(self, user_id: int) -> DocumentSnapshot:
        return self.users.document(user_id).get()

    def user_data(self, user_id: int): # Optional[Dict[str, Any]]
        snapshot = self._user_snapshot(user_id)
        return snapshot.to_dict() if snapshot.exists else None # better error handling, import logging?

    def user_data_exists(self, user_id: int) -> bool:
        return self._user_snapshot(user_id).exists

class UserData(Users):
    def user_name(self, user_id: int) -> str: # ✅
        data = self.user_data(user_id)
        return f"{data.get('rank')} {data.get('full_name')}" # if field does not exist?
    
    def unit(self, user_id: int) -> str:
        return self.user_data(user_id).get('unit')

    def phone_number(self, user_id: int) -> str:
        return self.user_data(user_id).get('phone_number') # decrypt

    def email_address(self, user_id: int) -> str:
        return self.user_data(user_id).get('email_address') # decrypt

if __name__ == "__main__":
    users = Users()
    user_data = UserData()
    print()