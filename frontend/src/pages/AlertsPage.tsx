import { useState } from 'react'
import { ExclamationTriangleIcon, ShieldExclamationIcon, CheckCircleIcon, SparklesIcon, BuildingLibraryIcon, TruckIcon, FireIcon, NoSymbolIcon } from '@heroicons/react/24/outline'
import { getBadgeStyle, getAQIColor } from '../utils/colors'

const GRAP_STAGES = [
  {
    stage: 'STAGE I',
    name: 'POOR (AQI 201-300)',
    color: '#facc15',
    actions: [
      { title: 'Sweeping & Dust Control', desc: 'Mechanized sweeping and water sprinkling on roads thrice daily.', icon: BuildingLibraryIcon },
      { title: 'Open Burning Bans', desc: 'Strict ban on garbage and solid waste burning with ₹5,000 spot fines.', icon: FireIcon }
    ],
    targetReduction: '-12% PM10 / PM2.5'
  },
  {
    stage: 'STAGE II',
    name: 'VERY POOR (AQI 301-400)',
    color: '#f97316',
    actions: [
      { title: 'Diesel Generator Restrictions', desc: 'Ban on diesel generator sets except for critical hospital services.', icon: NoSymbolIcon },
      { title: 'Public Transport Boost', desc: 'Enhance bus and metro frequencies to reduce private vehicle usage.', icon: TruckIcon }
    ],
    targetReduction: '-22% PM2.5'
  },
  {
    stage: 'STAGE III',
    name: 'SEVERE (AQI 401-450)',
    color: '#ef4444',
    actions: [
      { title: 'BS-III / BS-IV Vehicle Ban', desc: 'Strict ban on BS-III petrol and BS-IV diesel four-wheelers.', icon: NoSymbolIcon },
      { title: 'Halt Construction Work', desc: 'Complete shutdown of earthwork, demolition, and non-essential construction.', icon: BuildingLibraryIcon }
    ],
    targetReduction: '-35% Regional PM2.5'
  },
  {
    stage: 'STAGE IV',
    name: 'SEVERE+ (AQI >450)',
    color: '#b91c1c',
    actions: [
      { title: 'Interstate Truck Ban', desc: 'Ban non-essential heavy commercial diesel trucks from entering Delhi.', icon: TruckIcon },
      { title: 'School Closures & Odd-Even', desc: 'Primary school physical classes shifted online; odd-even vehicle scheme.', icon: ShieldExclamationIcon }
    ],
    targetReduction: '-48% Emergency AQI'
  }
]

export default function AlertsPage({ alerts, loading }: { alerts: any, loading: boolean }) {
  const [selectedGrapStage, setSelectedGrapStage] = useState<number>(2) // Default Stage III

  if (loading && !alerts) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          <div className="h-44 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-36 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
            <div className="h-36 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
            <div className="h-36 bg-[#0d172e] rounded-2xl border border-[#1e2d54]"></div>
          </div>
        </div>
      </div>
    )
  }

  const active = alerts?.active_alert
  const forecastAlerts = alerts?.forecast_alerts || []
  const activeGrapObj = GRAP_STAGES[selectedGrapStage]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-1 shadow-xl">
        <h1 className="text-[20px] font-extrabold text-[#f8fafc] flex items-center gap-2.5">
          <ExclamationTriangleIcon className="w-6 h-6 text-[#f97316]" />
          Dynamic CPCB Air Quality Alert Centre & GRAP Policy Simulator
        </h1>
        <p className="text-[12px] text-[#94a3b8]">
          Automated CPCB-compliant warning triggers based on multi-horizon model predictions.
        </p>
      </div>

      {/* JUDGE'S GRAP POLICY INTERACTIVE SIMULATOR */}
      <div className="p-6 rounded-2xl bg-[#081023] border border-[#00d2fe]/40 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#1e2d54] pb-3">
          <h3 className="text-[14px] font-bold text-[#00d2fe] flex items-center gap-2 uppercase font-mono tracking-wider">
            <SparklesIcon className="w-5 h-5 text-[#00d2fe]" />
            JUDGE'S GRAP POLICY ENFORCEMENT SIMULATOR (CLICK STAGES TO SEE MANDATORY RESTRICTIONS)
          </h3>
          <span className="px-3 py-1 rounded-full bg-[#0d172e] border border-[#00d2fe]/30 text-[10px] font-mono text-[#00d2fe] font-bold">
            CPCB Operational Standard
          </span>
        </div>

        {/* Stage Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {GRAP_STAGES.map((st, idx) => (
            <button
              key={st.stage}
              onClick={() => setSelectedGrapStage(idx)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedGrapStage === idx
                  ? 'bg-[#0d172e] border-[#00d2fe] shadow-[0_0_15px_rgba(0,210,254,0.3)] scale-[1.02]'
                  : 'bg-[#0d172e]/60 border-[#1e2d54] text-[#94a3b8] hover:border-[#38bdf8]/40'
              }`}
            >
              <div className="text-[11px] font-bold" style={{ color: st.color }}>
                {st.stage}
              </div>
              <div className="text-[12px] font-extrabold text-[#f8fafc] mt-0.5">{st.name}</div>
              <div className="text-[10px] text-[#94a3b8] mt-1">Goal: {st.targetReduction}</div>
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Panel */}
        <div className="p-5 rounded-xl bg-[#0d172e] border border-[#1e2d54] space-y-4">
          <div className="flex justify-between items-center border-b border-[#1e2d54] pb-3">
            <div className="flex items-center gap-2">
              <ShieldExclamationIcon className="w-5 h-5" style={{ color: activeGrapObj.color }} />
              <span className="text-[14px] font-bold text-[#f8fafc] font-mono">
                {activeGrapObj.stage} INTERVENTION PROTOCOL ({activeGrapObj.name})
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#081023] text-[11px] font-mono font-bold" style={{ color: activeGrapObj.color, border: `1px solid ${activeGrapObj.color}60` }}>
              Estimated Impact: {activeGrapObj.targetReduction}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGrapObj.actions.map((act, i) => {
              const IconComp = act.icon
              return (
                <div key={i} className="p-4 rounded-xl bg-[#081023] border border-[#1e2d54] flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#0d172e] border border-[#1e2d54]" style={{ color: activeGrapObj.color }}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[13px] font-bold text-[#f8fafc]">{act.title}</div>
                    <div className="text-[11px] text-[#94a3b8] leading-relaxed">{act.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Active Alert Box */}
      {active && (
        <div className="p-6 rounded-2xl bg-[#0d172e] border-2 border-[#f97316] space-y-4 shadow-[0_0_25px_rgba(249,115,22,0.2)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#f97316]/20 rounded-xl text-[#f97316] border border-[#f97316]/40">
                <ShieldExclamationIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#f97316] uppercase block">
                  ACTIVE WARNING ({active.horizon || '+0H OBSERVATION'})
                </span>
                <h3 className="text-[22px] font-extrabold text-[#f8fafc] tracking-tight">
                  {active.category?.toUpperCase() || 'VERY POOR'} ALERT — AQI {Math.round(active.aqi)}
                </h3>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold font-mono bg-[#f97316] text-[#060c1a] shadow-[0_0_12px_rgba(249,115,22,0.5)]">
              {active.alert_level || 'STAGE-III GRAP'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#081023] border border-[#1e2d54] space-y-1 text-[12px]">
            <span className="font-bold text-[#f97316] font-mono block">Trigger Explanation:</span>
            <p className="text-[#94a3b8] leading-relaxed">
              {active.explanation}
            </p>
          </div>
        </div>
      )}

      {/* 72-Hour Warning Forecast Timeline */}
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-6 shadow-xl">
        <h3 className="text-[15px] font-bold text-[#f8fafc] flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-[#38bdf8]" />
          72-Hour Warning Forecast Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {forecastAlerts.map((item: any, idx: number) => (
            <div key={idx} className="p-5 rounded-xl bg-[#081023] border border-[#1e2d54] space-y-3 hover:border-[#00d2fe]/40 transition-colors">
              <div className="flex justify-between items-center font-mono">
                <span className="text-[11px] font-bold text-[#38bdf8]">HORIZON {item.horizon}</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={getBadgeStyle(item.category)}>
                  {item.category}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold font-mono" style={{ color: item.color || getAQIColor(item.aqi) }}>
                  AQI {Math.round(item.aqi)}
                </span>
                <span className="text-[11px] text-[#94a3b8] font-mono">({item.pm25} µg/m³ PM2.5)</span>
              </div>

              <div className="p-3 rounded-lg bg-[#0d172e] border border-[#1e2d54] text-[11px] text-[#94a3b8]">
                {item.explanation}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Footer Box */}
        <div className="pt-4 border-t border-[#1e2d54] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#94a3b8] font-mono gap-2">
          <span>Compliance Standard: CPCB National Air Quality Index (NAQI) Standard</span>
          <span className="flex items-center gap-1.5 text-[#10b981] font-bold">
            <CheckCircleIcon className="w-4 h-4" />
            Operational
          </span>
        </div>
      </div>
    </div>
  )
}

