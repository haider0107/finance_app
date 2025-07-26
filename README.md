# 📈 Portfolio Overview

A stock portfolio dashboard built with **Next.js**, providing key financial insights using data scraped from **Google Finance** and fetched from **Yahoo Finance**.

This project showcases:
- Live **Current Market Price (CMP)** from Yahoo Finance
- Financial metrics like **P/E Ratio** and **EPS** scraped via Puppeteer from Google Finance
- Responsive and clean UI using **Material-UI (MUI)**
- **LRU caching** to improve performance and reduce unnecessary requests
- Auto-refreshing CMP every 15 seconds for real-time updates

---

## 🧰 Tech Stack

- **Next.js (App Router)**
- **Puppeteer** for scraping Google Finance
- **[yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)** for fetching CMP data
- **Material UI (MUI v5)** for layout and design
- **LRU Cache** for in-memory caching of scraped data

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/portfolio-overview.git
cd portfolio-overview

```

### 2\. Install Dependencies

```bash
npm install

```

### 3\. Run the Development Server

```bash
npm run dev

````

Visit: [http://localhost:3000](http://localhost:3000)
