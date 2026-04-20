'use client'

export function BlobBackground() {
  return (
    <>
      <style>{`
        @keyframes blob-morph {
          0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
          25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
          50%{border-radius:50% 60% 30% 60%/30% 60% 70% 40%}
          75%{border-radius:60% 40% 60% 30%/70% 30% 50% 60%}
        }
        @keyframes blob-drift1{0%,100%{transform:translate(0,0)}33%{transform:translate(45px,-35px)}66%{transform:translate(-25px,22px)}}
        @keyframes blob-drift2{0%,100%{transform:translate(0,0)}40%{transform:translate(-35px,28px)}70%{transform:translate(28px,-18px)}}
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ position:'absolute', top:'-80px', left:'15%', width:'550px', height:'450px', background:'#00ff88', filter:'blur(55px)', opacity:0.18, animation:'blob-morph 14s ease-in-out infinite, blob-drift1 22s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:'30%', left:'-8%', width:'420px', height:'380px', background:'#3b82f6', filter:'blur(50px)', opacity:0.12, animation:'blob-morph 18s ease-in-out infinite 2s, blob-drift2 26s ease-in-out infinite 1s' }} />
        <div style={{ position:'absolute', top:'15%', right:'-5%', width:'400px', height:'460px', background:'#a855f7', filter:'blur(50px)', opacity:0.1, animation:'blob-morph 20s ease-in-out infinite 4s' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'20%', width:'300px', height:'260px', background:'#00ff88', filter:'blur(45px)', opacity:0.08, animation:'blob-morph 16s ease-in-out infinite 7s, blob-drift1 28s ease-in-out infinite 3s' }} />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
      </div>
    </>
  )
}
