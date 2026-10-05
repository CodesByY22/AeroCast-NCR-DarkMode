import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  CheckIcon as CheckSquareIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

import {
  fetchMapStations,
  fetchDiagnostics,
  fetchStubbleRisk,
  MapStationsData,
  DiagnosticData,
  StubbleRiskData,
  FALLBACK_MAP_STATIONS
} from '../api/client'
import { getBadgeStyle, getContrastTextColor, getAQIColor } from '../utils/colors'

// Delhi NCR Center Coordinates
const NCR_CENTER: [number, number] = [28.6139, 77.2090]
const DEFAULT_ZOOM = 9.5

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

interface CanvasWindProps {
  active: boolean
  windSpeed: number
  windDirDeg: number
  animSpeedFactor: number
}

function CanvasWindStreamlineLayer({
  active,
  windSpeed,
  windDirDeg,
  animSpeedFactor
}: CanvasWindProps) {
  const map = useMap()

  useEffect(() => {
    if (!active) return

    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '400'

    const container = map.getPanes().overlayPane
    container.appendChild(canvas)

    let animationFrameId: number

    const resizeCanvas = () => {
      const size = map.getSize()
      canvas.width = size.x
      canvas.height = size.y
    }
    resizeCanvas()

    const rad = (windDirDeg * Math.PI) / 180
    const vx = Math.sin(rad) * windSpeed * 0.9 * animSpeedFactor
    const vy = -Math.cos(rad) * windSpeed * 0.9 * animSpeedFactor

    const particlesCount = 130
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 30 + 15,
      life: Math.random() * 100
    }))

    const render = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mapPos = L.DomUtil.getPosition(map.getPanes().mapPane)
      canvas.style.transform = `translate3d(${-mapPos.x}px, ${-mapPos.y}px, 0px)`

      ctx.lineWidth = 2.0
      ctx.strokeStyle = 'rgba(0, 210, 254, 0.65)'

      particles.forEach(p => {
        p.x += vx
        p.y += vy
        p.life += 1

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life > 120) {
          p.x = Math.random() * canvas.width
          p.y = Math.random() * canvas.height
          p.life = 0
        }

        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - vx * (p.length / 8), p.y - vy * (p.length / 8))
        ctx.stroke()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    map.on('move', resizeCanvas)
    map.on('zoom', resizeCanvas)

    return () => {
      cancelAnimationFrame(animationFrameId)
      map.off('move', resizeCanvas)
      map.off('zoom', resizeCanvas)
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
    }
  }, [map, active, windSpeed, windDirDeg, animSpeedFactor])

  return null
}

function createStationIcon(value: number, color: string, isSelected: boolean) {
  const size = isSelected ? 38 : 32
  const borderStyle = isSelected ? '3px solid #00d2fe' : '2px solid rgba(255,255,255,0.4)'
  const textColor = getContrastTextColor(color)
  const html = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: ${borderStyle};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${textColor};
      font-weight: 800;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      box-shadow: 0 0 16px ${color}80;
      cursor: pointer;
    ">
      ${Math.round(value)}
    </div>
  `
  return L.divIcon({ html, className: 'custom-station-marker', iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
}

function createFireIcon(frp: number) {
  const size = Math.min(Math.max(Math.round(frp / 2), 14), 26)
  const html = `
    <div style="
      background-color: #ef4444;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);
    ">
      <div style="width: 5px; height: 5px; background: #ffffff; border-radius: 50%;"></div>
    </div>
  `
  return L.divIcon({ html, className: 'custom-fire-marker', iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
}

export default function MapPage() {
  const [stationData, setStationData] = useState<MapStationsData | null>(null)
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null)
  const [stubbleData, setStubbleData] = useState<StubbleRiskData | null>(null)

  const [selectedHorizon, setSelectedHorizon] = useState<'+0h' | '+6h' | '+12h' | '+24h' | '+48h' | '+72h'>('+0h')
  const [selectedFilter, setSelectedFilter] = useState<'aqi' | 'pm25' | 'pm10' | 'no2' | 'o3'>('aqi')
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  const [mapCenter, setMapCenter] = useState<[number, number]>(NCR_CENTER)
  const [animSpeed, setAnimSpeed] = useState<number>(1.0)

  const [layers, setLayers] = useState({
    airQuality: true,
    atmosphericFlow: true,
    fireActivity: true,
    smokeTransport: true
  })

  const loadAllData = useCallback(async (horizonStr: string) => {
    try {
      const [stRes, diagRes, stubRes] = await Promise.all([
        fetchMapStations(horizonStr),
        fetchDiagnostics().catch(() => null),
        fetchStubbleRisk().catch(() => null)
      ])
      setStationData(stRes)
      if (diagRes) setDiagnosticData(diagRes)
      if (stubRes) setStubbleData(stubRes)

      if (stRes.stations.length > 0 && !selectedStationId) {
        setSelectedStationId(stRes.stations[0].id)
      }
    } catch (err) {
      console.error('Failed to load map data:', err)
    }
  }, [selectedStationId])

  useEffect(() => {
    loadAllData(selectedHorizon)
  }, [selectedHorizon, loadAllData])

  const stations = (stationData?.stations && stationData.stations.length > 0) ? stationData.stations : FALLBACK_MAP_STATIONS.stations
  const activeStation = stations.find(s => s.id === selectedStationId) || stations[0]

  const windSpd = diagnosticData?.meteorological_drivers?.wind_speed_10m?.value ?? 6.0
  const windDir = diagnosticData?.meteorological_drivers?.wind_direction_10m?.value ?? 315

  const toggleLayer = (layerKey: keyof typeof layers) => setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-[20px] font-extrabold text-[#f8fafc] flex items-center gap-2.5 tracking-tight uppercase">
            <svg className="w-6 h-6 text-[#00d2fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            DELHI NCR AIR QUALITY MAP
          </h1>
          <p className="text-[12px] text-[#94a3b8]">
            Real geographic environmental intelligence map across Delhi, Gurugram, Noida, Ghaziabad & Faridabad.
          </p>
        </div>

        {/* Horizon, Filter & Reset View Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#081023] px-3 py-1.5 rounded-xl border border-[#1e2d54]">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase">Horizon:</span>
            <div className="flex gap-1">
              {(['+0h', '+6h', '+12h', '+24h', '+48h', '+72h'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
                    selectedHorizon === h
                      ? 'bg-[#00d2fe] text-[#060c1a] font-bold shadow-[0_0_8px_rgba(0,210,254,0.4)]'
                      : 'text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  {h === '+0h' ? 'CURRENT' : h.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#081023] p-1 rounded-xl border border-[#1e2d54]">
            {(['aqi', 'pm25', 'pm10', 'no2', 'o3'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedFilter(p)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase transition-all ${
                  selectedFilter === p
                    ? 'bg-[#10b981] text-[#060c1a]'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMapCenter([...NCR_CENTER])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#081023] hover:bg-[#132347] border border-[#1e2d54] text-[11px] font-medium text-[#f8fafc] transition-all"
          >
            <ArrowPathIcon className="w-3.5 h-3.5 text-[#00d2fe]" />
            <span>Reset NCR View</span>
          </button>
        </div>
      </div>

      {/* Scientific Data Provenance Notice Banner */}
      <div className="p-4 rounded-xl bg-[#081023] border border-[#1e2d54] flex items-start gap-3 text-[12px] text-[#94a3b8]">
        <InformationCircleIcon className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#f8fafc]">Scientific Integrity & Data Provenance Notice:</strong> Observed/reanalysis locations show point data (CAMS Reanalysis extractions matched to CPCB station coordinates). Wind flow derived from 10m meteorological wind vectors. Streamlines visualize the available meteorological field; they are not direct observations at every displayed pixel. <strong className="text-[#f8fafc]">No artificial spatial interpolation, fake kriging, or synthetic heatmaps are applied.</strong>
        </div>
      </div>

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container (Left 8 Cols) */}
        <div className="lg:col-span-8 p-3 rounded-2xl bg-[#0d172e] border border-[#1e2d54] shadow-2xl relative">
          <div className="flex justify-between items-center px-3 pb-3">
            <span className="text-[12px] font-bold text-[#f8fafc] flex items-center gap-2 tracking-wider font-mono uppercase">
              <svg className="w-4 h-4 text-[#00d2fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              INTERACTIVE NCR GEOGRAPHIC VIEW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#081023] border border-[#1e2d54] text-[10px] font-mono text-[#10b981]">
              LIVE OBSERVATIONS ({selectedHorizon})
            </span>
          </div>

          <div className="h-[520px] w-full rounded-xl overflow-hidden border border-[#1e2d54] relative">
            <MapContainer center={NCR_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom={true} style={{ height: '100%', width: '100%', backgroundColor: '#080f22' }}>
              <MapController center={mapCenter} zoom={DEFAULT_ZOOM} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{y}/{x}{r}.png"
                maxZoom={16}
                attribution="&copy; OpenStreetMap &copy; CARTO"
              />

              {layers.airQuality && stations.map(st => {
                const val = selectedFilter === 'aqi' ? st.aqi : st[selectedFilter]
                const color = st.color || getAQIColor(st.aqi)
                return (
                  <Marker
                    key={st.id}
                    position={[st.lat, st.lon]}
                    icon={createStationIcon(val, color, st.id === selectedStationId)}
                    eventHandlers={{
                      click: () => {
                        setSelectedStationId(st.id)
                        setMapCenter([st.lat, st.lon])
                      }
                    }}
                  />
                )
              })}

              <CanvasWindStreamlineLayer
                active={layers.atmosphericFlow}
                windSpeed={windSpd}
                windDirDeg={windDir}
                animSpeedFactor={animSpeed}
              />

              {layers.fireActivity && stubbleData?.active_fire_hotspots?.map((fire: any, idx: number) => (
                <Marker key={idx} position={[fire.latitude, fire.longitude]} icon={createFireIcon(fire.frp)} />
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Map Control & Detail Sidebar (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Layer Controls */}
          <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 shadow-xl">
            <span className="text-[12px] font-bold text-[#f8fafc] flex items-center gap-2 tracking-wider font-mono uppercase">
              <svg className="w-4 h-4 text-[#00d2fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              MAP LAYER CONTROL
            </span>

            <div className="space-y-2.5 text-[12px]">
              <button
                onClick={() => toggleLayer('airQuality')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border transition-all ${
                  layers.airQuality
                    ? 'bg-[#081023] border-[#00d2fe]/60 text-[#f8fafc]'
                    : 'bg-[#081023]/50 border-[#1e2d54] text-[#94a3b8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#00d2fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>Air Quality Reference Locations</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.airQuality ? 'bg-[#00d2fe] border-[#00d2fe]' : 'border-[#1e2d54]'}`}>
                  {layers.airQuality && <CheckSquareIcon className="w-3.5 h-3.5 text-[#060c1a]" strokeWidth={3} />}
                </div>
              </button>

              <button
                onClick={() => toggleLayer('atmosphericFlow')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border transition-all ${
                  layers.atmosphericFlow
                    ? 'bg-[#081023] border-[#00d2fe]/60 text-[#f8fafc]'
                    : 'bg-[#081023]/50 border-[#1e2d54] text-[#94a3b8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span>Wind Streamlines (Weather Field)</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.atmosphericFlow ? 'bg-[#00d2fe] border-[#00d2fe]' : 'border-[#1e2d54]'}`}>
                  {layers.atmosphericFlow && <CheckSquareIcon className="w-3.5 h-3.5 text-[#060c1a]" strokeWidth={3} />}
                </div>
              </button>

              <button
                onClick={() => toggleLayer('fireActivity')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border transition-all ${
                  layers.fireActivity
                    ? 'bg-[#081023] border-[#ef4444]/60 text-[#f8fafc]'
                    : 'bg-[#081023]/50 border-[#1e2d54] text-[#94a3b8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span>Satellite Fire Activity (NASA FIRMS)</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.fireActivity ? 'bg-[#ef4444] border-[#ef4444]' : 'border-[#1e2d54]'}`}>
                  {layers.fireActivity && <CheckSquareIcon className="w-3.5 h-3.5 text-[#ffffff]" strokeWidth={3} />}
                </div>
              </button>

              <button
                onClick={() => toggleLayer('smokeTransport')}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl border transition-all ${
                  layers.smokeTransport
                    ? 'bg-[#081023] border-[#f59e0b]/60 text-[#f8fafc]'
                    : 'bg-[#081023]/50 border-[#1e2d54] text-[#94a3b8]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Smoke Transport Risk Proxy</span>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.smokeTransport ? 'bg-[#f59e0b] border-[#f59e0b]' : 'border-[#1e2d54]'}`}>
                  {layers.smokeTransport && <CheckSquareIcon className="w-3.5 h-3.5 text-[#060c1a]" strokeWidth={3} />}
                </div>
              </button>
            </div>
          </div>

          {/* Speed Controls */}
          <div className="p-4 rounded-2xl bg-[#0d172e] border border-[#1e2d54] flex items-center justify-between shadow-xl">
            <span className="text-[11px] font-bold text-[#94a3b8] font-mono uppercase">
              CURRENT WIND STREAMLINE FIELD
            </span>
            <div className="flex gap-1.5 bg-[#081023] p-1 rounded-xl border border-[#1e2d54]">
              {[0.5, 1.0, 2.0].map(s => (
                <button
                  key={s}
                  onClick={() => setAnimSpeed(s)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    animSpeed === s
                      ? 'bg-[#00d2fe] text-[#060c1a]'
                      : 'text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Selected Station Panel */}
          {activeStation && (
            <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 shadow-xl">
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase font-mono block">SELECTED STATION</span>
              <div>
                <h3 className="text-[16px] font-bold text-[#f8fafc]">{activeStation.name}</h3>
                <p className="text-[11px] text-[#94a3b8] font-mono">{activeStation.city} • CPCB Reference Node</p>
              </div>

              <div className="pt-2 flex items-baseline gap-4">
                <div className="text-[44px] font-extrabold tracking-tight leading-none font-mono" style={{ color: activeStation.color || getAQIColor(activeStation.aqi) }}>
                  {Math.round(activeStation.aqi)}
                </div>
                <div className="text-[11px] font-bold px-3 py-1 rounded-full" style={getBadgeStyle(activeStation.category)}>
                  {activeStation.category}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1e2d54] text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-[#081023] border border-[#1e2d54]"><span className="text-[#94a3b8] block">PM2.5</span><span className="text-[14px] font-bold text-[#f8fafc]">{activeStation.pm25} µg/m³</span></div>
                <div className="p-2.5 rounded-xl bg-[#081023] border border-[#1e2d54]"><span className="text-[#94a3b8] block">PM10</span><span className="text-[14px] font-bold text-[#f8fafc]">{activeStation.pm10} µg/m³</span></div>
                <div className="p-2.5 rounded-xl bg-[#081023] border border-[#1e2d54]"><span className="text-[#94a3b8] block">O3</span><span className="text-[14px] font-bold text-[#f8fafc]">{activeStation.o3} µg/m³</span></div>
                <div className="p-2.5 rounded-xl bg-[#081023] border border-[#1e2d54]"><span className="text-[#94a3b8] block">NO2</span><span className="text-[14px] font-bold text-[#f8fafc]">{activeStation.no2} µg/m³</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
