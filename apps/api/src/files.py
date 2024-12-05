from io import BytesIO

from minio.error import S3Error
from fastapi import HTTPException

from config.variables import MINIO_URL

def upload_file(self, file) -> str:
        try:
            file_stream = BytesIO(file.file.read())
            self.minio_client.put_object(self.bucket_name, file.filename, file_stream, len(file_stream.getvalue()))


            return f"http://{MINIO_URL}/{self.bucket_name}/{file.filename}"
        except S3Error as e:
            raise HTTPException(status_code=500, detail=f"Error uploading file to MinIO: {e}")