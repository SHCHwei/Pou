
# 簡介

## 啟用

下載後可透過 docker compose up 啟用環境、專案

前端入口 http://localhost:8080

後端URL http://localhost:8000



## 架構

### 後端

```
backend/  
├── app/  
│   ├── __init__.py  
│   ├── main.py            # 應用程式入口  
│   ├── config.py          # 設定（環境變數）  
│   ├── dependencies.py    # 共用依賴（DB session、驗證等）  
│   ├── routers/           # 路由層（只處理 HTTP）  
│   ├── schemas/           # Pydantic 模型（請求/回應格式）  
│   ├── models/            # 資料庫模型（SQLAlchemy）  
│   ├── services/          # 商業邏輯  
│   └── db.py              # 資料庫連線  
└── tests/  
```
### 前端

```
frontend/  
```
### mongoDB migrate

```
mongodb/  
└── init/  
    ├── 01-collection.js  
    └── 02-seed.js
```
