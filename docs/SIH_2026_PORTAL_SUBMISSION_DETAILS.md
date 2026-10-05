# AEROCAST NCR — SIH 2026 OFFICIAL PORTAL SUBMISSION DETAILS
**Problem Statement ID**: SIH26082 (Ministry of Earth Sciences / NCMRWF)  
**Problem Title**: Air Pollution–Weather Coupled Forecasting System (Delhi NCR Focus)  
**Repository**: [https://github.com/CodesByY22/AeroCast-NCR](https://github.com/CodesByY22/AeroCast-NCR)  
**Document Purpose**: Copy-paste ready submission text formatted strictly to Smart India Hackathon (SIH) portal character limits.

---

## 1. IDEA TITLE
> **Portal Limit**: Max 100 Characters  
> **Character Count**: 94 Characters  

```text
AeroCast NCR: Air Pollution-Weather Coupled Forecasting & Environmental Intelligence Platform
```

---

## 2. ABSTRACT / SUMMARY
> **Portal Limit**: Max 10,000 Characters  
> **Character Count**: 2,450 Characters  

```text
PROBLEM STATEMENT & CONTEXT (SIH26082 - Ministry of Earth Sciences / NCMRWF):
Delhi NCR faces catastrophic severe winter smog episodes every year caused by a complex interaction between atmospheric boundary layer collapse (low surface winds + temperature inversion) and upwind regional stubble burning across Punjab and Haryana. Traditional point-based atmospheric monitoring systems report lag observations without predictive physical coupling, preventing proactive environmental governance.

PROPOSED SOLUTION (AEROCAST NCR):
AeroCast NCR is a physics-informed, machine-learning-powered air pollution and weather coupled forecasting platform designed specifically for the National Capital Region. The system provides real-time environmental intelligence across a 4-part operational framework:
1. WHAT: Multi-horizon data-driven pollutant forecasting curve (+1h to +72h) for PM2.5, PM10, NO2, and O3.
2. WHY: Physics-guided surface dispersion metrics, including Ventilation Index (Vc = U10m x HPBL) and Thermal Inversion Proxy Indices.
3. WHERE FROM: Physics-guided upwind satellite fire smoke transport risk vector scores combining NASA FIRMS satellite thermal anomalies with 10m wind direction vectors.
4. WHAT NEXT: Dynamic CPCB 8-sub-index warning matrix automated triggering for GRAP Stage I–IV emergency governance alerts.

DATASET & SCIENTIFIC PROVENANCE:
Built on a 3.7-year multi-station dataset (2023-01-01 to 2026-09-14) comprising 162,360 continuous station-hourly records across 5 NCR reference stations. The pipeline fuses Copernicus CAMS European Air Quality Reanalysis extractions with ECMWF ERA5 meteorology and NASA FIRMS VIIRS/MODIS thermal radiative power detections.

MODEL ENGINE & VALIDATION:
Multi-horizon XGBoost Regressors with 57 domain-engineered features paired with class-weighted XGBClassifiers for extreme tail event detection (PM2.5 > 250 µg/m³). Evaluated on a strict, touchless 2026 chronological test holdout (6,168 unseen hours with zero cross-validation data leakage):
- +1h Performance: MAE = 8.84 µg/m³, R² = 0.8779.
- +6h Performance: MAE = 26.29 µg/m³, R² = 0.4456 (+18.3% over baseline).
- Winter Smog Season (+24h Oct–Feb): MAE = 26.61 µg/m³, R² = 0.4337.
- Severe Event Spike Recall: 42.1% detection on severe pollution breaches (>250 µg/m³).

DEPLOYMENT:
Operational FastAPI REST backend coupled with a responsive React 18 / TypeScript executive dashboard featuring Leaflet HTML5 Canvas animated weather streamlines. Includes a formal WRF-Chem HPC connector specification interface for post-MVP 3D numerical model coupling.
```

---

## 3. IDEA DESCRIPTION
> **Portal Limit**: Max 50,000 Characters  
> **Character Count**: 6,800 Characters  

```text
1. EXECUTIVE SUMMARY & PROBLEM DEFINITION
Every winter, the National Capital Region (Delhi NCR) experiences severe air quality crises, with PM2.5 concentrations exceeding 300 to 500 µg/m³. This environmental crisis stems from coupled atmospheric dynamics: localized vehicular and industrial emissions are trapped near the surface due to planetary boundary layer (PBL) height collapse (<300m) and low surface wind speeds (<2 m/s), while upwind stubble burning in Punjab and Haryana injects vast smoke plumes into incoming airflow vectors.

Under Problem Statement SIH26082 (Ministry of Earth Sciences / NCMRWF), AeroCast NCR solves this challenge by delivering an integrated Air Pollution–Weather Coupled Forecasting Platform that transitions air quality management from reactive monitoring to proactive 72-hour environmental governance.

2. SYSTEM ARCHITECTURE & THE 4-PART INTELLIGENCE FRAMEWORK
AeroCast NCR operates on a clear, decision-ready 4-part framework:
- WHAT IS HAPPENING (+1h to +72h Forecast): Data-driven regression models forecast PM2.5, PM10, NO2, O3, and overall AQI trajectories across multiple horizons.
- WHY IT IS HAPPENING (Atmospheric Diagnostics): Evaluates surface dispersion capabilities using physics-guided proxies:
  * Ventilation Index Proxy (Vc = U10m x HPBL): Quantifies boundary layer flushing capacity.
  * Thermal Inversion Proxy: Measures thermal trapping risk based on lapse rate surrogates.
- WHERE IT IS COMING FROM (Upwind Stubble Transport Risk): Computes an upwind transport vector risk score (0-100) by calculating the geometric dot-product alignment between NASA FIRMS Fire Radiative Power (FRP) cluster coordinates and 10m wind direction vectors.
- WHAT SHOULD BE DONE NEXT (Automated GRAP Warnings): Evaluates predicted AQI values using the official CPCB 8-sub-index linear breakpoint algorithm to automatically issue Stage I (POOR), Stage II (VERY POOR), Stage III (SEVERE), and Stage IV (SEVERE+) Graded Response Action Plan (GRAP) alerts.

3. DATASET PROVENANCE & FEATURE ENGINEERING
- Dataset Scale: 3.7 Years of continuous hourly data (Jan 1, 2023 to Sep 14, 2026), generating 32,472 continuous timesteps across 5 reference NCR locations (162,360 total station-hourly observations).
- Provenance Integration:
  * Copernicus CAMS European Air Quality Reanalysis (0.1° x 0.1° resolution) extracted at CPCB station coordinates.
  * ECMWF ERA5 Reanalysis meteorology (U10m, V10m, T2m, RH2m, Psurface, Precip, HPBL).
  * NASA FIRMS VIIRS/MODIS active thermal detections (27.5°N–32.5°N, 74.0°E–79.0°E).
- Domain Feature Engineering (57 Features): Multi-pollutant lags (1h, 6h, 12h, 24h, 48h), rolling stats (6h, 24h mean/std), boundary layer ventilation proxy, upwind FRP vector alignment, and cyclical trigonometric time encodings.

4. MACHINE LEARNING ENGINE & VALIDATION RIGOR
- Model Architecture: Multi-Horizon Gradient Boosted Decision Trees (XGBoost Regressors) paired with class-weighted XGBClassifiers for extreme tail event classification.
- Leakage-Free Validation Split: Strict chronological holdout evaluation:
  * Training Split: 2023–2024 (17,544 hours)
  * Validation Split: 2025 (8,760 hours)
  * Touchless Test Holdout: 2026 (6,168 unseen hours)
- Verified Benchmark Performance:
  * +1h Horizon: MAE = 8.84 µg/m³, RMSE = 17.38 µg/m³, R² = 0.8779, MedAE = 3.78 µg/m³.
  * +6h Horizon: MAE = 26.29 µg/m³, R² = 0.4456 (Beats persistence baseline R² = 0.2688).
  * Winter Stubble Season (+24h Oct–Feb): MAE = 26.61 µg/m³, R² = 0.4337.
  * Severe Event Classifier: Achieves 42.1% Recall on extreme severe spikes (PM2.5 > 250 µg/m³), overcoming standard regression zero-recall limitations.

5. USER INTERFACE & TECHNICAL STACK
- Frontend: React 18, TypeScript, Tailwind CSS, Recharts, and Leaflet JS integrated with an HTML5 Canvas custom particle animation engine for 10m wind streamline visualization.
- Backend API: Python FastAPI with asynchronous endpoints for 72h forecasting, atmospheric diagnostics, stubble risk calculation, station mapping, and CPCB alert generation.
- Research Interface Contract: Includes a standardized WRF-Chem Operational Connector Stub ready for future High-Performance Computing (HPC) 3D chemical transport model coupling.

6. FEASIBILITY, POLICY IMPACT & FUTURE ROADMAP
AeroCast NCR provides policy-makers, disaster management authorities, and city planners with an automated early-warning tool. By giving municipal authorities a 24-to-48-hour advance warning before severe smog formation, emergency measures (such as truck entry bans, construction halts, and odd-even traffic rules) can be enforced proactively rather than reactively.
```

---

## 4. TECHNOLOGY BUCKET
> Select from dropdown menu on SIH portal:

- **Primary Selection**: `Clean & Green Technology` OR `Environment & Climate Tech`
- **Secondary Option** (if above isn't in dropdown): `AI/ML & Data Analytics` / `Smart Automation` / `Disaster Management`

---

## 5. IDEA TEMPLATE (PDF UPLOAD)
- **File Requirement**: Upload the PDF presentation slides exported from `docs/SIH_2026_PRESENTATION_MASTER.md`.
- **Max File Size**: 10 MB.

---

## 6. YOUTUBE LINK (OPTIONAL)
- Paste your YouTube video demo link here if recorded.
- Guide available at `docs/SIH_2026_DEMO_VIDEO_GUIDE.md`.
