import survey_pb2_grpc
from src.grpc_impl.surveys import *
from src.grpc_impl.tags import *


class SurveyService(survey_pb2_grpc.SurveyServiceServicer):
    """Сервис опросов"""

    def CreateSurvey(self, request, context):
        return CreateSurvey(request, context)
    
    def UpdateSurvey(self, request, context):
        return UpdateSurvey(request, context)
    
    def DeleteSurvey(self, request, context):
        return DeleteSurvey(request, context)
    
    def GetSurveys(self, request, context):
        return GetSurveys(request, context)
    
    def GetSurvey(self, request, context):
        return GetSurvey(request, context)
    
    def GetOrganisationSurveys(self, request, context):
        return GetOrganisationSurveys(request, context)
    
    def GetCompletedSurveys(self, request, context):
        return GetCompletedSurveys(request, context)
    
    def CompleteSurvey(self, request, context):
        return CompleteSurvey(request, context)
    
    def GetSurveyTags(self, request, context):
        return GetSurveyTags(request, context)
    
    def AddTagsToSurvey(self, request, context):
        return AddTagsToSurvey(request, context)
    
    def DeleteTagsFromSurvey(self, request, context):
        return DeleteTagsFromSurvey(request, context)
    