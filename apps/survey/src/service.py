from libs.grpc.__generated__ import survey_pb2_grpc

class SurveyService(survey_pb2_grpc.SurveyServiceServicer):
    """Сервис опросов"""

    def CreateSurvey(self, request, context):
        return super().CreateSurvey(request, context)
    
    def UpdateSurvey(self, request, context):
        return super().UpdateSurvey(request, context)
    
    def DeleteSurvey(self, request, context):
        return super().DeleteSurvey(request, context)
    
    def GetSurveys(self, request, context):
        return super().GetSurveys(request, context)
    
    def GetSurvey(self, request, context):
        return super().GetSurvey(request, context)
    
    def GetOrganisationSurveys(self, request, context):
        return super().GetOrganisationSurveys(request, context)
    
    def GetCompletedSurveys(self, request, context):
        return super().GetCompletedSurveys(request, context)
    
    def CompleteSurvey(self, request, context):
        return super().CompleteSurvey(request, context)
    
    def AddTagsToSurvey(self, request, context):
        return super().AddTagsToSurvey(request, context)
    
    def DeleteTagsFromSurvey(self, request, context):
        return super().DeleteTagsFromSurvey(request, context)
    