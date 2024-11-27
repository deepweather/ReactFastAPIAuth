from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, schemas, utils, config
from backend.database import SessionLocal
from typing import List
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/token")

def get_current_admin_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"}
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
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

@router.post("/activate-user/{user_id}", response_model=schemas.UserInDB)
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.status = "active"
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/pending-users", response_model=List[schemas.UserOut])
def get_pending_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    pending_users = db.query(models.User).filter(models.User.status != 'active').all()
    return pending_users

@router.post("/create-user", response_model=schemas.UserInDB)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = utils.get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        status="active",  # Directly activate the user
        role=user.role or "user",  # Default role is 'user' if not provided
        token_version=0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/update-user/{user_id}", response_model=schemas.UserInDB)
def update_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    # Update fields if they are provided
    if user.name is not None:
        db_user.name = user.name
    if user.email is not None:
        # Check if the new email already exists
        existing_user = db.query(models.User).filter(models.User.email == user.email).first()
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user.email = user.email
    if user.password is not None:
        db_user.hashed_password = utils.get_password_hash(user.password)
    if user.status is not None:
        db_user.status = user.status
    if user.role is not None:
        db_user.role = user.role
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/delete-user/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted successfully"}

@router.get("/users", response_model=List[int])
def get_all_user_ids(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    user_ids = db.query(models.User.id).all()
    return [id_tuple[0] for id_tuple in user_ids]

@router.get("/users/{user_id}", response_model=schemas.UserInDB)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user