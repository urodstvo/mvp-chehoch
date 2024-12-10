import survey_pb2_grpc
from src.grpc_impl.surveys import *
from src.grpc_impl.tags import *
from src.grpc_impl.questions import *
from src.grpc_impl.answers import *
from src.grpc_impl.answer_variants import *
from src.grpc_impl.files import *


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
    
    def CreateQuestion(self, request, context):
        return CreateQuestion(request, context)
    
    def UpdateQuestion(self, request, context):
        return UpdateQuestion(request, context)
    
    def DeleteQuestion(self, request, context):
        return DeleteQuestion(request, context)
    
    def GetSurveyQuestions(self, request, context):
        return GetSurveyQuestions(request, context)
    
    def CompleteQuestion(self, request, context):
        return CompleteQuestion(request, context)
    
    def GetQuestionAnswers(self, request, context):
        return GetQuestionAnswers(request, context)
    
    def UpdateAnswerVariant(self, request, context):
        return UpdateAnswerVariant(request, context)
    
    def GetQuestionAnswerVariants(self, request, context):
        return GetQuestionAnswerVariants(request, context)
    
    def DeleteAnswerVariant(self, request, context):
        return DeleteAnswerVariant(request, context)
    
    def GetSurveyReport(self, request, context):
        return GetSurveyReport(request, context)

    def GetFile(self, request, context):
        return GetFile(request, context)
    
    def CreateFile(self, request, context):
        return CreateFile(request, context)
    
    def DeleteFile(self, request, context):
        return DeleteFile(request, context)
    
    def DeleteQuestionImage(self, request, context):
        return DeleteQuestionImage(request, context)
    
    def GetSurveysWithTagsIds(self, request, context):
        return GetSurveysWithTagsIds(request, context)
    
    def GetAllTags(self, request, context):
        return GetAllTags(request, context)