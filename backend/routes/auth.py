from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from backend import models, utils, schemas, config
from backend.database import SessionLocal
from datetime import timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.status != "active":
        raise HTTPException(status_code=403, detail="User is registered but not activated")
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": user.email, "token_version": user.token_version},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

if config.ENABLE_PASSWORD_RESET:

    @router.post("/reset-password")
    def reset_password(email: str, db: Session = Depends(get_db)):
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        token = utils.create_access_token(data={"sub": user.email})

        from backend.send_email import send_reset_email
        send_reset_email(email=user.email, token=token)
        return {"detail": "Password reset email sent"} 