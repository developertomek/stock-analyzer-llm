from fastapi import FastAPI, HTTPException
import yfinance as yf
import ollama
from typing import Optional

app = FastAPI(root_path="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock Analysis API!"}


@app.get("/instrument/{symbol}")
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


@app.get("/models")
def get_models():
    try:
        models = ollama.list()
        return models
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/instruments/analyze")
def analyze_stock(symbol: str, model: str):
    if not symbol:
        raise HTTPException(status_code=400, detail="Stock symbol is required")
    if not model:
        raise HTTPException(status_code=400, detail="Model is required")
    
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
    try:
        response = ollama.chat(model=model, messages=[{
            "role": "user",
            "content": prompt
        }])
        return {"response": response["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/instruments/popular")
def get_popular_instruments(limit: Optional[int] = 20):
    instruments = [
        {"name": "S&P 500", "symbol": "^GSPC", "type": "index", "region": "US"},
        {"name": "NASDAQ", "symbol": "^IXIC", "type": "index", "region": "US"},
        {"name": "DAX", "symbol": "^GDAXI", "type": "index", "region": "Germany"},
        
        {"name": "Apple", "symbol": "AAPL", "type": "stock", "sector": "Technology"},
        {"name": "Microsoft", "symbol": "MSFT", "type": "stock", "sector": "Technology"},
        {"name": "Amazon", "symbol": "AMZN", "type": "stock", "sector": "Consumer Cyclical"},
        {"name": "Meta", "symbol": "META", "type": "stock", "sector": "Technology"},
        {"name": "Netflix", "symbol": "NFLX", "type": "stock", "sector": "Communication Services"},
        {"name": "Alphabet", "symbol": "GOOGL", "type": "stock", "sector": "Technology"},
        
        {"name": "Gold", "symbol": "GC=F", "type": "commodity", "category": "Precious Metal"},
    ]
    
    result = []
    
    for instrument in instruments[:limit]:
        try:
            ticker = yf.Ticker(instrument["symbol"])
            
            data = ticker.history(period="2d")
            if len(data) >= 2:
                latest = data.iloc[-1]
                previous = data.iloc[-2]
                
                price_change = latest["Close"] - previous["Close"]
                price_change_pct = (price_change / previous["Close"]) * 100
                
                info = ticker.info
                
                item = {
                    "name": instrument["name"],
                    "description": info.get("longBusinessSummary", "No description available"),
                    "symbol": instrument["symbol"],
                    "type": instrument["type"],
                    "current_price": round(latest["Close"], 2),
                    "change": round(price_change, 2),
                    "change_percent": round(price_change_pct, 2),
                    "volume": int(latest["Volume"]),
                }
                
                if instrument["type"] == "stock":
                    item["sector"] = instrument.get("sector", "")
                elif instrument["type"] == "index":
                    item["region"] = instrument.get("region", "")
                elif instrument["type"] == "etf" or instrument["type"] == "crypto" or instrument["type"] == "commodity":
                    item["category"] = instrument.get("category", "")
                
                result.append(item)
            else:
                result.append({
                    **instrument,
                    "current_price": None,
                    "change": None,
                    "change_percent": None,
                    "volume": None,
                    "error": "No recent data available"
                })
                
        except Exception as e:
            result.append({
                **instrument,
                # "error": str(e)
            })
    
    return {
        "popular_instruments": result,
        "count": len(result),
        "types": list(set(item["type"] for item in result))
    }