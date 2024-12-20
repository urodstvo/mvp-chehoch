from fastapi import Response
from datetime import timedelta, datetime, timezone


def set_session_cookie(response: Response, session_id: str):
    expiry = datetime.now(timezone.utc) + timedelta(weeks=1)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=False,  
        secure=False, 
        expires=expiry.isoformat(), 
    )

def clear_session_cookie(response: Response):
    response.delete_cookie(key="session_id")