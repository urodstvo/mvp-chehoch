import logging

# получение пользовательского логгера и установка уровня логирования
logger = logging.getLogger("survey")
# py_logger.setLevel(logging.DEBUG)
logger.setLevel(logging.INFO)

# настройка обработчика и форматировщика в соответствии с нашими нуждами
py_handler = logging.StreamHandler()
# py_handler.setLevel(logging.DEBUG)
py_handler.setLevel(logging.INFO)
py_formatter = logging.Formatter("%(name)s %(asctime)s %(levelname)s %(message)s")

# добавление форматировщика к обработчику 
py_handler.setFormatter(py_formatter)
# добавление обработчика к логгеру
logger.addHandler(py_handler)

