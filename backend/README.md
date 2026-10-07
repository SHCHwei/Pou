# Backend

FastAPI application using MongoDB through PyMongo.

```text
app/
  config.py        Environment-based settings
  dependencies.py  Shared FastAPI dependencies
  routers/         HTTP endpoints
  schemas/         Pydantic request and response schemas
  models/          MongoDB document type definitions
  services/        Business logic
  db.py            MongoDB client and database access
```

Run the unit tests from this directory:

```bash
python -m unittest discover -s tests
```
