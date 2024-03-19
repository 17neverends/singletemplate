import json
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, JSONResponse
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

@app.get("/search_points", response_class=JSONResponse)
async def search_cities(query: str):
    cities_data = [
        "ул. Расковой, 10с4, 103 1-й Ботанический пр., 5",
        "ул. Автозаводский 3-й проезд, 4",
        "ул. Лермонтовский пр-т., 6 Нагатинская набережная, 54",
        "ул. Куусинена, 11, корп. 3"
    ]
    starts_with_query = []
    for city_data in cities_data:
        if query.lower() in city_data.lower():
            starts_with_query.append(city_data)
            if len(starts_with_query) == 5:
                break
    return JSONResponse(content={"data": starts_with_query})

@app.get("/search_cities", response_class=JSONResponse)
async def search_cities(query: str):
    cities_data = ["Москва, Россия, 400", "Рязань, Россия, 200", "Краснодар, Россия, 800"]
    starts_with_query = []
    for city_data in cities_data:
        if city_data.lower().startswith(query.lower()):
            starts_with_query.append(city_data)
            if len(starts_with_query) == 5:
                break
    return JSONResponse(content={"data": starts_with_query})


@app.get("/boxes", response_class=JSONResponse)
async def get_boxes():
    with open('boxes.json', 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
    return JSONResponse(content=data)


@app.get("/contracts", response_class=JSONResponse)
async def get_contracts():
    return JSONResponse(content={"contracts": ["111", "222", "333"]})

@app.post("/get_data")
async def get_data( data: str = Form(...)):
    print(data)
    return {"message": "Data received successfully"}
