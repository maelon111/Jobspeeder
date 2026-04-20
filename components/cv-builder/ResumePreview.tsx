'use client'
import { useRef, useState, useEffect } from 'react'
import { ResumeData, TemplateType } from '@/types/resume'

// 210mm at 96dpi
const CV_WIDTH_PX = 794

interface ResumePreviewProps {
  data: ResumeData
  template: TemplateType
  primaryColor: string
  roundedPhoto: boolean
  photoPosition: number
  photoSize: number
  photoPositionX: number
  photoContainerSize: number
}

// ── Shared sub-renderers ──────────────────────────────────────

function SkillBadge({ name, level, color }: { name: string; level: string; color: string }) {
  const widths = { débutant: '33%', intermédiaire: '66%', expert: '100%' }
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
        <span>{name}</span>
        <span style={{ opacity: 0.6, textTransform: 'capitalize' }}>{level}</span>
      </div>
      <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2 }}>
        <div style={{ height: '100%', width: widths[level as keyof typeof widths] ?? '50%', background: color, borderRadius: 2 }} />
      </div>
    </div>
  )
}

function BulletBlock({ text }: { text: string }) {
  return (
    <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.6 }}>
      {text.split('\n').map((line, i) => (
        <p key={i} style={{ margin: '1px 0' }}>{line}</p>
      ))}
    </div>
  )
}

function PhotoFrame({ src, size, rounded, position, positionX, photoSize, border }: {
  src: string; size: number; rounded: boolean; position: number; positionX: number; photoSize: number; border?: string
}) {
  const xOffset = (positionX - 50) * 0.6
  const radius = rounded ? '50%' : 6
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: radius,
      border: border ?? 'none',
      transform: `translateX(${xOffset}px)`,
    }}>
      <div style={{
        width: '100%', height: '100%', overflow: 'hidden',
        borderRadius: radius,
      }}>
        <img
          src={src}
          alt="Photo"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: `center ${position}%`,
            transform: `scale(${photoSize / 100})`,
            transformOrigin: 'center center',
          }}
        />
      </div>
    </div>
  )
}

// ── Modern Template ───────────────────────────────────────────

function ModernTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1f2937', background: '#fff', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: color, padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
        {p.photo && (
          <PhotoFrame
            src={p.photo} size={Math.round(64 * photoContainerSize / 100)} rounded={rounded} position={position} positionX={positionX} photoSize={photoSize}
            border="2px solid rgba(255,255,255,0.4)"
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{p.name || 'Votre Nom'}</h1>
          <p style={{ fontSize: 13, opacity: 0.9, margin: '4px 0 10px' }}>{p.title || 'Votre titre'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: 11 }}>
            {p.email && <span>✉ {p.email}</span>}
            {p.phone && <span>✆ {p.phone}</span>}
            {p.city && <span>⌖ {p.city}</span>}
            {p.linkedin && <span>in {p.linkedin}</span>}
            {p.github && <span>⌥ {p.github}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* Left column */}
        <div style={{ flex: '0 0 35%', padding: '16px 14px', borderRight: '1px solid #e5e7eb' }}>
          {data.summary && (
            <div style={{ marginBottom: 16 }}>
              <SectionTitle label="Profil" color={color} />
              <p style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.6 }}>{data.summary}</p>
            </div>
          )}
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionTitle label="Compétences" color={color} />
              {data.skills.map(s => <SkillBadge key={s.id} name={s.name} level={s.level} color={color} />)}
            </div>
          )}
          {data.languages.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionTitle label="Langues" color={color} />
              {data.languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span>{l.name}</span>
                  <span style={{ color, fontWeight: 600 }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}
          {data.certifications.length > 0 && (
            <div>
              <SectionTitle label="Certifications" color={color} />
              {data.certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 6 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, margin: 0 }}>{c.title}</p>
                  <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>{c.organization} {c.date && `· ${c.date}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, padding: '16px 16px' }}>
          {data.experiences.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <SectionTitle label="Expériences" color={color} />
              {data.experiences.map(e => (
                <div key={e.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{e.position}</span>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>
                      {e.startDate}{e.startDate && '–'}{e.current ? 'Présent' : e.endDate}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color, margin: '1px 0 4px', fontStyle: 'italic' }}>{e.company}</p>
                  {e.description && <BulletBlock text={e.description} />}
                </div>
              ))}
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <SectionTitle label="Formations" color={color} />
              {data.education.map(e => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{e.degree}</span>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>{e.year}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#4b5563', margin: '1px 0' }}>{e.institution} {e.mention && `· ${e.mention}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Minimal Template ──────────────────────────────────────────

function MinimalTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#111', background: '#fff', padding: '28px 32px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -1, margin: 0 }}>{p.name || 'Votre Nom'}</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 8px' }}>{p.title || 'Votre titre'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 11, color: '#6b7280' }}>
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.city && <span>{p.city}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
          </div>
        </div>
        {p.photo && (
          <PhotoFrame
            src={p.photo} size={Math.round(72 * photoContainerSize / 100)} rounded={rounded} position={position} positionX={positionX} photoSize={photoSize}
            border="3px solid #000"
          />
        )}
      </div>
      <hr style={{ border: 'none', borderTop: '2px solid #111', marginBottom: 16, marginTop: 12 }} />

      {data.summary && (
        <p style={{ fontSize: 12, color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>{data.summary}</p>
      )}

      {data.experiences.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <MinSection label="EXPÉRIENCES" color={color} />
          {data.experiences.map(e => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 12 }}>{e.position} — {e.company}</strong>
                <span style={{ fontSize: 10, color: '#9ca3af' }}>
                  {e.startDate}{e.startDate && '–'}{e.current ? 'Présent' : e.endDate}
                </span>
              </div>
              {e.description && <BulletBlock text={e.description} />}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <MinSection label="FORMATIONS" color={color} />
          {data.education.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
              <span><strong>{e.degree}</strong> · {e.institution}</span>
              <span style={{ color: '#9ca3af', fontSize: 10 }}>{e.year}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 32 }}>
        {data.skills.length > 0 && (
          <div style={{ flex: 1 }}>
            <MinSection label="COMPÉTENCES" color={color} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {data.skills.map(s => (
                <span key={s.id} style={{ fontSize: 10, border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 8px' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div style={{ flex: '0 0 auto' }}>
            <MinSection label="LANGUES" color={color} />
            {data.languages.map(l => (
              <div key={l.id} style={{ fontSize: 11, marginBottom: 2 }}>
                {l.name} <span style={{ color: '#9ca3af' }}>· {l.level}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Dark Template ─────────────────────────────────────────────

function DarkTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ color, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
  )
}

function DarkTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''
  const lastName = nameParts[nameParts.length - 1] || 'Nom'

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#070707', color: 'white', padding: '40px 40px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', minHeight: '100%' }}>
      {/* Profile — full width */}
      <div style={{ gridColumn: '1 / -1', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {p.photo && (
            <PhotoFrame src={p.photo} size={Math.round(110 * photoContainerSize / 100)} rounded={rounded} position={position} positionX={positionX} photoSize={photoSize}
              border={`2px solid ${color}`}
            />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ margin: 0 }}>
              <span style={{ display: 'block', color: 'white', fontWeight: 200, fontSize: 22, textTransform: 'uppercase', letterSpacing: 2 }}>
                {firstName}
              </span>
              <span style={{ display: 'block', color, fontWeight: 700, fontSize: 44, textTransform: 'uppercase', lineHeight: 1, letterSpacing: 1 }}>
                {lastName}
              </span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 400, textTransform: 'uppercase', margin: '6px 0 0', opacity: 0.8 }}>
              {p.title || 'Votre titre'}
            </p>
            {data.summary && (
              <p style={{ marginTop: 10, fontSize: 11.5, fontWeight: 400, color: '#727171', lineHeight: 1.7, maxWidth: 480 }}>
                {data.summary}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Group 1 — left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {data.skills.length > 0 && (
          <div>
            <DarkTitle label="Expertise" color={color} />
            <ul style={{ marginTop: 8, marginLeft: 18, lineHeight: 2, fontSize: 12, fontWeight: 400, color: '#727171' }}>
              {data.skills.map(s => <li key={s.id}>{s.name}</li>)}
            </ul>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <DarkTitle label="Education" color={color} />
            {data.education.map(e => (
              <div key={e.id} style={{ marginTop: 14 }}>
                <p style={{ fontSize: 11, color: '#727171', fontWeight: 300, margin: 0 }}>{e.year}</p>
                <h4 style={{ fontSize: 13, fontWeight: 500, margin: '5px 0 2px', color: 'white' }}>{e.degree}</h4>
                <p style={{ fontSize: 11, color: '#727171', margin: 0 }}>{e.institution}{e.mention ? ` · ${e.mention}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <DarkTitle label="Certifications" color={color} />
            {data.certifications.map(c => (
              <div key={c.id} style={{ marginTop: 14 }}>
                {c.date && <p style={{ fontSize: 11, color: '#727171', fontWeight: 300, margin: 0 }}>{c.date}</p>}
                <h4 style={{ fontSize: 13, fontWeight: 500, margin: '5px 0 2px', color: 'white' }}>{c.title}</h4>
                <p style={{ fontSize: 11, color: '#727171', margin: 0 }}>{c.organization}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group 2 — right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {data.experiences.length > 0 && (
          <div>
            <DarkTitle label="Experience" color={color} />
            {data.experiences.map(e => (
              <div key={e.id} style={{ marginTop: 14 }}>
                <p style={{ fontSize: 11, color: '#727171', fontWeight: 300, margin: 0 }}>
                  {e.startDate}{e.startDate ? ' - ' : ''}{e.current ? 'Présent' : e.endDate}
                </p>
                <h4 style={{ fontSize: 13, fontWeight: 500, margin: '5px 0 2px', color: 'white' }}>{e.company}</h4>
                <p style={{ fontSize: 11, color: '#727171', margin: 0 }}>{e.position}</p>
                {e.description && (
                  <p style={{ fontSize: 11, color: '#727171', marginTop: 6, lineHeight: 1.6 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div>
            <DarkTitle label="Langues" color={color} />
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {data.languages.map(l => (
                <div key={l.id} style={{ fontSize: 12, color: '#727171', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span style={{ color: 'white', fontWeight: 500, fontSize: 12 }}>{l.name}</span>
                  <span style={{ fontSize: 10 }}>{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HR */}
      <div style={{ gridColumn: '1 / -1', borderTop: '2px solid rgba(128,128,128,0.2)', margin: '4px 0' }} />

      {/* Group 3 — contact + socials */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '48px', justifyContent: 'center' }}>
        {(p.city || p.phone || p.email) && (
          <div>
            <DarkTitle label="Contact" color={color} />
            <div style={{ marginTop: 10 }}>
              {p.city && <p style={{ fontSize: 12, color: '#727171', marginTop: 6 }}>{p.city}</p>}
              {p.phone && <p style={{ fontSize: 12, color: '#727171', marginTop: 6 }}>{p.phone}</p>}
              {p.email && <p style={{ fontSize: 12, color: '#727171', marginTop: 6 }}>{p.email}</p>}
            </div>
          </div>
        )}
        {(p.github || p.linkedin) && (
          <div>
            <DarkTitle label="Socials" color={color} />
            <div style={{ marginTop: 10 }}>
              {p.github && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#727171', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 11 }}>gh</span>
                  <span>{p.github}</span>
                </div>
              )}
              {p.linkedin && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#727171', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 11 }}>in</span>
                  <span>{p.linkedin}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Creative Template ─────────────────────────────────────────

function CreativeTemplate({ data, color, rounded, position }: {
  data: ResumeData; color: string; rounded: boolean; position: number
}) {
  const p = data.personal
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', background: '#fff', display: 'flex', minHeight: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: 160, background: color, padding: '24px 14px', color: '#fff', flexShrink: 0 }}>
        {p.photo ? (
          <PhotoFrame
            src={p.photo} size={72} rounded={rounded} position={position} positionX={50} photoSize={100}
            border="2px solid rgba(255,255,255,0.4)"
          />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            {(p.name || 'N').charAt(0)}
          </div>
        )}
        <div style={{ marginTop: p.photo ? 10 : 0, marginBottom: 4 }}>
          {p.email && <div style={{ fontSize: 9, opacity: 0.9, marginBottom: 4, wordBreak: 'break-all' }}>{p.email}</div>}
          {p.phone && <div style={{ fontSize: 9, opacity: 0.9, marginBottom: 4 }}>{p.phone}</div>}
          {p.city && <div style={{ fontSize: 9, opacity: 0.9, marginBottom: 4 }}>{p.city}</div>}
          {p.linkedin && <div style={{ fontSize: 9, opacity: 0.9, marginBottom: 4, wordBreak: 'break-all' }}>{p.linkedin}</div>}
        </div>

        {data.skills.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, opacity: 0.7, textTransform: 'uppercase', marginBottom: 8 }}>Compétences</div>
            {data.skills.map(s => (
              <div key={s.id} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 10, marginBottom: 2 }}>{s.name}</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: s.level === 'expert' ? '100%' : s.level === 'intermédiaire' ? '66%' : '33%', background: '#fff', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, opacity: 0.7, textTransform: 'uppercase', marginBottom: 8 }}>Langues</div>
            {data.languages.map(l => (
              <div key={l.id} style={{ fontSize: 10, marginBottom: 3 }}>
                {l.name} <span style={{ opacity: 0.7 }}>· {l.level}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '24px 20px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{p.name || 'Votre Nom'}</h1>
        <p style={{ fontSize: 13, color, fontWeight: 600, margin: '3px 0 16px' }}>{p.title || 'Votre titre'}</p>

        {data.summary && (
          <p style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.7, marginBottom: 18 }}>{data.summary}</p>
        )}

        {data.experiences.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <CreativeSection label="Expériences" color={color} />
            {data.experiences.map(e => (
              <div key={e.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 2, background: color, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{e.position}</span>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>
                      {e.startDate}{e.startDate && '–'}{e.current ? 'Présent' : e.endDate}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color, margin: '1px 0 4px' }}>{e.company}</p>
                  {e.description && <BulletBlock text={e.description} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <CreativeSection label="Formations" color={color} />
            {data.education.map(e => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{e.degree}</span>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>{e.year}</span>
                </div>
                <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>{e.institution} {e.mention && `· ${e.mention}`}</p>
              </div>
            ))}
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <CreativeSection label="Certifications" color={color} />
            {data.certifications.map(c => (
              <div key={c.id} style={{ fontSize: 11, marginBottom: 4 }}>
                <strong>{c.title}</strong> · {c.organization} {c.date && `(${c.date})`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Classic Template ──────────────────────────────────────────

function ClassicTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  const iconStyle: React.CSSProperties = {
    display: 'inline-block', background: '#000', width: 18, height: 18,
    color: '#fff', textAlign: 'center', borderRadius: '50%', fontSize: 9,
    marginRight: 12, lineHeight: '18px', flexShrink: 0,
  }
  const dotStyle: React.CSSProperties = {
    position: 'absolute', width: 11, height: 11, background: color,
    borderRadius: '50%', left: -26, top: 4,
  }
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif', color: '#1f2937', background: '#fff',
      display: 'grid', gridTemplateColumns: '35% 60%', columnGap: '5%',
      rowGap: 24, padding: '32px', minHeight: '100%',
    }}>

      {/* Row 1 — Left: Avatar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {p.photo ? (
          <PhotoFrame src={p.photo} size={Math.round(100 * photoContainerSize / 100)} rounded={rounded}
            position={position} positionX={positionX} photoSize={photoSize} />
        ) : (
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e5e7eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 36, color: '#9ca3af', fontWeight: 700 }}>
            {(p.name || 'N').charAt(0)}
          </div>
        )}
      </div>

      {/* Row 1 — Right: Name + contact */}
      <div style={{ paddingLeft: 20, borderLeft: '1px solid #000' }}>
        <h1 style={{ fontWeight: 300, fontSize: 28, margin: '0 0 4px', lineHeight: 1.1 }}>
          {p.name || 'Votre Nom'}
        </h1>
        <p style={{ margin: '0 0 10px', fontWeight: 700, letterSpacing: 3, fontSize: 11, textTransform: 'uppercase' }}>
          {p.title || 'Votre titre'}
        </p>
        <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
          {p.phone && (
            <li style={{ padding: '3px 0', display: 'flex', alignItems: 'center', transform: 'translateX(-30px)', background: '#fff' }}>
              <span style={iconStyle}>P</span>
              <span style={{ fontSize: 11 }}>{p.phone}</span>
            </li>
          )}
          {p.email && (
            <li style={{ padding: '3px 0', display: 'flex', alignItems: 'center', transform: 'translateX(-30px)', background: '#fff' }}>
              <span style={iconStyle}>E</span>
              <span style={{ fontSize: 11 }}>{p.email}</span>
            </li>
          )}
          {(p.linkedin || p.github) && (
            <li style={{ padding: '3px 0', display: 'flex', alignItems: 'center', transform: 'translateX(-30px)', background: '#fff' }}>
              <span style={iconStyle}>W</span>
              <span style={{ fontSize: 11, color }}>{p.linkedin || p.github}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Row 2 — Left: Personal info */}
      <div>
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', textAlign: 'right', lineHeight: '28px', fontSize: 11 }}>
          {p.city && <li><b>{p.city}</b></li>}
          {data.languages.length > 0 && data.languages.map(l => (
            <li key={l.id}>{l.name} <span style={{ color: '#9ca3af' }}>· {l.level}</span></li>
          ))}
        </ul>
      </div>

      {/* Row 2 — Right: Summary */}
      {data.summary ? (
        <div style={{ paddingLeft: 20, borderLeft: '1px solid #000', textAlign: 'justify' }}>
          <h2 style={{ padding: 0, margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Profil</h2>
          <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#4b5563' }}>{data.summary}</p>
        </div>
      ) : <div />}

      {/* Row 3 — Left: Experience only */}
      <div style={{ textAlign: 'right' }}>
        {data.experiences.length > 0 && (
          <div>
            <h2 style={{ padding: 0, margin: '0 0 12px', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Expérience</h2>
            {data.experiences.map(e => (
              <div key={e.id} style={{ marginBottom: 14 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700 }}>{e.position}</h4>
                <div style={{ fontSize: 10, color: '#6b7280' }}>
                  <span>{e.startDate}{e.startDate && ' – '}{e.current ? 'Présent' : e.endDate}</span>
                  {e.company && <span> · {e.company}</span>}
                </div>
                {e.description && (
                  <p style={{ fontSize: 10, color: '#4b5563', margin: '4px 0 0', lineHeight: 1.5 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 3 — Right: Education + Certifications + Skills */}
      <div style={{ paddingLeft: 20, borderLeft: '1px solid #000' }}>
        {data.education.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ padding: 0, margin: '0 0 12px', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Formation</h2>
            {data.education.map(e => (
              <div key={e.id} style={{ marginBottom: 14, position: 'relative', textAlign: 'justify' }}>
                <div style={dotStyle} />
                <h4 style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 700 }}>{e.degree}</h4>
                <div style={{ fontSize: 11, color, fontWeight: 500 }}>{e.institution}</div>
                {e.year && <div style={{ fontSize: 10, color: '#6b7280' }}>{e.year}{e.mention && ` · ${e.mention}`}</div>}
              </div>
            ))}
          </div>
        )}
        {data.certifications.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ padding: 0, margin: '0 0 12px', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Certifications</h2>
            {data.certifications.map(c => (
              <div key={c.id} style={{ marginBottom: 12, position: 'relative', textAlign: 'justify' }}>
                <div style={dotStyle} />
                <h4 style={{ margin: '0 0 3px', fontSize: 12, fontWeight: 700 }}>{c.title}</h4>
                <div style={{ fontSize: 11, color, fontWeight: 500 }}>{c.organization}</div>
                {c.date && <div style={{ fontSize: 10, color: '#6b7280' }}>{c.date}</div>}
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h2 style={{ padding: 0, margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', fontWeight: 700 }}>Compétences</h2>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {data.skills.map(s => (
                <li key={s.id} style={{ padding: '4px 0', fontSize: 11, borderTop: '1px solid #f3f4f6',
                                        display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Model-25 Template ─────────────────────────────────────────

function Model25Template({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''
  const lastName = nameParts[nameParts.length - 1] || ''
  const frameSize = Math.round(90 * photoContainerSize / 100)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#fff', background: '#070707', minHeight: '100%', padding: '36px 32px 28px' }}>
      {/* ── Profile header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, marginBottom: 20 }}>
        {/* Photo */}
        {p.photo ? (
          <div style={{ flexShrink: 0 }}>
            <PhotoFrame src={p.photo} size={frameSize} rounded={rounded}
              position={position} positionX={positionX} photoSize={photoSize}
              border={`3px solid ${color}`} />
          </div>
        ) : (
          <div style={{ width: frameSize, height: frameSize, borderRadius: rounded ? '50%' : 6,
                        border: `3px solid ${color}`, background: '#1a1a1a', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, fontWeight: 700, color }} >
            {(p.name || 'N').charAt(0)}
          </div>
        )}
        {/* Name + title + summary */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 300, color: '#fff', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 0, lineHeight: 1 }}>{firstName}</p>
          <p style={{ fontSize: 52, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: 2, lineHeight: 1, margin: '2px 0 6px' }}>{lastName}</p>
          {p.title && <p style={{ fontSize: 10, textTransform: 'uppercase', color: '#aaa', letterSpacing: 2, marginBottom: 10 }}>{p.title}</p>}
          {data.summary && <p style={{ fontSize: 10, color: '#727171', lineHeight: 1.7, maxWidth: 440 }}>{data.summary}</p>}
        </div>
      </div>

      {/* ── Separator ── */}
      <hr style={{ border: 'none', borderTop: '1px solid #2a2a2a', marginBottom: 22 }} />

      {/* ── Two-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        {/* Left column */}
        <div>
          {/* Experiences */}
          {data.experiences.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Expériences</p>
              {data.experiences.map(e => (
                <div key={e.id} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, color: '#727171', marginBottom: 2 }}>
                    {e.startDate}{e.startDate && ' – '}{e.current ? 'Présent' : e.endDate}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 1 }}>{e.position}</p>
                  <p style={{ fontSize: 10, color: '#aaa', marginBottom: e.description ? 3 : 0 }}>{e.company}</p>
                  {e.description && <p style={{ fontSize: 10, color: '#727171', lineHeight: 1.6 }}>{e.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Études</p>
              {data.education.map(e => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  {e.year && <p style={{ fontSize: 10, color: '#727171', marginBottom: 2 }}>{e.year}</p>}
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 1 }}>{e.degree}</p>
                  <p style={{ fontSize: 10, color: '#aaa' }}>{e.institution}{e.mention ? ` · ${e.mention}` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Langues</p>
              {data.languages.map(l => (
                <div key={l.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: '#fff' }}>{l.name}</span>
                    <span style={{ fontSize: 10, color: '#aaa' }}>{l.level}</span>
                  </div>
                  <div style={{ background: '#1e1e1e', borderRadius: 4, height: 4 }}>
                    <div style={{ height: '100%', borderRadius: 4, background: color, width: `${({ A1: 15, A2: 30, B1: 45, B2: 60, C1: 80, C2: 95, Natif: 100 } as Record<string, number>)[l.level] ?? 50}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          {(p.email || p.phone || p.city || p.linkedin || p.github) && (
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Contact</p>
              {p.city && <p style={{ fontSize: 10, color: '#727171', marginBottom: 4 }}>{p.city}</p>}
              {p.phone && <p style={{ fontSize: 10, color: '#727171', marginBottom: 4 }}>{p.phone}</p>}
              {p.email && <p style={{ fontSize: 10, color: '#727171', marginBottom: 4 }}>{p.email}</p>}
              {p.linkedin && <p style={{ fontSize: 10, color: '#727171', marginBottom: 4 }}>{p.linkedin}</p>}
              {p.github && <p style={{ fontSize: 10, color: '#727171', marginBottom: 4 }}>{p.github}</p>}
            </div>
          )}
        </div>

        {/* Right column */}
        <div>
          {/* Skills */}
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Compétences</p>
              {data.skills.map(s => (
                <div key={s.id} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: '#fff' }}>{s.name}</span>
                    <span style={{ fontSize: 9, color: '#aaa', textTransform: 'capitalize' }}>{s.level}</span>
                  </div>
                  <div style={{ background: '#1e1e1e', borderRadius: 4, height: 4 }}>
                    <div style={{ height: '100%', borderRadius: 4, background: color, width: s.level === 'expert' ? '100%' : s.level === 'intermédiaire' ? '66%' : '33%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Certifications</p>
              {data.certifications.map(c => (
                <div key={c.id} style={{ marginBottom: 10 }}>
                  {c.date && <p style={{ fontSize: 10, color: '#727171', marginBottom: 2 }}>{c.date}</p>}
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginBottom: 1 }}>{c.title}</p>
                  {c.organization && <p style={{ fontSize: 10, color: '#aaa' }}>{c.organization}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreativeSection({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────

function SectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ borderBottom: `2px solid ${color}`, paddingBottom: 3, marginBottom: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
    </div>
  )
}

function MinSection({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5, color, marginBottom: 8 }}>{label}</div>
  )
}


// ── Standard Template ─────────────────────────────────────────

// ── Standard Pro helpers ───────────────────────────────────────

function darkenHex(hex: string, amount: number = 0.3): string {
  const clean = hex.replace('#', '')
  const r = Math.round(parseInt(clean.slice(0, 2), 16) * (1 - amount))
  const g = Math.round(parseInt(clean.slice(2, 4), 16) * (1 - amount))
  const b = Math.round(parseInt(clean.slice(4, 6), 16) * (1 - amount))
  return `rgb(${r},${g},${b})`
}

function getLangPercent(level: string): string {
  const l = level.toLowerCase()
  if (l.includes('natif') || l.includes('maternel') || l.includes('bilingue')) return '95%'
  if (l.includes('courant') || l.includes('avancé') || l.includes('c1') || l.includes('c2')) return '75%'
  if (l.includes('intermédiaire') || l.includes('b1') || l.includes('b2') || l.includes('scolaire')) return '50%'
  if (l.includes('débutant') || l.includes('notions') || l.includes('a1') || l.includes('a2')) return '25%'
  return '55%'
}

function ProLeftTitle({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 22, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
      <div style={{ fontSize: 8.5, fontWeight: 800, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.8, textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
    </div>
  )
}

function ProSectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ marginTop: 22, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 16, borderRadius: 2, background: color, flexShrink: 0 }} />
        <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0f172a', letterSpacing: 1.2, textTransform: 'uppercase' as const }}>
          {label}
        </div>
      </div>
      <div style={{ height: 1, background: `linear-gradient(to right, ${color}60, transparent)`, marginTop: 6 }} />
    </div>
  )
}

function IconSVG({ path, size = 9 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={path} />
    </svg>
  )
}

function StandardProTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  const leftW = 248
  const darkColor = darkenHex(color, 0.28)

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#1f2937', background: '#fff', minHeight: '297mm' }}>

      {/* ── Left column ── */}
      <div style={{
        width: leftW, flexShrink: 0, boxSizing: 'border-box',
        backgroundImage: `linear-gradient(160deg, ${color} 0%, ${darkColor} 100%)`,
        padding: '0 0 36px', color: '#fff',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Photo zone */}
        <div style={{ padding: '32px 28px 16px', textAlign: 'center' }}>
          {p.photo ? (
            <div style={{ display: 'inline-block', padding: 3, borderRadius: rounded ? '50%' : 8, background: 'rgba(255,255,255,0.25)' }}>
              <PhotoFrame
                src={p.photo}
                size={Math.round(104 * photoContainerSize / 100)}
                rounded={rounded}
                position={position}
                positionX={positionX}
                photoSize={photoSize}
                border="none"
              />
            </div>
          ) : (
            <div style={{ height: 16 }} />
          )}
        </div>

        <div style={{ padding: '0 28px', flex: 1 }}>
          {/* Personal info */}
          <ProLeftTitle label="Contact" />
          <div style={{ fontSize: 10.5, lineHeight: 1, color: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {p.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <IconSVG path="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.4 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                <span>{p.phone}</span>
              </div>
            )}
            {p.email && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <IconSVG path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
                <span style={{ wordBreak: 'break-all' as const, lineHeight: 1.4 }}>{p.email}</span>
              </div>
            )}
            {p.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <IconSVG path="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 100-6 3 3 0 000 6z" />
                <span>{p.city}</span>
              </div>
            )}
            {p.linkedin && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <IconSVG path="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
                <span style={{ wordBreak: 'break-all' as const, lineHeight: 1.4 }}>{p.linkedin}</span>
              </div>
            )}
            {p.github && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <IconSVG path="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                <span style={{ wordBreak: 'break-all' as const, lineHeight: 1.4 }}>{p.github}</span>
              </div>
            )}
          </div>

          {/* Languages */}
          {data.languages.length > 0 && (
            <>
              <ProLeftTitle label="Langues" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {data.languages.map(l => (
                  <div key={l.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: 'rgba(255,255,255,0.95)', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>{l.level}</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.18)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: getLangPercent(l.level), background: 'rgba(255,255,255,0.75)', borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* IT tools (certifications) */}
          {data.certifications.length > 0 && (
            <>
              <ProLeftTitle label="Outils" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {data.certifications.map(c => (
                  <div key={c.id} style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0, marginTop: 4 }} />
                    <span>{c.title}{c.organization ? ` — ${c.organization}` : ''}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Skills / Qualities */}
          {data.skills.length > 0 && (
            <>
              <ProLeftTitle label="Qualités" />
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px 5px' }}>
                {data.skills.map(s => (
                  <div key={s.id} style={{
                    fontSize: 9.5, color: 'rgba(255,255,255,0.92)',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 20, padding: '3px 9px',
                    fontWeight: 500,
                  }}>
                    {s.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <div style={{
          backgroundImage: 'linear-gradient(145deg, #f8fafc 0%, #edf2f7 100%)',
          padding: '0 36px 24px',
          position: 'relative' as const,
          overflow: 'hidden' as const,
        }}>
          {/* Top accent bar */}
          <div style={{ height: 5, backgroundImage: `linear-gradient(to right, ${color}, ${color}55)`, marginLeft: -36, marginRight: -36, marginBottom: 24 }} />
          {/* Decorative circle (background) */}
          <div style={{ position: 'absolute' as const, right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: `${color}12`, pointerEvents: 'none' as const }} />
          <div style={{ position: 'absolute' as const, right: 20, top: -10, width: 60, height: 60, borderRadius: '50%', background: `${color}0d`, pointerEvents: 'none' as const }} />

          <div style={{ fontSize: 27, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5, lineHeight: 1.1 }}>
            {p.name || 'Votre Nom'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: color, marginTop: 6, letterSpacing: 0.4 }}>
            {p.title || 'Votre titre'}
          </div>
          {data.summary && (
            <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 10, lineHeight: 1.75, maxWidth: '95%', borderLeft: `3px solid ${color}40`, paddingLeft: 10 }}>
              {data.summary}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '4px 36px 36px', flex: 1 }}>

          {/* Experiences */}
          {data.experiences.length > 0 && (
            <>
              <ProSectionTitle label="Expériences professionnelles" color={color} />
              <div>
                {data.experiences.map((exp, idx) => (
                  <div key={exp.id} style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
                    {/* Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 14 }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, border: '2px solid #fff', boxShadow: `0 0 0 2px ${color}55`, flexShrink: 0, marginTop: 2 }} />
                      {idx < data.experiences.length - 1 && (
                        <div style={{ flex: 1, width: 1.5, background: `${color}30`, minHeight: 16, marginTop: 3 }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>{exp.position}</div>
                        <div style={{ fontSize: 9.5, color: '#fff', background: `${color}cc`, borderRadius: 12, padding: '2px 8px', whiteSpace: 'nowrap' as const, flexShrink: 0, fontWeight: 600 }}>
                          {exp.startDate} – {exp.current ? 'Présent' : exp.endDate}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: color, fontWeight: 700, marginBottom: 4, marginTop: 1 }}>
                        {exp.company}
                      </div>
                      {exp.description && (
                        <div style={{ fontSize: 10.5, color: '#475569', lineHeight: 1.65 }}>
                          {exp.description.split('\n').map((line, i) => (
                            <p key={i} style={{ margin: '1px 0' }}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <>
              <ProSectionTitle label="Études & formations" color={color} />
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12, display: 'flex', gap: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: `${color}55`, flexShrink: 0, marginTop: 3 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>{edu.degree}</div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{edu.year}</div>
                    </div>
                    <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>{edu.institution}</div>
                    {edu.mention && (
                      <div style={{ fontSize: 10.5, color: '#64748b', fontStyle: 'italic' }}>{edu.mention}</div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Standard (original) helpers ────────────────────────────────

// ── Standard Premium helpers ───────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function PremLeftTitle({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 20, marginBottom: 8 }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 2.5, textTransform: 'uppercase' as const }}>
        {label}
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.2)', marginTop: 5 }} />
    </div>
  )
}

function PremSectionTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ marginTop: 20, marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 18, borderRadius: 2, background: color, flexShrink: 0 }} />
        <div style={{ fontSize: 11, fontWeight: 800, color: '#111827', letterSpacing: 1.5, textTransform: 'uppercase' as const }}>
          {label}
        </div>
      </div>
      <div style={{ height: 1.5, background: `linear-gradient(to right, ${color}, transparent)`, marginTop: 5 }} />
    </div>
  )
}

// ── Standard Template ─────────────────────────────────────────

function StdLeftTitle({ label }: { label: string }) {
  return (
    <div style={{ position: 'relative', margin: '22px 0 10px' }}>
      <div style={{
        position: 'absolute', left: -28, right: -16, top: -6, bottom: -6,
        backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 7,
        boxShadow: '2px 3px 8px rgba(0,0,0,0.25)',
      }} />
      <div style={{ position: 'relative', fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: 0.5, zIndex: 1 }}>
        {label}
      </div>
    </div>
  )
}

function StdSectionTitle({ label }: { label: string }) {
  return (
    <div style={{ marginTop: 20, marginBottom: 10 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: '#1f2937' }}>{label}</div>
      <div style={{ height: 2, background: '#9ca3af', marginTop: 5, borderRadius: 1 }} />
    </div>
  )
}

function StandardTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  const headerBg = '#bdc3cd'
  const leftW = 245

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#1f2937', background: '#fff', minHeight: '297mm' }}>

      {/* ── Left column ── */}
      <div style={{ width: leftW, backgroundColor: color, padding: '36px 28px', color: '#fff', flexShrink: 0, boxSizing: 'border-box' }}>

        {/* Photo */}
        {p.photo && (
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <PhotoFrame
              src={p.photo}
              size={Math.round(110 * photoContainerSize / 100)}
              rounded={rounded}
              position={position}
              positionX={positionX}
              photoSize={photoSize}
              border="3px solid rgba(255,255,255,0.5)"
            />
          </div>
        )}

        {/* Personal info */}
        <StdLeftTitle label="INFO PERSONNELLES" />
        <div style={{ fontSize: 11, lineHeight: 1.9, color: 'rgba(255,255,255,0.92)' }}>
          {p.phone && <div>📞 {p.phone}</div>}
          {p.email && <div style={{ wordBreak: 'break-all' }}>✉ {p.email}</div>}
          {p.city && <div>📍 {p.city}</div>}
          {p.linkedin && <div style={{ wordBreak: 'break-all' }}>in {p.linkedin}</div>}
          {p.github && <div style={{ wordBreak: 'break-all' }}>⌥ {p.github}</div>}
        </div>

        {/* Languages */}
        {data.languages.length > 0 && (
          <>
            <StdLeftTitle label="LANGUES" />
            <div style={{ fontSize: 11, lineHeight: 2, color: 'rgba(255,255,255,0.92)' }}>
              {data.languages.map(l => (
                <div key={l.id}>▸ {l.name} — {l.level}</div>
              ))}
            </div>
          </>
        )}

        {/* IT tools (certifications) */}
        {data.certifications.length > 0 && (
          <>
            <StdLeftTitle label="OUTILS INFORMATIQUES" />
            <div style={{ fontSize: 11, lineHeight: 2, color: 'rgba(255,255,255,0.92)' }}>
              {data.certifications.map(c => (
                <div key={c.id}>▸ {c.title}{c.organization ? ` — ${c.organization}` : ''}</div>
              ))}
            </div>
          </>
        )}

        {/* Skills / Qualities */}
        {data.skills.length > 0 && (
          <>
            <StdLeftTitle label="QUALITÉS" />
            <div style={{ fontSize: 11, lineHeight: 2, color: 'rgba(255,255,255,0.92)' }}>
              {data.skills.map(s => (
                <div key={s.id}>▸ {s.name}</div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Right column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <div style={{ backgroundColor: headerBg, padding: '32px 36px' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1f2937', letterSpacing: 0.5 }}>
            {p.name || 'Votre Nom'}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: color, marginTop: 4 }}>
            {p.title || 'Votre titre'}
          </div>
          {data.summary && (
            <div style={{ fontSize: 11, color: '#4b5563', marginTop: 10, lineHeight: 1.7 }}>
              {data.summary}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '8px 36px 36px', flex: 1 }}>

          {/* Experiences */}
          {data.experiences.length > 0 && (
            <>
              <StdSectionTitle label="Expériences professionnelles" />
              {data.experiences.map(exp => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{exp.position}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {exp.startDate} – {exp.current ? 'Présent' : exp.endDate}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: color, fontWeight: 600, marginBottom: 3 }}>
                    {exp.company}
                  </div>
                  {exp.description && (
                    <div style={{ fontSize: 11, color: '#4b5563', lineHeight: 1.6 }}>
                      {exp.description.split('\n').map((line, i) => (
                        <p key={i} style={{ margin: '1px 0' }}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <>
              <StdSectionTitle label="Études & formations" />
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>{edu.degree}</div>
                    <div style={{ fontSize: 10, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.year}</div>
                  </div>
                  <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>{edu.institution}</div>
                  {edu.mention && (
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{edu.mention}</div>
                  )}
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Standard Premium Template ─────────────────────────────────

function StandardPremiumTemplate({ data, color, rounded, position, positionX, photoSize, photoContainerSize }: {
  data: ResumeData; color: string; rounded: boolean; position: number; positionX: number; photoSize: number; photoContainerSize: number
}) {
  const p = data.personal
  const darkColor = darkenHex(color, 0.28)
  const lightBg = hexToRgba(color, 0.06)
  const lightBorder = hexToRgba(color, 0.18)
  const cardShadow = '0 1px 4px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)'
  const leftW = 242

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', color: '#1f2937', background: '#f1f5f9', minHeight: '297mm' }}>

      {/* ── Left column ── */}
      <div style={{
        width: leftW, flexShrink: 0, boxSizing: 'border-box',
        background: `linear-gradient(175deg, ${color} 0%, ${darkColor} 100%)`,
        // Ombre interne droite → sépare visuellement les deux colonnes
        boxShadow: 'inset -8px 0 18px rgba(0,0,0,0.14)',
        padding: '0 0 36px', color: '#fff', display: 'flex', flexDirection: 'column',
      }}>
        {/* Photo zone */}
        <div style={{ padding: '32px 24px 12px', textAlign: 'center' }}>
          {p.photo ? (
            <div style={{
              display: 'inline-block',
              padding: 5,
              borderRadius: rounded ? '50%' : 14,
              background: 'rgba(255,255,255,0.18)',
              // Double anneau + ombre portée profonde
              boxShadow: '0 8px 28px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.5), 0 0 0 5px rgba(255,255,255,0.15)',
            }}>
              <PhotoFrame
                src={p.photo}
                size={Math.round(100 * photoContainerSize / 100)}
                rounded={rounded}
                position={position}
                positionX={positionX}
                photoSize={photoSize}
                border="none"
              />
            </div>
          ) : (
            <div style={{ height: 16 }} />
          )}
        </div>

        <div style={{ padding: '0 24px', flex: 1 }}>
          {/* Contact — bloc card transparent */}
          <PremLeftTitle label="Contact" />
          <div style={{
            fontSize: 10.5, color: 'rgba(255,255,255,0.9)',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex', flexDirection: 'column', gap: 7,
            // Légère ombre interne haut → effet de profondeur
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.1)',
          }}>
            {p.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <IconSVG path="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.4 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                <span>{p.phone}</span>
              </div>
            )}
            {p.email && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <IconSVG path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
                <span style={{ wordBreak: 'break-all' as const, lineHeight: 1.4 }}>{p.email}</span>
              </div>
            )}
            {p.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <IconSVG path="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 100-6 3 3 0 000 6z" />
                <span>{p.city}</span>
              </div>
            )}
            {p.linkedin && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <IconSVG path="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
                <span style={{ wordBreak: 'break-all' as const, lineHeight: 1.4 }}>{p.linkedin}</span>
              </div>
            )}
            {p.github && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <IconSVG path="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                <span style={{ wordBreak: 'break-all' as const, lineHeight: 1.4 }}>{p.github}</span>
              </div>
            )}
          </div>

          {/* Languages with progress bars — barre avec ombre interne (creux) */}
          {data.languages.length > 0 && (
            <>
              <PremLeftTitle label="Langues" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.languages.map(l => (
                  <div key={l.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: 'rgba(255,255,255,0.92)', marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>{l.level}</span>
                    </div>
                    {/* Track — ombre interne = effet creusé */}
                    <div style={{ height: 5, background: 'rgba(0,0,0,0.25)', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
                      {/* Fill — ombre portée = effet en relief */}
                      <div style={{
                        height: '100%', width: getLangPercent(l.level),
                        background: 'rgba(255,255,255,0.85)',
                        borderRadius: 4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* IT tools */}
          {data.certifications.length > 0 && (
            <>
              <PremLeftTitle label="Outils" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {data.certifications.map(c => (
                  <div key={c.id} style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.65)', flexShrink: 0, marginTop: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
                    <span>{c.title}{c.organization ? ` — ${c.organization}` : ''}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Skills as pills — ombre portée sur chaque badge */}
          {data.skills.length > 0 && (
            <>
              <PremLeftTitle label="Compétences" />
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                {data.skills.map(s => (
                  <div key={s.id} style={{
                    fontSize: 9.5,
                    color: 'rgba(255,255,255,0.95)',
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: 20,
                    padding: '3px 9px',
                    lineHeight: 1.4,
                    // Ombre portée sur les pills = profondeur
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}>{s.name}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right column ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>

        {/* Accent top stripe */}
        <div style={{ height: 4, background: `linear-gradient(to right, ${color}, ${darkColor})` }} />

        {/* Header — surélevé avec ombre portée bas */}
        <div style={{
          background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
          padding: '26px 28px 22px',
          borderBottom: '1px solid #e2e8f0',
          // Ombre portée vers le bas → header "flottant" au-dessus du contenu
          boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#111827', letterSpacing: 0.4, lineHeight: 1.1 }}>
            {p.name || 'Votre Nom'}
          </div>
          <div style={{ height: 3, width: 52, borderRadius: 2, background: color, marginTop: 7, marginBottom: 7, boxShadow: `0 2px 6px ${hexToRgba(color, 0.4)}` }} />
          <div style={{ fontSize: 14, fontWeight: 700, color: color, letterSpacing: 0.3 }}>
            {p.title || 'Votre titre'}
          </div>
          {data.summary && (
            <div style={{ fontSize: 10.5, color: '#4b5563', marginTop: 9, lineHeight: 1.75, maxWidth: '96%' }}>
              {data.summary}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '4px 28px 36px', flex: 1, background: '#f8fafc' }}>

          {/* Experiences */}
          {data.experiences.length > 0 && (
            <>
              <PremSectionTitle label="Expériences professionnelles" color={color} />
              {data.experiences.map((exp, idx) => (
                <div key={exp.id} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 14 }}>
                    {/* Dot avec halo coloré = effet "épingle" */}
                    <div style={{
                      width: 9, height: 9, borderRadius: '50%',
                      background: color, flexShrink: 0,
                      boxShadow: `0 0 0 3px ${hexToRgba(color, 0.18)}, 0 2px 5px rgba(0,0,0,0.15)`,
                    }} />
                    {idx < data.experiences.length - 1 && (
                      <div style={{ width: 1.5, flex: 1, minHeight: 12, background: lightBorder, marginTop: 4 }} />
                    )}
                  </div>
                  {/* Card avec ombre portée */}
                  <div style={{
                    flex: 1, minWidth: 0,
                    background: '#ffffff',
                    border: `1px solid #e8edf3`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: '0 8px 8px 0',
                    padding: '10px 14px',
                    boxShadow: cardShadow,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' as const }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{exp.position}</div>
                      {/* Badge date avec ombre interne = creux */}
                      <div style={{
                        fontSize: 9, color: color,
                        background: lightBg, border: `1px solid ${lightBorder}`,
                        borderRadius: 10, padding: '2px 8px',
                        whiteSpace: 'nowrap' as const, flexShrink: 0,
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
                      }}>
                        {exp.startDate} – {exp.current ? 'Présent' : exp.endDate}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: color, fontWeight: 600, marginBottom: 5 }}>
                      {exp.company}
                    </div>
                    {exp.description && (
                      <div style={{ fontSize: 10.5, color: '#4b5563', lineHeight: 1.65 }}>
                        {exp.description.split('\n').map((line, i) => (
                          <p key={i} style={{ margin: '1px 0' }}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <>
              <PremSectionTitle label="Études & formations" color={color} />
              {data.education.map(edu => (
                <div key={edu.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  {/* Diamond marker */}
                  <div style={{
                    width: 9, height: 9, borderRadius: 2,
                    background: color, flexShrink: 0, marginTop: 14,
                    transform: 'rotate(45deg)',
                    boxShadow: `0 0 0 2px ${hexToRgba(color, 0.2)}, 0 2px 4px rgba(0,0,0,0.12)`,
                  }} />
                  {/* Card formation */}
                  <div style={{
                    flex: 1,
                    background: '#ffffff',
                    border: '1px solid #e8edf3',
                    borderLeft: `3px solid ${hexToRgba(color, 0.45)}`,
                    borderRadius: '0 8px 8px 0',
                    padding: '10px 14px',
                    boxShadow: cardShadow,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{edu.degree}</div>
                      <div style={{
                        fontSize: 9, color: color,
                        background: lightBg, border: `1px solid ${lightBorder}`,
                        borderRadius: 10, padding: '2px 8px',
                        whiteSpace: 'nowrap' as const, flexShrink: 0,
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
                      }}>{edu.year}</div>
                    </div>
                    <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>{edu.institution}</div>
                    {edu.mention && (
                      <div style={{ fontSize: 10.5, color: '#6b7280', marginTop: 2 }}>{edu.mention}</div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

const ZOOM_STEPS = [0.4, 0.5, 0.6, 0.75, 0.9, 1.0]

export function ResumePreview({ data, template, primaryColor, roundedPhoto, photoPosition, photoSize, photoPositionX, photoContainerSize }: ResumePreviewProps) {
  const isEmpty = !data.personal.name && !data.personal.title && data.experiences.length === 0
  const containerRef = useRef<HTMLDivElement>(null)
  const [baseScale, setBaseScale] = useState(1)
  // zoomIdx: index in ZOOM_STEPS, null = auto (fit width)
  const [zoomIdx, setZoomIdx] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const available = containerRef.current.clientWidth - 32
      setBaseScale(Math.min(1, available / CV_WIDTH_PX))
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const scale = zoomIdx !== null ? ZOOM_STEPS[zoomIdx] : baseScale

  const zoomOut = () => {
    const cur = zoomIdx !== null ? zoomIdx : ZOOM_STEPS.indexOf(baseScale) !== -1 ? ZOOM_STEPS.indexOf(baseScale) : ZOOM_STEPS.findIndex(s => s >= baseScale)
    const next = (cur > 0 ? cur : ZOOM_STEPS.findIndex(s => s >= scale)) - 1
    if (next >= 0) setZoomIdx(next)
  }

  const zoomIn = () => {
    const cur = zoomIdx !== null ? zoomIdx : ZOOM_STEPS.findIndex(s => s >= scale)
    const next = cur < ZOOM_STEPS.length - 1 ? cur + 1 : cur
    setZoomIdx(next)
  }

  const resetZoom = () => setZoomIdx(null)

  const pct = Math.round(scale * 100)

  const cvContent = (
    <>
      {template === 'modern' && <ModernTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
      {template === 'minimal' && <MinimalTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
{template === 'dark' && <DarkTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
      {template === 'classic' && <ClassicTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
      {template === 'creative' && <CreativeTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} />}
      {template === 'model-25' && <Model25Template data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
      {template === 'standard' && <StandardTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
      {template === 'standard-pro' && <StandardProTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
      {template === 'standard-premium' && <StandardPremiumTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} positionX={photoPositionX} photoSize={photoSize} photoContainerSize={photoContainerSize} />}
    </>
  )

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-y-auto bg-[#1c1c1c]">
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <div className="text-5xl mb-3 opacity-20">📄</div>
            <p className="text-gray-500 text-sm">Remplissez le formulaire pour voir l&apos;aperçu</p>
          </div>
        </div>
      )}

      {/* Zoom controls — sticky bottom-right */}
      <div className="sticky bottom-4 z-20 flex justify-end pr-4 pointer-events-none">
        <div className="flex items-center gap-1 bg-[#1a1a1a]/90 backdrop-blur border border-[#333] rounded-xl px-2 py-1.5 shadow-xl pointer-events-auto">
          <button
            onClick={zoomOut}
            disabled={zoomIdx === 0 || (zoomIdx === null && scale <= ZOOM_STEPS[0])}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold transition-colors"
            title="Zoom arrière"
          >−</button>
          <button
            onClick={resetZoom}
            title={zoomIdx !== null ? 'Revenir au zoom automatique' : 'Zoom automatique (actif)'}
            className={`text-xs font-mono w-10 text-center transition-colors ${zoomIdx === null ? 'text-violet-400' : 'text-gray-300 hover:text-white'}`}
          >
            {pct}%
          </button>
          <button
            onClick={zoomIn}
            disabled={zoomIdx === ZOOM_STEPS.length - 1}
            className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold transition-colors"
            title="Zoom avant"
          >+</button>
        </div>
      </div>

      {/* CV wrapper */}
      <div style={{ paddingTop: 16, paddingBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: CV_WIDTH_PX * scale }}>
          <div
            id="cv-preview-root"
            className="shadow-2xl rounded-sm overflow-hidden"
            style={{
              width: CV_WIDTH_PX,
              minHeight: '297mm',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              background: (template === 'dark' || template === 'model-25') ? '#070707' : '#fff',
            }}
          >
            {cvContent}
          </div>
        </div>
      </div>
    </div>
  )
}
