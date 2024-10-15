<!-- prettier-ignore-start -->
## Сервис опросов


Последовательность команд для старта
```bash
cd apps/survey
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python -m grpc_tools.protoc -I ../../libs/grpc --python_out=proto --grpc_python_out=proto ../../libs/grpc/survey.proto
```


Старт проекта
```bash
python server.py
```
<!-- prettier-ignore-end -->
