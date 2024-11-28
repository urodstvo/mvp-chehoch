from libs.grpc.__generated__ import survey_pb2_grpc
import grpc_impl.surveys as surveys
import grpc_impl.tags as tags

class SurveyService(survey_pb2_grpc.SurveyServiceServicer):
    """Сервис опросов"""

    def CreateSurvey(self, request, context):
        return surveys.CreateSurvey(request, context)
    
    def UpdateSurvey(self, request, context):
        return surveys.UpdateSurvey(request, context)
    
    def DeleteSurvey(self, request, context):
        return surveys.DeleteSurvey(request, context)
    
    def GetSurveys(self, request, context):
        return surveys.GetSurveys(request, context)
    
    def GetSurvey(self, request, context):
        return surveys.GetSurvey(request, context)
    
    def GetOrganisationSurveys(self, request, context):
        return surveys.GetOrganisationSurveys(request, context)
    
    def GetCompletedSurveys(self, request, context):
        return surveys.GetCompletedSurveys(request, context)
    
    def CompleteSurvey(self, request, context):
        return surveys.CompleteSurvey(request, context)
    
    def AddTagsToSurvey(self, request, context):
        return tags.AddTagsToSurvey(request, context)
    
    def DeleteTagsFromSurvey(self, request, context):
        return tags.DeleteTagsFromSurvey(request, context)
    