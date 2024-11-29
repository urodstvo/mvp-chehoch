from config.logger import logger

import grpc
from concurrent import futures

import survey_pb2_grpc as survey_service
from src.service import SurveyService


if __name__ == "__main__":
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    survey_service.add_SurveyServiceServicer_to_server(SurveyService(), server)
    logger.info("Starting Survey Service GRPC in port ::8001")
    server.add_insecure_port("[::]:8001")
    server.start()
    server.wait_for_termination()
    