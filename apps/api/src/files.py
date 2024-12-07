from io import BytesIO

from minio.error import S3Error
from fastapi import HTTPException
from src.clients import MinioClient

from config.variables import MINIO_URL

def upload_file(file) -> str:
        try:
            file_stream = file.file

            MinioClient.put_object(
                "chehoch",  # Имя бакета
                file.filename,  # Имя файла
                file_stream,  # Поток файла
                file_size=len(file_stream.read())  # Размер файла
            )


            return f"http://{MINIO_URL}/chehoch/{file.filename}"
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"Error uploading file to MinIO: {e}")