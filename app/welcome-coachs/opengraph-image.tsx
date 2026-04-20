import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'JobSpeeder — Partenariat Coachs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #060c16 0%, #0a1628 50%, #060c16 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '60%',
            width: '500px',
            height: '500px',
            background: '#00ff88',
            borderRadius: '50%',
            filter: 'blur(120px)',
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '5%',
            width: '380px',
            height: '380px',
            background: '#3b82f6',
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.1,
          }}
        />

        {/* Logo + brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#00ff88',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 900,
              color: '#060c16',
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '-0.3px',
            }}
          >
            JobSpeeder
          </span>
          <div
            style={{
              marginLeft: '8px',
              padding: '4px 12px',
              background: 'rgba(0,255,136,0.12)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#00ff88',
            }}
          >
            Espace Coachs
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            marginBottom: '28px',
            maxWidth: '860px',
          }}
        >
          <span
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            JobSpeeder trouve
          </span>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            des entretiens pour vos candidats,
          </span>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#00ff88',
            }}
          >
            vous les préparez à les réussir.
          </span>
        </div>

        {/* Sub */}
        <p
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            margin: '0',
            lineHeight: 1.5,
            maxWidth: '680px',
          }}
        >
          Devenez partenaire coach — vos clients progressent, votre activité décolle.
        </p>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(0,255,136,0.1)',
            border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: '16px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff88',
            }}
          />
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#00ff88',
            }}
          >
            Partenariats ouverts
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
