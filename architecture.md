# System Architecture

```mermaid
graph LR
    User((User))
    NextJS[Next.js 16 (Frontend)]
    FastAPI[FastAPI (Backend)]
    PostgreSQL[PostgreSQL 18 (Database)]

    User-->|HTTP(S) Requests|NextJS
    NextJS-->|API Calls|FastAPI
    FastAPI-->|SQL Queries|PostgreSQL
```
