@echo off

set "script_dir=%~dp0"
set "current_dir=%CD%"

if /I "%current_dir%\" NEQ "%script_dir%" (
    echo Этот скрипт должен быть выполнен из директории %script_dir%!
    exit /b
)

echo [1/3] Creating files...
IF NOT EXIST ".\libs\grpc\__generated__" (   
    mkdir ".\libs\grpc\__generated__"
) 
IF NOT EXIST ".\apps\survey\__generated__" (   
    mkdir ".\apps\survey\__generated__"
) 
IF NOT EXIST ".\apps\api\__generated__" (   
    mkdir ".\apps\api\__generated__"
) 


echo [2/3] Creating venv...
IF NOT EXIST ".\apps\survey\venv" ( 
    cd %current_dir% && cd .\apps\survey && (
        python -m venv venv
        call .\venv\Scripts\activate.bat
        pip install -r requirements.txt
        call .\venv\Scripts\deactivate.bat
    )
)

IF NOT EXIST ".\apps\api\venv" ( 
    cd %current_dir% && cd .\apps\api && (
        python -m venv venv
        call .\venv\Scripts\activate.bat
        pip install -r requirements.txt
        call .\venv\Scripts\deactivate.bat
    )
)

echo [3/3] Generating proto...
cd %current_dir% && (
    call .\apps\survey\venv\Scripts\activate.bat
    python -m grpc_tools.protoc -I .\libs\grpc --python_out=.\apps\survey --grpc_python_out=.\apps\survey .\libs\grpc\survey.proto
    python -m grpc_tools.protoc -I .\libs\grpc --python_out=.\apps\api --grpc_python_out=.\apps\api .\libs\grpc\survey.proto
    python -m grpc_tools.protoc -I .\libs\grpc --go_out=.\libs\grpc\__generated__ --go-grpc_out=.\libs\grpc\__generated__ .\libs\grpc\auth.proto
    python -m grpc_tools.protoc -I .\libs\grpc --python_out=.\apps\api --grpc_python_out=.\apps\api .\libs\grpc\auth.proto
    call .\apps\survey\venv\Scripts\deactivate.bat
)

COPY .\libs\grpc\__generated__\proto .\libs\grpc\__generated__
rmdir .\libs\grpc\__generated__\proto /s /q

echo Competed!