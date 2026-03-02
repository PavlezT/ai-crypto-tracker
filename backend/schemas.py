from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID
from typing import Optional


# Auth Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"


# User Schemas
class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# Watchlist Schemas
class WatchlistItemCreate(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=32)


class WatchlistItemResponse(BaseModel):
    id: UUID
    symbol: str
    created_at: datetime

    class Config:
        from_attributes = True


class WatchlistResponse(BaseModel):
    items: list[WatchlistItemResponse]
    count: int

    class Config:
        from_attributes = True
