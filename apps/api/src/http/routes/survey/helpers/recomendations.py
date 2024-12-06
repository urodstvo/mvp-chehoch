from typing import List, Tuple
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from google.protobuf.empty_pb2 import Empty

from src.clients import SurveyServiceClient, AuthServiceClient

def get_user_tags(session_id: str) -> List[int]:
    response = AuthServiceClient.GetUserTags(Empty(), metadata=(("session_id", session_id),))

    return [tag.id for tag in response.tags] # Возвращаем список идентификаторов тегов, в которых участвовал пользователь

def get_all_surveys_and_tags() -> List[Tuple[int, int]]:
    response = SurveyServiceClient.GetSurveysWithTagsIds(Empty())

    survey_tags = []
    for survey_with_tag_id in response.survey_with_tag_ids:
        survey_tags.append((survey_with_tag_id.survey_id, survey_with_tag_id.tag_id))

    return survey_tags # Возвращаем все теги, связанные с опросами

def create_user_vector(user_tags: List[int], all_tags: List[int]):
    # Создаем бинарный вектор интересов пользователя
    user_vector = np.zeros(len(all_tags))
    for tag in user_tags:
        if tag in all_tags:
            user_vector[all_tags.index(tag)] = 1
    return user_vector

def create_survey_vectors(all_survey_tags: List[Tuple[int, int]], all_tags: List[int]):
    # Создаем векторные представления для опросов
    survey_vectors = {}
    for survey_id, tag_id in all_survey_tags:
        if survey_id not in survey_vectors:
            survey_vectors[survey_id] = np.zeros(len(all_tags))
        survey_vectors[survey_id][all_tags.index(tag_id)] = 1
   
    return survey_vectors

def get_survey_recommendations(session_id: str) -> List[Tuple[int, float]]:
    # Получаем теги пользователя
    user_tags = get_user_tags(session_id)

    # Получаем все теги и их идентификаторы
    all_tags = list(set(tag[1] for tag in get_all_surveys_and_tags()))

    # Создаем вектор интересов пользователя
    user_vector = create_user_vector(user_tags, all_tags)

    # Создаем векторные представления для всех опросов
    all_survey_tags = get_all_surveys_and_tags()
    survey_vectors = create_survey_vectors(all_survey_tags, all_tags)

    # Вычисляем схожесть между вектором пользователя и каждым опросом
    survey_ids = list(survey_vectors.keys())
    survey_vectors_matrix = np.array([survey_vectors[survey_id] for survey_id in survey_ids])

    similarities = cosine_similarity([user_vector], survey_vectors_matrix)[0]

    # Рекомендуем опросы с наибольшим сходством
    recommended_surveys = sorted(zip(survey_ids, similarities), key=lambda x: x[1], reverse=True)

    return recommended_surveys
