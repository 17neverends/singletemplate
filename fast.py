from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
def tarifs():
    return HTMLResponse(
        content=open(
            "static/index.html", "r", encoding="utf-8"
        ).read()
    )

