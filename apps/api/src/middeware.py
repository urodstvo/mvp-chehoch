import grpc
from fastapi import Request, HTTPException
from fastapi.middleware import BaseHTTPMiddleware
from google.protobuf.empty_pb2 import Empty
from src.clients import AuthServiceClient

async def check_session(request: Request):
    # Extract session_id from cookies
    session_id = request.cookies.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=401, detail="Session ID missing")

    try:
        metadata = (("session_id", session_id),)
        response = AuthServiceClient.CheckSession(Empty(), metadata=metadata)
        
        if not response.valid:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        # Optionally refresh the session if needed
        AuthServiceClient.RefreshSession(Empty(), metadata=metadata)

    except grpc.RpcError as e:
        # Handle gRPC errors (e.g., server unavailable)
        raise HTTPException(status_code=500, detail=f"gRPC error: {e.details()}")