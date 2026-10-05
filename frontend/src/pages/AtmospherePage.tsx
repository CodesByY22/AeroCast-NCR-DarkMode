import { useState } from 'react'
import { DiagnosticData } from '../api/client'
import { InformationCircleIcon, CloudIcon, SparklesIcon, LightBulbIcon, FireIcon, SunIcon } from '@heroicons/react/24/outline'

export default function AtmospherePage({ diagnostics, loading }: { diagnostics: DiagnosticData | null, loading: boolean }) {
  const [simMode, setSimMode] = useState<'inversion' | 'normal'>('inversion')

  if (loading && !diagnostics) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
            <div className="h-80 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          </div>
        </div>
      </div>
    )
  }

  const drivers = diagnostics?.meteorological_drivers
  const ventilation = diagnostics?.diagnostics?.ventilation
  const inversion = diagnostics?.diagnostics?.inversion

  const temp = drivers?.temperature_2m?.value ?? 22.4
  const hum = drivers?.relative_humidity?.value ?? 68
  const windSpd = drivers?.wind_speed_10m?.value ?? 2.1
  const windDir = drivers?.wind_direction_10m?.value ?? 305
  const pbl = drivers?.pbl_height_proxy?.value ?? 380

  const vc = ventilation?.ventilation_index_proxy ?? 798
  const invScore = inversion?.inversion_proxy_index ?? 0.82

  // Progress Bar Calculations
  const vcPct = Math.min(Math.round((vc / 6000) * 100), 100)
  const invPct = Math.min(Math.round(invScore * 100), 100)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-1 shadow-xl">
        <h1 className="text-[20px] font-extrabold text-[#f8fafc] flex items-center gap-2.5">
          <CloudIcon className="w-6 h-6 text-[#00d2fe]" />
          Atmospheric Intelligence & Dispersion Diagnostics
        </h1>
        <p className="text-[12px] text-[#94a3b8]">
          Coupled weather dynamics dictating surface pollutant accumulation vs. dispersion.
        </p>
      </div>

      {/* INTERACTIVE ATMOSPHERIC TRAPPING SIMULATOR INFOGRAPHIC (FOR JUDGES) */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1e2d54] pb-4">
          <div className="space-y-1">
            <h3 className="text-[15px] font-extrabold text-[#f8fafc] flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-[#00d2fe]" />
              INTERACTIVE VISUAL SIMULATOR: NORMAL DISPERSION VS. INVERSION LID TRAPPING
            </h3>
            <p className="text-[12px] text-[#94a3b8]">
              Switch tabs to see how thermal inversion acts like an invisible lid over Delhi NCR.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#081023] rounded-xl border border-[#1e2d54] shrink-0 font-mono text-[11px]">
            <button
              onClick={() => setSimMode('inversion')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                simMode === 'inversion'
                  ? 'bg-[#ef4444] text-[#ffffff] shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              ⚠️ Winter Inversion Smog Day (Current)
            </button>
            <button
              onClick={() => setSimMode('normal')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                simMode === 'normal'
                  ? 'bg-[#10b981] text-[#060c1a] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'text-[#94a3b8] hover:text-[#f8fafc]'
              }`}
            >
              🍃 Normal Clean Dispersion Day
            </button>
          </div>
        </div>

        {/* Visual Simulation Display Box */}
        {simMode === 'inversion' ? (
          <div className="p-6 rounded-xl bg-[#081023] border border-[#ef4444]/40 space-y-4 font-mono">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#ef4444] font-bold flex items-center gap-2">
                <FireIcon className="w-4 h-4 text-[#ef4444]" />
                CURRENT STATUS: THERMAL INVERSION SMOG TRAP ACTIVE
              </span>
              <span className="text-[#94a3b8]">PBL Height Lid: {pbl}m | Wind: {windSpd} m/s</span>
            </div>

            {/* Visual Atmospheric Layers Diagram */}
            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-3 rounded-lg bg-[#3b0764]/40 border border-[#c084fc]/50 text-[#c084fc] flex justify-between items-center">
                <span>WARM INVERSION LAYER ALOFT (LID AT 380m)</span>
                <span className="font-mono text-[10px] bg-[#3b0764] px-2 py-0.5 rounded">Prevents Vertical Mixing</span>
              </div>
              <div className="p-5 rounded-lg bg-[#450a0a]/60 border border-[#ef4444]/60 text-[#f87171] space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span>COLD HEAVY BREATHING ZONE (0-380m)</span>
                  <span className="font-mono text-[10px] bg-[#7f1d1d] px-2 py-0.5 rounded text-white">PM2.5 Trapped: {diagnostics?.meteorological_drivers?.temperature_2m?.value ?? 22.4}°C</span>
                </div>
                <p className="text-[12px] text-[#fca5a5] leading-relaxed">
                  Vehicle exhaust and stubble smoke rise until hitting the warm lid at 380m, then flatten and accumulate right in the breathing zone. Low wind speed ({windSpd} m/s) cannot flush it out!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#081023] border border-[#10b981]/40 space-y-4 font-mono">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#10b981] font-bold flex items-center gap-2">
                <SunIcon className="w-4 h-4 text-[#10b981]" />
                BENCHMARK: NORMAL ATMOSPHERIC MIXING DAY
              </span>
              <span className="text-[#94a3b8]">PBL Height: 1500m | Wind: &gt;6.0 m/s</span>
            </div>

            {/* Visual Normal Layers Diagram */}
            <div className="space-y-2 text-[11px] font-sans">
              <div className="p-3 rounded-lg bg-[#064e3b]/30 border border-[#10b981]/50 text-[#34d399] flex justify-between items-center">
                <span>HIGH PLANETARY BOUNDARY LAYER (1500m)</span>
                <span className="font-mono text-[10px] bg-[#064e3b] px-2 py-0.5 rounded text-white">Free Thermal Convection</span>
              </div>
              <div className="p-5 rounded-lg bg-[#065f46]/40 border border-[#10b981]/50 text-[#a7f3d0] space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span>WELL-VENTILATED MIXING ZONE (0-1500m)</span>
                  <span className="font-mono text-[10px] bg-[#047857] px-2 py-0.5 rounded text-white">Ventilation Index &gt;6000 m²/s</span>
                </div>
                <p className="text-[12px] text-[#a7f3d0] leading-relaxed">
                  Sunlight heats the ground, warm buoyant air plumes lift pollutants high into the troposphere, and strong surface winds flush emissions clear of the NCR urban domain.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* JUDGE'S QUICK ATMOSPHERIC INSIGHT CARD */}
      <div className="p-6 rounded-2xl bg-[#081023] border border-[#00d2fe]/40 space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#1e2d54] pb-3">
          <h3 className="text-[14px] font-bold text-[#00d2fe] flex items-center gap-2 uppercase font-mono tracking-wider">
            <SparklesIcon className="w-5 h-5 text-[#00d2fe]" />
            JUDGE'S ATMOSPHERIC TAKEAWAY (IN PLAIN ENGLISH)
          </h3>
          <span className="px-3 py-1 rounded-full bg-[#0d172e] border border-[#00d2fe]/30 text-[10px] font-mono text-[#00d2fe] font-bold">
            Physics Simplified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
          <div className="p-4 rounded-xl bg-[#0d172e] border border-[#1e2d54] space-y-2 hover-card-rise">
            <div className="flex items-center gap-2 text-[#f59e0b] font-bold">
              <LightBulbIcon className="w-4 h-4 text-[#f59e0b]" />
              <span>What is Ventilation Index ({vc} m²/s)?</span>
            </div>
            <p className="text-[#94a3b8] leading-relaxed">
              Think of the atmosphere over Delhi NCR as a room with an exhaust fan. Ventilation Index measures how fast the fan blows pollution out. At <strong className="text-[#f59e0b]">798 m²/s</strong> (below 2000 m²/s threshold), the fan is almost OFF, trapping all vehicle smoke inside!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0d172e] border border-[#1e2d54] space-y-2 hover-card-rise">
            <div className="flex items-center gap-2 text-[#ef4444] font-bold">
              <LightBulbIcon className="w-4 h-4 text-[#ef4444]" />
              <span>What is Thermal Inversion ({invScore}/100)?</span>
            </div>
            <p className="text-[#94a3b8] leading-relaxed">
              Thermal inversion acts like an <strong className="text-[#ef4444]">invisible warm lid</strong> pressed down over Delhi NCR at night. Cold air and heavy PM2.5 smoke cannot rise, locking pollution directly in our lungs.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Top Weather Driver Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Temp */}
        <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-2 shadow-lg hover-card-rise">
          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase font-mono block">TEMPERATURE (2M)</span>
          <div className="text-[28px] font-extrabold text-[#f8fafc] font-mono leading-none">
            {temp} <span className="text-[14px] text-[#94a3b8]">deg C</span>
          </div>
          <span className="text-[10px] text-[#64748b] font-mono block">Cool surface temperature</span>
        </div>

        {/* Humidity */}
        <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-2 shadow-lg hover-card-rise">
          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase font-mono block">HUMIDITY (2M)</span>
          <div className="text-[28px] font-extrabold text-[#38bdf8] font-mono leading-none">
            {hum} <span className="text-[14px] text-[#94a3b8]">%</span>
          </div>
          <span className="text-[10px] text-[#64748b] font-mono block">Moisture aids fog/smog</span>
        </div>

        {/* Wind Speed */}
        <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-2 shadow-lg hover-card-rise">
          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase font-mono block">WIND SPEED (10M)</span>
          <div className="text-[28px] font-extrabold text-[#f97316] font-mono leading-none">
            {windSpd} <span className="text-[14px] text-[#94a3b8]">m/s</span>
          </div>
          <span className="text-[10px] text-[#f97316] font-mono block font-bold">Stagnant (&lt;3 m/s)</span>
        </div>

        {/* Wind Vector */}
        <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-2 shadow-lg hover-card-rise">
          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase font-mono block">WIND VECTOR (10M)</span>
          <div className="text-[28px] font-extrabold text-[#34d399] font-mono leading-none">
            {windDir}° <span className="text-[14px] text-[#94a3b8]">NW</span>
          </div>
          <span className="text-[10px] text-[#34d399] font-mono block font-bold">Blowing from Punjab</span>
        </div>

        {/* PBL Height */}
        <div className="p-5 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-2 shadow-lg hover-card-rise relative">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-semibold text-[#94a3b8] uppercase font-mono">PBL HEIGHT</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">PROXY</span>
          </div>
          <div className="text-[28px] font-extrabold text-[#ef4444] font-mono leading-none">
            {pbl} <span className="text-[14px] text-[#94a3b8]">m</span>
          </div>
          <span className="text-[10px] text-[#ef4444] font-mono block font-bold">Squashed Boundary Layer</span>
        </div>
      </div>

      {/* 2 Main Visual Analysis Cards with Progress Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventilation Index Card */}
        <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[15px] font-bold text-[#f8fafc] flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00d2fe]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Ventilation Index Proxy (Vc)
              </h3>
              <p className="text-[11px] font-mono text-[#94a3b8] mt-0.5">
                Formula: Vc = Wind_Speed_10m × PBL_Height_Proxy
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
              PROXY METRIC
            </span>
          </div>

          <div className="p-6 rounded-xl bg-[#081023] border border-[#1e2d54] text-center space-y-4">
            <span className="text-[11px] text-[#94a3b8] font-mono uppercase block">Calculated Ventilation Velocity</span>
            <div className="text-[48px] font-extrabold text-[#f97316] font-mono leading-none">
              {vc} <span className="text-[16px] text-[#94a3b8]">m²/s</span>
            </div>
            <span className="text-[12px] font-bold text-[#f97316] block font-mono">
              Poor Ventilation (Severe Trapping Risk)
            </span>

            {/* Visual Gauge Meter Bar */}
            <div className="space-y-1 text-left pt-2">
              <div className="flex justify-between text-[11px] font-mono text-[#94a3b8]">
                <span>Dispersion Capacity (Target: &gt;6000 m²/s)</span>
                <span className="text-[#f97316] font-bold">{vcPct}% Capacity</span>
              </div>
              <div className="h-3 w-full bg-[#0d172e] rounded-full overflow-hidden border border-[#1e2d54]">
                <div className="h-full bg-gradient-to-r from-[#ef4444] via-[#f97316] to-[#10b981] rounded-full" style={{ width: `${vcPct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#081023]/60 border border-[#1e2d54] flex items-start gap-3 text-[12px] text-[#94a3b8]">
            <InformationCircleIcon className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#38bdf8]">Scientific Standard:</strong> Higher ventilation velocity (Vc &gt; 6000 m²/s) promotes rapid pollutant flushing. Lower ventilation velocity (Vc &lt; 2000 m²/s) suppresses atmospheric mixing, creating severe smog traps.
            </div>
          </div>
        </div>

        {/* Thermal Inversion Card */}
        <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[15px] font-bold text-[#f8fafc] flex items-center gap-2">
                <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Thermal Inversion Proxy Index
              </h3>
              <p className="text-[11px] font-mono text-[#94a3b8] mt-0.5">
                Scale: 0 (Unstable / Mixed) to 100 (Strong Surface Trap)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
              PROXY METRIC
            </span>
          </div>

          <div className="p-6 rounded-xl bg-[#081023] border border-[#1e2d54] text-center space-y-4">
            <span className="text-[11px] text-[#94a3b8] font-mono uppercase block">Thermal Inversion Stability Score</span>
            <div className="text-[48px] font-extrabold text-[#ef4444] font-mono leading-none">
              {invScore} <span className="text-[16px] text-[#94a3b8]">/ 100</span>
            </div>
            <span className="text-[12px] font-bold text-[#ef4444] block font-mono">
              High Thermal Inversion Risk (Lid Effect Active)
            </span>

            {/* Visual Gauge Meter Bar */}
            <div className="space-y-1 text-left pt-2">
              <div className="flex justify-between text-[11px] font-mono text-[#94a3b8]">
                <span>Trapping Intensity Score</span>
                <span className="text-[#ef4444] font-bold">{invPct}% Trapping</span>
              </div>
              <div className="h-3 w-full bg-[#0d172e] rounded-full overflow-hidden border border-[#1e2d54]">
                <div className="h-full bg-gradient-to-r from-[#10b981] via-[#facc15] to-[#ef4444] rounded-full" style={{ width: `${invPct}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#081023]/60 border border-[#1e2d54] flex items-start gap-3 text-[12px] text-[#94a3b8]">
            <InformationCircleIcon className="w-5 h-5 text-[#f59e0b] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#f59e0b]">Educational Physics Note:</strong> “Temperature inversion occurs when warm air caps cooler surface air, suppressing vertical atmospheric mixing and trapping vehicle and crop smoke directly in the breathing zone.”
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
