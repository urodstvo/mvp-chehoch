import uvicorn
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from src.clients import MinioClient

from src.http.routes.auth.auth import router as auth_router
from src.http.routes.survey.survey import router as survey_router
from src.http.routes.question.question import router as question_router
from src.http.routes.answer.answer import router as answer_router
from src.http.routes.answer_variant.answer_variant import router as answer_variant_router
from src.http.routes.tag.tag import router as tag_router
from src.http.routes.organisation.organisation import router as organisation_router
from src.http.routes.user.user import router as user_router

app = FastAPI(title="SERVICE", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(survey_router)
app.include_router(question_router)
app.include_router(answer_router)
app.include_router(answer_variant_router)
app.include_router(tag_router)
app.include_router(organisation_router)
app.include_router(user_router)

if __name__ == "__main__":
    bucket_name = "chehoch"
    if not MinioClient.bucket_exists(bucket_name): MinioClient.make_bucket(bucket_name)

    uvicorn.run("server:app", host="0.0.0.0", port=8000)