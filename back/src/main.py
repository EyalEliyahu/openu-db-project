from fastapi import FastAPI

app = FastAPI()

try:
    import sqlalchemy as db
    from sqlalchemy import create_engine
    from sqlalchemy import *
    import pymysql

    print("all imported")

except:
    print("error in importing")


@app.get("/")
async def root():
    return {"message": "Hello World"}
