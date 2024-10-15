import os

# DATABASE_URL = os.getenv('DATABASE_SURVEY_URL')
DATABASE_URL = "postgresql+asyncpg://urodstvo:urodstvo@localhost:5433/urodstvo?sslmode=disable"
ENVIRONMENT = "development"