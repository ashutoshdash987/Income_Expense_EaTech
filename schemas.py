from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str


class TransactionCreate(BaseModel):
    type: str
    amount: float
    category: str
    description: str | None = None


class TransactionOut(BaseModel):
    id: int
    type: str
    amount: float
    category: str
    description: str | None
    date: datetime

    class Config:
        orm_mode = True