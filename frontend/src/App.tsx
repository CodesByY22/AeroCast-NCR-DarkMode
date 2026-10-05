import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import OverviewPage from './pages/OverviewPage'
import ForecastPage from './pages/ForecastPage'
import MapPage from './pages/MapPage'
import AtmospherePage from './pages/AtmospherePage'
import StubblePage from './pages/StubblePage'
import ExplainabilityPage from './pages/ExplainabilityPage'
import AlertsPage from './pages/AlertsPage'
import ValidationPage from './pages/ValidationPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import {
  fetch72hForecast, fetchDiagnostics, fetchStubbleRisk, fetchValidationMetrics, fetchAlertsHistory, fetchWrfStub,
  ForecastData, DiagnosticData, StubbleRiskData, ValidationMetricsData, AlertsHistoryData, WrfStubData
} from './api/client'

export default function App() {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null)
  const [risk, setRisk] = useState<StubbleRiskData | null>(null)
  const [validation, setValidation] = useState<ValidationMetricsData | null>(null)
  const [alerts, setAlerts] = useState<AlertsHistoryData | null>(null)
  const [wrfStub, setWrfStub] = useState<WrfStubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWrfModal, setShowWrfModal] = useState(false)

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [fData, dData, rData, vData, aData, wData] = await Promise.all([
        fetch72hForecast(),
        fetchDiagnostics(),
        fetchStubbleRisk(),
        fetchValidationMetrics(),
        fetchAlertsHistory(),
        fetchWrfStub()
      ])
      setForecast(fData)
      setDiagnostics(dData)
      setRisk(rData)
      setValidation(vData)
      setAlerts(aData)
      setWrfStub(wData)
    } catch (e) {
      console.error('Failed to load application data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#060c1a] text-[#f8fafc]">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onRefresh={loadAllData}
            loading={loading}
            onOpenWrfModal={() => setShowWrfModal(true)}
          />

          <main className="flex-1 overflow-y-auto bg-[#060c1a] relative">
            <Routes>
              <Route path="/" element={<OverviewPage forecast={forecast} diagnostics={diagnostics} risk={risk} loading={loading} />} />
              <Route path="/forecast" element={<ForecastPage forecast={forecast} loading={loading} />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/atmosphere" element={<AtmospherePage diagnostics={diagnostics} loading={loading} />} />
              <Route path="/stubble" element={<StubblePage risk={risk} loading={loading} />} />
              <Route path="/explainability" element={<ExplainabilityPage diagnostics={diagnostics} loading={loading} />} />
              <Route path="/alerts" element={<AlertsPage alerts={alerts} loading={loading} />} />
              <Route path="/validation" element={<ValidationPage validation={validation} loading={loading} />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
            </Routes>
          </main>

          <footer className="py-4 px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#94a3b8] bg-[#081023] shrink-0 gap-2 border-t border-[#1e2d54]">
            <span>AeroCast NCR · Air Pollution-Weather Intelligence Platform</span>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="hover:text-[#00d2fe] transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-[#00d2fe] transition-colors">Privacy Policy</Link>
              <a href="https://github.com/CodesByY22/AeroCast-NCR" target="_blank" rel="noreferrer" className="hover:text-[#00d2fe] transition-colors">GitHub</a>
            </div>
          </footer>
        </div>

        {/* WRF-Chem Modal */}
        {showWrfModal && wrfStub && (
          <div className="fixed inset-0 bg-[#040814]/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-[#0d172e] border border-[#1e2d54] rounded-2xl max-w-lg w-full p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-start">
                <h3 className="text-[16px] font-bold text-[#f8fafc] tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d2fe]"></span>
                  Operational WRF-Chem Connector Contract
                </h3>
                <button onClick={() => setShowWrfModal(false)} className="text-[#94a3b8] hover:text-[#f8fafc] text-2xl p-1 leading-none">&times;</button>
              </div>
              <div className="bg-[#081023] rounded-xl p-5 font-mono text-[12px] text-[#f8fafc] space-y-2 border border-[#1e2d54]">
                <div><span className="text-[#38bdf8] font-medium">Status:</span> {wrfStub.status}</div>
                <div><span className="text-[#f97316] font-medium">Notice:</span> {wrfStub.notice}</div>
                <div><span className="text-[#10b981] font-medium">Target Resolution:</span> {wrfStub.target_resolution}</div>
                <div><span className="text-[#94a3b8] font-medium">Benchmark:</span> {wrfStub.benchmark_reference}</div>
              </div>
              <p className="text-[12px] text-[#94a3b8] leading-relaxed">
                This research stub satisfies the hard constraint: AeroCast NCR does not fake 3D atmospheric chemistry runs, exposing a clean API contract for operational WRF-Chem HPC coupling post-MVP.
              </p>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
}
