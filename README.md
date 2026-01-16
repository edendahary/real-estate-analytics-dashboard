# Real Estate Analytics Dashboard

Interactive dashboard for analyzing real estate KPIs by ZIP code.  
Includes dynamic charts, advanced data table, filters, and KPI summaries.

---

## ✨ Features

- 📊 Interactive charts – choose X/Y metrics dynamically  
- 🧮 KPI cards – averages based on all data or selected rows  
- 🗂 Advanced data table (AG Grid)  
  - Sorting, filtering, multi-row selection  
  - Trend indicators with Material UI icons  
- 🎯 Cross interaction  
  - Selecting rows updates KPIs & charts  
  - Clicking a point in a chart focuses the row in the table  
- 🏷 Active filters panel – view, remove, or clear filters  
- 🎨 Material UI design system  
- 🐳 Dockerized – easy setup with Docker Compose  

---

## 🛠 Tech Stack

- Frontend: React + TypeScript  
- UI: Material UI (MUI)  
- Charts: Recharts  
- Table: AG Grid  
- Build Tool: Vite  
- Containerization: Docker + Docker Compose  

---

## ▶️ Run with Docker

### Requirements

- Docker Desktop installed and running

### Run the project

```bash
docker compose up --build

