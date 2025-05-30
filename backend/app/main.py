from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routes import auth, petprofiles, users, confirmuser, generate_images, fetch_images, training
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize the rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize the FastAPI app
app = FastAPI()

# Attach the limiter to the app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*", "Post"],  # Allow all HTTP methods
    allow_headers=["Authorization", "Content-Type", "Set-Cookie"],  # Allow all headers
)

# Include routers
app.include_router(auth.router)
app.include_router(petprofiles.router)
app.include_router(users.router)
app.include_router(confirmuser.router)
app.include_router(generate_images.router)
app.include_router(fetch_images.router)
app.include_router(training.router)