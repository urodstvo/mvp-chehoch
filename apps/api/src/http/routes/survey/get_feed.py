from fastapi import Cookie, HTTPException


def get_survey_feed(session_id: str = Cookie(None)):
    raise HTTPException(status_code=501, detail="Not implemented")