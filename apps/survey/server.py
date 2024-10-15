from config.variables import ENVIRONMENT 
from config.logger import logger

import grpc
from concurrent import futures

from proto import survey_pb2_grpc
from src.service import SurveyServicer

from dotenv import load_dotenv

if __name__ == "__main__":
    if ENVIRONMENT == "development":
        load_dotenv("../../.env")


    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    survey_pb2_grpc.add_SurveyServicer_to_server(SurveyServicer(), server)
    logger.info("Starting Survey Service GRPC in port ::8001")
    server.add_insecure_port("[::]:8001")
    server.start()
    server.wait_for_termination()
    