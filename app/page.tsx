import { MainInterface } from "@/components/main-interface"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full blur-lg animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-200 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-200 rounded-full blur-xl animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <main className="relative z-10">
        <MainInterface />
      </main>
    </div>
  )
}
