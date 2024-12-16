import os
from dotenv import load_dotenv

ENVIRONMENT = "development"
if ENVIRONMENT == "development":
    load_dotenv("../../.env")

DATABASE_URL = "postgresql" + os.getenv('DATABASE_URL')[8:]
# DATABASE_URL = "postgresql+asyncpg://urodstvo:urodstvo@localhost:5433/urodstvo?sslmode=disable"