from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import yfinance as yf

app = FastAPI()
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/stock/{symbol}")
def get_stock_data(symbol: str):
    stock = yf.Ticker(symbol)
    hist = stock.history(period="1mo", interval="1d")
    if hist.empty:
        raise HTTPException(status_code=404, detail="Stock symbol not found")
    return hist.to_dict()