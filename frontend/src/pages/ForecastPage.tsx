import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { ForecastData } from '../api/client'
import { getBadgeStyle } from '../utils/colors'

interface Props {
  forecast: ForecastData | null
  loading: boolean
}

export default function ForecastPage({ forecast, loading }: Props) {
  const [selectedPollutant, setSelectedPollutant] = useState<'pm25' | 'pm10' | 'no2' | 'o3' | 'aqi'>('pm25')

  if (loading && !forecast) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          <div className="h-80 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
            <div className="h-32 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
            <div className="h-32 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          </div>
        </div>
      </div>
    )
  }

  const timeline = forecast?.forecast_timeline || []
  const h24 = timeline.find(i => i.horizon === '+24h') || timeline[3]
  const h48 = timeline.find(i => i.horizon === '+48h') || timeline[5]
  const h72 = timeline.find(i => i.horizon === '+72h') || timeline[6]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-[18px] font-bold text-[#f8fafc] flex items-center gap-2.5">
            <svg className="w-5 h-5 text-[#00d2fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Coupled 72-Hour Pollution Forecast Engine
          </h1>
          <p className="text-[12px] text-[#94a3b8]">
            Multi-horizon prediction output (+1h to +72h) powered by Multi-Horizon XGBoost Regressors.
          </p>
        </div>

        {/* Pollutant Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#081023] rounded-xl border border-[#1e2d54] shrink-0">
          {(['pm25', 'pm10', 'no2', 'o3', 'aqi'] as const).map(param => (
            <button
              key={param}
              onClick={() => setSelectedPollutant(param)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all ${
                selectedPollutant === param
                  ? 'bg-[#00d2fe] text-[#060c1a] shadow-[0_0_10px_rgba(0,210,254,0.4)]'
                  : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#132347]'
              }`}
            >
              {param}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-6 shadow-xl">
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold tracking-wider text-[#94a3b8] uppercase font-mono">
            72-HOUR CONCENTRATION TIMELINE ({selectedPollutant.toUpperCase()})
          </span>
          <span className="px-3 py-1 rounded-full bg-[#081023] border border-[#1e2d54] text-[11px] font-mono text-[#38bdf8]">
            Delhi NCR Average Projection
          </span>
        </div>

        <div className="h-80 w-full pt-2">
          {timeline.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart key={selectedPollutant} data={timeline} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastCyberArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2fe" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00d2fe" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e2d54" />
                <XAxis dataKey="horizon" stroke="#94a3b8" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#081023',
                    borderColor: '#1e2d54',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#00d2fe', fontFamily: 'JetBrains Mono' }}
                />
                <Area
                  key={selectedPollutant}
                  type="monotone"
                  dataKey={selectedPollutant}
                  stroke="#00d2fe"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#forecastCyberArea)"
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  animationBegin={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 3 Horizon Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* +24h Card */}
        <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 shadow-xl hover:border-[#00d2fe]/40 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-medium text-[#94a3b8] flex items-center gap-2">
              <svg className="w-4 h-4 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Next 24 Hours (+24h)
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={getBadgeStyle(h24?.category ?? 'Very Poor')}>
              {h24?.category ?? 'Very Poor'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[40px] font-extrabold text-[#f8fafc] font-mono leading-none">
              AQI {Math.round(h24?.aqi ?? 335)}
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">
            Predicted PM2.5: <strong className="text-[#38bdf8]">{h24?.pm25 ?? 165} µg/m³</strong>
          </p>
        </div>

        {/* +48h Card */}
        <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 shadow-xl hover:border-[#00d2fe]/40 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-medium text-[#94a3b8] flex items-center gap-2">
              <svg className="w-4 h-4 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Next 48 Hours (+48h)
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={getBadgeStyle(h48?.category ?? 'Very Poor')}>
              {h48?.category ?? 'Very Poor'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[40px] font-extrabold text-[#f8fafc] font-mono leading-none">
              AQI {Math.round(h48?.aqi ?? 360)}
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">
            Predicted PM2.5: <strong className="text-[#38bdf8]">{h48?.pm25 ?? 198} µg/m³</strong>
          </p>
        </div>

        {/* +72h Card */}
        <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 shadow-xl hover:border-[#00d2fe]/40 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-medium text-[#94a3b8] flex items-center gap-2">
              <svg className="w-4 h-4 text-[#38bdf8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Next 72 Hours (+72h)
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={getBadgeStyle(h72?.category ?? 'Very Poor')}>
              {h72?.category ?? 'Very Poor'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[40px] font-extrabold text-[#f8fafc] font-mono leading-none">
              AQI {Math.round(h72?.aqi ?? 373)}
            </span>
          </div>
          <p className="text-[11px] text-[#94a3b8] font-mono">
            Predicted PM2.5: <strong className="text-[#38bdf8]">{h72?.pm25 ?? 215} µg/m³</strong>
          </p>
        </div>
      </div>

      {/* Prediction Matrix Table */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 shadow-xl">
        <h3 className="text-[15px] font-bold text-[#f8fafc]">Complete Prediction Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-[#1e2d54] text-[#94a3b8] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">PM2.5</th>
                <th className="py-3 px-4">PM10</th>
                <th className="py-3 px-4">NO2</th>
                <th className="py-3 px-4">O3</th>
                <th className="py-3 px-4">AQI Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d54]/60">
              {timeline.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#081023] transition-colors font-mono">
                  <td className="py-3.5 px-4 text-[#00d2fe] font-bold">{row.horizon}</td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">{row.timestamp}</td>
                  <td className="py-3.5 px-4 text-[#f8fafc]">{row.pm25} µg/m³</td>
                  <td className="py-3.5 px-4 text-[#f8fafc]">{row.pm10} µg/m³</td>
                  <td className="py-3.5 px-4 text-[#f8fafc]">{row.no2} µg/m³</td>
                  <td className="py-3.5 px-4 text-[#f8fafc]">{row.o3} µg/m³</td>
                  <td className="py-3.5 px-4 font-bold" style={{ color: row.color }}>{row.aqi}</td>
                  <td className="py-3.5 px-4 text-[#94a3b8]">{row.is_observed ? 'Observed' : 'Prediction'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
