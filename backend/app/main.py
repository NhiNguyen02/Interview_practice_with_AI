from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from . import auth, models, schemas
from .auth import login_for_access_token, get_current_active_user
from .database import Base, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(auth.get_db)):
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/token", response_model=schemas.Token)
async def login(
    form_data: auth.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(auth.get_db)
):
    return await login_for_access_token(form_data=form_data, db=db)


@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user
