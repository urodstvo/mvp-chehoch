import sys
import grpc
from minio import Minio
from config.variables import MINIO_URL, MINIO_SECRET, MINIO_ACCESS

import auth_pb2_grpc as auth_service
import survey_pb2_grpc as survey_service


AuthServiceClient = None
SurveyServiceClient = None

_auth_channel = grpc.insecure_channel("auth:8002")
_survey_channel = grpc.insecure_channel("survey:8001")
try:
    grpc.channel_ready_future(_auth_channel).result(timeout=10)
    grpc.channel_ready_future(_survey_channel).result(timeout=10)
except grpc.FutureTimeoutError:
    sys.exit('Error connecting to server')
else:
    AuthServiceClient = auth_service.AuthStub(_auth_channel)
    SurveyServiceClient = survey_service.SurveyServiceStub(_survey_channel)

MinioClient = Minio(
    MINIO_URL,
    secure=False,
    access_key=MINIO_ACCESS,
    secret_key=MINIO_SECRET
)