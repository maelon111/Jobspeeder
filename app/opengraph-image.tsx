import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'JobSpeeder — Postulez à 100 offres pendant que vous dormez'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060c16',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Background glow top-right */}
        <div style={{
          position: 'absolute',
          top: -180,
          right: -120,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.18) 0%, transparent 70%)',
          display: 'flex',
        }} />
        {/* Background glow bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: -200,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Logo + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          {/* Lightning bolt icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: '#00ff88',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
          }}>
            ⚡
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#ffffff', letterSpacing: -1 }}>
            JobSpeeder
          </span>
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: 54,
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.15,
          maxWidth: 900,
          marginBottom: 20,
          letterSpacing: -1,
        }}>
          Postulez à{' '}
          <span style={{ color: '#00ff88' }}>100 offres</span>
          {' '}pendant que vous dormez
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          maxWidth: 700,
          marginBottom: 48,
          lineHeight: 1.4,
        }}>
          IA · Candidatures automatiques · CV optimisé · Lettre de motivation personnalisée
        </div>

        {/* CTA pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(0,255,136,0.12)',
          border: '1px solid rgba(0,255,136,0.3)',
          borderRadius: 999,
          padding: '14px 32px',
        }}>
          <span style={{ color: '#00ff88', fontSize: 20, fontWeight: 600 }}>
            jobspeeder.online
          </span>
        </div>

        {/* Bottom stats bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 70,
          background: 'rgba(255,255,255,0.03)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 80,
        }}>
          {[
            ['100+', 'offres / jour'],
            ['GPT-4o', 'IA avancée'],
            ['2 min', 'pour démarrer'],
          ].map(([val, label]) => (
            <div key={val} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ color: '#00ff88', fontSize: 22, fontWeight: 700 }}>{val}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
