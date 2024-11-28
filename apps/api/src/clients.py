import sys
import grpc

from libs.grpc.__generated__  import auth_pb2_grpc as auth_service
from libs.grpc.__generated__  import survey_pb2_grpc as survey_service


AuthServiceClient = None
SurveyServiceClient = None

_auth_channel = grpc.insecure_channel("localhost:8002")
_survey_channel = grpc.insecure_channel("localhost:8001")
try:
    grpc.channel_ready_future(_auth_channel).result(timeout=10)
    grpc.channel_ready_future(_survey_channel).result(timeout=10)
except grpc.FutureTimeoutError:
    sys.exit('Error connecting to server')
else:
    AuthServiceClient = auth_service.AuthStub(_auth_channel)
    SurveyServiceClient = survey_service.SurveyServiceStub(_survey_channel)