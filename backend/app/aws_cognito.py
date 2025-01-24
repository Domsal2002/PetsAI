import boto3
import os
import hmac
import hashlib
import base64
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

COGNITO_REGION = os.getenv("COGNITO_REGION")
USER_POOL_ID = os.getenv("USER_POOL_ID")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

cognito_client = boto3.client("cognito-idp", region_name=COGNITO_REGION)

def compute_secret_hash(username: str):
    """
    Compute the Cognito SECRET_HASH based on the client secret and username.
    """
    if not CLIENT_SECRET:
        return None  # SecretHash is optional if not configured
    message = username + CLIENT_ID
    key = CLIENT_SECRET.encode()
    hmac_hash = hmac.new(key, message.encode(), hashlib.sha256).digest()
    return base64.b64encode(hmac_hash).decode()

def register_user(email: str, password: str):
    """
    Register a new user with AWS Cognito.
    """
    try:
        response = cognito_client.sign_up(
            ClientId=CLIENT_ID,
            Username=email,
            Password=password,
            SecretHash=compute_secret_hash(email),
            UserAttributes=[
                {"Name": "email", "Value": email},
            ],
        )
        return response
    except ClientError as e:
        raise Exception(f"Failed to register user: {e.response['Error']['Message']}")

def delete_cognito_user(cognito_user_id: str):
    """
    Delete a user from AWS Cognito by their user ID.
    """
    try:
        cognito_client.admin_delete_user(
            UserPoolId=USER_POOL_ID,
            Username=cognito_user_id,
        )
    except ClientError as e:
        raise Exception(f"Failed to delete user: {e.response['Error']['Message']}")

def authenticate_user(email: str, password: str):
    """
    Authenticate a user with AWS Cognito and retrieve tokens.
    """
    try:
        response = cognito_client.initiate_auth(
            ClientId=CLIENT_ID,
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": email,
                "PASSWORD": password,
                "SECRET_HASH": compute_secret_hash(email),
            },
        )
        return response["AuthenticationResult"]
    except ClientError as e:
        raise Exception(f"Failed to authenticate user: {e.response['Error']['Message']}")

def verify_user_email(cognito_user_id: str):
    """
    Mark a user's email as verified in AWS Cognito.
    """
    try:
        cognito_client.admin_update_user_attributes(
            UserPoolId=USER_POOL_ID,
            Username=cognito_user_id,
            UserAttributes=[
                {"Name": "email_verified", "Value": "true"},
            ],
        )
    except ClientError as e:
        raise Exception(f"Failed to verify email: {e.response['Error']['Message']}")

def resend_confirmation_code(email: str):
    """
    Resend the email confirmation code to the user.
    """
    try:
        cognito_client.resend_confirmation_code(
            ClientId=CLIENT_ID,
            Username=email,
            SecretHash=compute_secret_hash(email),
        )
    except ClientError as e:
        raise Exception(f"Failed to resend confirmation code: {e.response['Error']['Message']}")
