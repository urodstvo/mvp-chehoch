import uvicorn
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from src.clients import MinioClient

app = FastAPI(title="SERVICE", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    bucket_name = "chehoch"
    if not MinioClient.bucket_exists(bucket_name): MinioClient.make_bucket(bucket_name)

    uvicorn.run("server:app", host="0.0.0.0", port=8000)