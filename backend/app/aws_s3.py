import boto3
import os
from botocore.exceptions import NoCredentialsError, ClientError

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "petsaidev")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=AWS_REGION,
)

def upload_file_to_s3(file_path, s3_key):
    try:
        s3_client.upload_file(file_path, S3_BUCKET_NAME, s3_key)
        return f"s3://{S3_BUCKET_NAME}/{s3_key}"
    except NoCredentialsError:
        raise Exception("AWS credentials not found")
    except ClientError as e:
        raise Exception(f"Failed to upload file to S3: {e.response['Error']['Message']}")

def generate_presigned_url(s3_key, expiration=3600):
    print("Generating presigned URL")
    try:
        return s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET_NAME, "Key": s3_key},
            ExpiresIn=expiration,
        )
    except ClientError as e:
        raise Exception(f"Failed to generate presigned URL: {e.response['Error']['Message']}")
