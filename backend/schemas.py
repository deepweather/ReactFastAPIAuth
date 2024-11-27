from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    name: Optional[str] = None
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDB(UserBase):
    id: int
    status: str
    role: str
    token_version: int

    class Config:
        orm_mode = True

class TokenData(BaseModel):
    email: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str 

class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True 