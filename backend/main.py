from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.database import SessionLocal, engine, Base
from backend.routes import users, auth
from backend import config, utils, models

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.on_event("startup")
def create_admin_user():
    db = SessionLocal()
    admin_user = db.query(models.User).filter(models.User.email == config.ADMIN_EMAIL).first()
    if not admin_user:
        hashed_password = utils.get_password_hash(config.ADMIN_PASSWORD)
        new_user = models.User(
            name="Admin",
            email=config.ADMIN_EMAIL,
            hashed_password=hashed_password,
            status="active",
            role="admin",
            token_version=0
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print("Created admin user")
    else:
        print("Admin user already exists")
    db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.APP_URL],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/v1/users")
app.include_router(auth.router, prefix="/v1/auth")