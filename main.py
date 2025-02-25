from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import yfinance as yf
import ollama

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
    formatted_data = {
        'open': hist['Open'].values.tolist(),
        'close': hist['Close'].values.tolist(),
        'high': hist['High'].values.tolist(),
        'low': hist['Low'].values.tolist(),
        'volume': hist['Volume'].values.tolist()
    }
    return formatted_data

@app.get("/api/models")
def get_models():
    try:
        models = ollama.list()
        return models
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_stock")
def analyze_stock(symbol: str, model: str):
    stock_data = get_stock_data(symbol)
    prompt = f"""Analyze the following stock data:
    Current data for {symbol}: {stock_data}

    Please provide a detailed analysis including:
    1. Overall Market Trend:
    - Current trend (bullish/bearish/neutral)
    - Price range and volatility

    2. Technical Analysis:
    - Key support and resistance levels
    - Price patterns and formations
    - Volume analysis and trends

    3. Key Observations:
    - Notable price movements
    - Volume spikes or unusual patterns
    - Market sentiment indicators

    4. Trading Recommendation:
    - Short-term outlook (1-5 days)
    - Suggested entry/exit points
    - Risk considerations

    Base your analysis on the provided data and maintain a professional, analytical approach."""

    response = ollama.chat(model=model, messages=[{
        "role": "user",
        "content": prompt
    }])
    return {"response": response["message"]["content"]}