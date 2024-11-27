from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas, utils, config
from backend.database import SessionLocal
from typing import List
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        token_version_in_token = payload.get("token_version", 0)
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    if user.status != "active":
        raise HTTPException(status_code=403, detail="User is registered but not activated")
    if user.token_version != token_version_in_token:
        raise HTTPException(status_code=401, detail="Token has been invalidated")
    return user

# Create User
@router.post("/", response_model=schemas.UserInDB)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = utils.get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        status="pending"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Update User
@router.put("/{user_id}", response_model=schemas.UserInDB)
def update_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.name:
        db_user.name = user.name
    if user.email:
        db_user.email = user.email
    if user.password:
        db_user.hashed_password = utils.get_password_hash(user.password)
    db.commit()
    db.refresh(db_user)
    return db_user

# Delete User
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}

# Activate User
@router.post("/{user_id}/activate", response_model=schemas.UserInDB)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to activate users")
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.status = "active"
    db.commit()
    db.refresh(db_user)
    return db_user

# Protected Test Data Route
@router.get("/test-data")
def get_test_data(current_user: models.User = Depends(get_current_user)):
    return {"message": f"Hello, {current_user.name}! This is protected data."}

# Get Current User Profile
@router.get("/me", response_model=schemas.UserInDB)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Check if User is Logged In
@router.get("/is_logged_in")
def is_logged_in(current_user: models.User = Depends(get_current_user)):
    return {"logged_in": True}

# Logout Everywhere
@router.post("/logout")
def logout(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    current_user.token_version += 1  # Invalidate all tokens
    db.commit()
    db.refresh(current_user)
    return {"detail": "Logged out from all sessions"}
