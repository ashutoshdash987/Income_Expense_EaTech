from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas, auth
from fastapi.security import HTTPBearer
from auth import get_current_user
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import FastAPI
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        hashed = auth.hash_password(user.password)
        print("HASHED:", hashed)
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(500, str(e))

    new_user = models.User(
        email=user.email,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    return {"message": "User created"}

@app.post("/auth/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(401, "Invalid credentials")

    token = auth.create_token({"user_id": db_user.id})
    return {"access_token": token}


security = HTTPBearer()



@app.post("/transactions")
def create_transaction(
    transaction: schemas.TransactionCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user = get_current_user(token, db)

    new_txn = models.Transaction(
        user_id=user.id,
        type=transaction.type,
        amount=transaction.amount,
        category=transaction.category,
        description=transaction.description
    )

    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)

    return new_txn


@app.get("/transactions")
def get_transactions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user = get_current_user(token, db)

    txns = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).all()
    return txns

@app.put("/transactions/{id}")
def update_transaction(
    id: int,
    transaction: schemas.TransactionCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user = get_current_user(token, db)

    txn = db.query(models.Transaction).filter(
        models.Transaction.id == id,
        models.Transaction.user_id == user.id
    ).first()

    if not txn:
        raise HTTPException(404, "Not found")

    txn.type = transaction.type
    txn.amount = transaction.amount
    txn.category = transaction.category
    txn.description = transaction.description

    db.commit()
    return txn

@app.delete("/transactions/{id}")
def delete_transaction(
    id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user = get_current_user(token, db)

    txn = db.query(models.Transaction).filter(
        models.Transaction.id == id,
        models.Transaction.user_id == user.id
    ).first()

    if not txn:
        raise HTTPException(404, "Not found")

    db.delete(txn)
    db.commit()

    return {"message": "Deleted"}

@app.get("/summary")
def get_summary(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    user = get_current_user(token, db)

    txns = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).all()

    total_income = sum(t.amount for t in txns if t.type == "income")
    total_expense = sum(t.amount for t in txns if t.type == "expense")

    category_breakdown = {}
    for t in txns:
        category_breakdown[t.category] = category_breakdown.get(t.category, 0) + t.amount

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
        "category_breakdown": category_breakdown
    }

