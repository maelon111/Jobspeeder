'use client'
import { ResumeData, TemplateType } from '@/types/resume'

interface ResumePreviewProps {
  data: ResumeData
  template: TemplateType
  primaryColor: string
  roundedPhoto: boolean
  photoPosition: number
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

function PhotoFrame({ src, size, rounded, position, border }: {
  src: string; size: number; rounded: boolean; position: number; border?: string
}) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0, overflow: 'hidden',
      borderRadius: rounded ? '50%' : 6,
      border: border ?? 'none',
    }}>
      <img
        src={src}
        alt="Photo"
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: `center ${position}%`,
        }}
      />
    </div>
  )
}

// ── Modern Template ───────────────────────────────────────────

function ModernTemplate({ data, color, rounded, position }: {
  data: ResumeData; color: string; rounded: boolean; position: number
}) {
  const p = data.personal
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1f2937', background: '#fff', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ background: color, padding: '24px 28px', color: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
        {p.photo && (
          <PhotoFrame
            src={p.photo} size={64} rounded={rounded} position={position}
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

function MinimalTemplate({ data, color, rounded, position }: {
  data: ResumeData; color: string; rounded: boolean; position: number
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
            src={p.photo} size={72} rounded={rounded} position={position}
            border={`3px solid ${color}`}
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
            src={p.photo} size={72} rounded={rounded} position={position}
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

// ── Dark Template ─────────────────────────────────────────────

function DarkTitle({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ color, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
  )
}

function DarkTemplate({ data, color, rounded, position }: {
  data: ResumeData; color: string; rounded: boolean; position: number
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
            <PhotoFrame src={p.photo} size={110} rounded={rounded} position={position} />
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

function CreativeSection({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────

export function ResumePreview({ data, template, primaryColor, roundedPhoto, photoPosition }: ResumePreviewProps) {
  const isEmpty = !data.personal.name && !data.personal.title && data.experiences.length === 0

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-100 p-4">
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-center">
            <div className="text-5xl mb-3 opacity-20">📄</div>
            <p className="text-gray-400 text-sm">Remplissez le formulaire pour voir l&apos;aperçu</p>
          </div>
        </div>
      )}
      <div
        id="cv-preview-root"
        className="shadow-xl mx-auto rounded-sm overflow-hidden"
        style={{
          width: '210mm',
          minHeight: '297mm',
          transformOrigin: 'top left',
          background: template === 'dark' ? '#070707' : '#fff',
        }}
      >
        {template === 'modern' && <ModernTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} />}
        {template === 'minimal' && <MinimalTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} />}
        {template === 'creative' && <CreativeTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} />}
        {template === 'dark' && <DarkTemplate data={data} color={primaryColor} rounded={roundedPhoto} position={photoPosition} />}
      </div>
    </div>
  )
}
