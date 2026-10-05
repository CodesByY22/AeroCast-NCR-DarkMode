export default function PrivacyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 text-[#f8fafc] pb-20">
      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-2 shadow-xl">
        <h1 className="text-[22px] font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-[12px] text-[#94a3b8]">Public data privacy and operational analytics standards.</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#0d172e] border border-[#1e2d54] space-y-4 text-[13px] text-[#94a3b8] leading-relaxed shadow-xl">
        <h2 className="text-[15px] font-bold text-[#f8fafc]">1. Zero Personal Data Collection</h2>
        <p>AeroCast NCR is a public environmental monitoring and predictive intelligence dashboard. No personal user data, user location tracking, or private credentials are requested or stored.</p>

        <h2 className="text-[15px] font-bold text-[#f8fafc]">2. Open Data API Requests</h2>
        <p>All environmental API requests (Copernicus CAMS, Open-Meteo, NASA FIRMS) process public geographical grid coordinates and station locations.</p>
      </div>
    </div>
  )
}
