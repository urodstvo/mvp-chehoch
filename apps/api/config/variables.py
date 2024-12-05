import os
from dotenv import load_dotenv

ENVIRONMENT = "development"
if ENVIRONMENT == "development":
    load_dotenv("../../.env")  # take environment variables from .env.

MINIO_URL = os.getenv("MINIO_URL")
MINIO_ACCESS = os.getenv("MINIO_ACCESS")
MINIO_SECRET = os.getenv("MINIO_SECRET")

