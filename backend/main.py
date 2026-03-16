from fastapi import FastAPI

app = FastAPI(title="GameVault API")

@app.get("/")
def root():
    return {"message": "GameVault API działa!"}