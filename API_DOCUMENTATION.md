# API Documentation - Finance CashFlow Application

## Base URL
```
http://localhost:5000/api
```

## Database Connection
- Host: 43.156.75.206
- Port: 3306
- Database: pewaca_dev
- User: pewaca_user

---

## API Endpoints

### 📊 Dashboard (All Data)

#### GET /api/dashboard
Get all financial data in one request including summary calculations.

**Response:**
```json
{
  "summary": {
    "totalCost": 1695000000,
    "totalIncome": 3600000000,
    "revenue": 3600000000,
    "resourceCost": 1212000000,
    "opexCost": 420000000,
    "capexCost": 195000000
  },
  "capex": [...],
  "opex": [...],
  "employees": [...],
  "revenue": {
    "streams": [...],
    "totalMonthly": 300000000,
    "totalYearly": 3600000000
  },
  "cashflow": [...]
}
```

---

### 💰 CAPEX (Capital Expenditure)

#### GET /api/capex
Get all CAPEX items

**Response:**
```json
[
  {
    "id": "uuid",
    "kategori": "Hardware",
    "item": "Server Dell PowerEdge",
    "description": "Production server",
    "qty": 2,
    "hargaSatuan": "50000000.00",
    "total": "100000000.00",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
]
```

#### POST /api/capex
Create new CAPEX item

**Request Body:**
```json
{
  "kategori": "Software",
  "item": "Adobe Creative Cloud",
  "description": "Design tools license",
  "qty": 5,
  "hargaSatuan": 8000000,
  "total": 40000000
}
```

#### DELETE /api/capex/:id
Delete CAPEX item by ID

---

### 📋 OPEX (Operational Expenditure)

#### GET /api/opex
Get all OPEX items

**Response:**
```json
[
  {
    "id": "uuid",
    "kategori": "Office",
    "item": "Sewa Kantor",
    "totalBulanan": "25000000.00",
    "totalTahunan": "300000000.00",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
]
```

#### POST /api/opex
Create new OPEX item

**Request Body:**
```json
{
  "kategori": "Marketing",
  "item": "Digital Advertising",
  "totalBulanan": 10000000,
  "totalTahunan": 120000000
}
```

#### DELETE /api/opex/:id
Delete OPEX item by ID

---

### 👥 Employees

#### GET /api/employees
Get all employees data

**Response:**
```json
[
  {
    "id": "uuid",
    "level": "Senior",
    "role": "Software Engineer",
    "qty": 3,
    "salaryMonth": "15000000.00",
    "totalSalaryMonth": "45000000.00",
    "totalSalaryYear": "540000000.00",
    "thrBenefit": "45000000.00",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
]
```

#### POST /api/employees
Create new employee record

**Request Body:**
```json
{
  "level": "Mid",
  "role": "Business Analyst",
  "qty": 2,
  "salaryMonth": 10000000,
  "totalSalaryMonth": 20000000,
  "totalSalaryYear": 240000000,
  "thrBenefit": 20000000
}
```

#### DELETE /api/employees/:id
Delete employee record by ID

---

### 💵 Revenue Streams

#### GET /api/revenue
Get all revenue streams

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Subscription Revenue",
    "monthly": "150000000.00",
    "yearly": "1800000000.00",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
]
```

#### POST /api/revenue
Create new revenue stream

**Request Body:**
```json
{
  "name": "API Integration Services",
  "monthly": 30000000,
  "yearly": 360000000
}
```

#### DELETE /api/revenue/:id
Delete revenue stream by ID

---

### 📈 Financial Summary

#### GET /api/summary
Get calculated financial summary

**Response:**
```json
{
  "totalCost": 1695000000,
  "totalIncome": 3600000000,
  "revenue": 3600000000,
  "resourceCost": 1212000000,
  "opexCost": 420000000,
  "capexCost": 195000000,
  "profit": 1905000000,
  "profitMargin": 52.92
}
```

---

### 📊 Cashflow Projections

#### GET /api/cashflow
Get all cashflow projections

**Response:**
```json
[
  {
    "id": "uuid",
    "year": 2025,
    "revenue": "3600000000.00",
    "cost": "1695000000.00",
    "netCashflow": "1905000000.00",
    "cumulativeCash": "1905000000.00",
    "baseRevenue": "3600000000.00",
    "baseCost": "1695000000.00",
    "revenueGrowth": "15.00",
    "costGrowth": "8.00",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
]
```

#### POST /api/cashflow/generate
Generate new cashflow projections

**Request Body:**
```json
{
  "baseRevenue": 3600000000,
  "baseCost": 1695000000,
  "revenueGrowth": 15,
  "costGrowth": 8,
  "years": 5
}
```

**Response:**
Array of generated projections for specified number of years

---

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200 OK` - Success
- `500 Internal Server Error` - Server or database error

---

## Notes

1. All decimal values in database are stored as DECIMAL(15, 2) for monetary values
2. All IDs are UUID (CHAR(36))
3. Timestamps are automatically managed by MySQL
4. All monetary values should be in Indonesian Rupiah (IDR)
5. Revenue growth and cost growth are percentages (e.g., 15 = 15%)

## Testing with cURL

### Get Dashboard Data
```bash
curl http://localhost:5000/api/dashboard
```

### Get CAPEX Data
```bash
curl http://localhost:5000/api/capex
```

### Create New CAPEX
```bash
curl -X POST http://localhost:5000/api/capex \
  -H "Content-Type: application/json" \
  -d '{"kategori":"Software","item":"Test Item","description":"Test","qty":1,"hargaSatuan":1000000,"total":1000000}'
```

### Generate Cashflow Projections
```bash
curl -X POST http://localhost:5000/api/cashflow/generate \
  -H "Content-Type: application/json" \
  -d '{"baseRevenue":3600000000,"baseCost":1695000000,"revenueGrowth":15,"costGrowth":8,"years":5}'
```
