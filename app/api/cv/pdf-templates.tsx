import React from 'react'
import {
  Document, Page, View, Text, StyleSheet, Font, Image,
} from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'

Font.registerHyphenationCallback(word => [word])

export const skillWidth = (level: string) =>
  level === 'expert' ? '100%' : level === 'intermédiaire' ? '66%' : '33%'

export const dateRange = (start: string, current: boolean, end: string) =>
  `${start}${start ? ' – ' : ''}${current ? 'Présent' : end}`

export function PhotoFramePDF({
  src, size, rounded, photoSize, positionX, borderColor, borderWidth,
}: {
  src: string; size: number; rounded: boolean; photoSize: number; positionX: number; borderColor?: string; borderWidth?: number
}) {
  const bw = borderWidth ?? 0
  const innerSize = size - bw * 2
  const imgSize = innerSize * photoSize / 100
  const overflow = imgSize - innerSize
  const imgMargin = overflow > 0 ? -overflow * 0.5 : 0
  const xOffset = (positionX - 50) * 0.6
  const radius = rounded ? size / 2 : 4
  const innerRadius = rounded ? innerSize / 2 : 4

  return React.createElement(View, {
    style: {
      width: size, height: size,
      borderRadius: radius,
      borderWidth: bw,
      borderStyle: bw > 0 ? 'solid' : undefined,
      borderColor: bw > 0 ? borderColor : undefined,
      flexShrink: 0,
      marginLeft: xOffset,
    },
  },
    React.createElement(View, {
      style: {
        width: innerSize, height: innerSize,
        borderRadius: innerRadius,
        overflow: 'hidden',
      },
    },
      React.createElement(Image, {
        src,
        style: { width: imgSize, height: imgSize, marginLeft: imgMargin, marginTop: imgMargin },
      })
    )
  )
}

// ─── Modern ───────────────────────────────────────────────────────────────────

export function ModernPDF({ data, color, photoSize, positionX, containerSize }: { data: ResumeData; color: string; photoSize: number; positionX: number; containerSize?: number }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, color: '#1f2937', backgroundColor: '#ffffff' },
    header: { backgroundColor: color, padding: '20 24', color: '#ffffff' },
    headerName: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
    headerTitle: { fontSize: 12, opacity: 0.9, marginBottom: 8 },
    headerContact: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, fontSize: 9 },
    columns: { flexDirection: 'row', flex: 1 },
    left: { width: '35%', padding: '14 12', borderRight: `1pt solid #e5e7eb` },
    right: { flex: 1, padding: '14 14' },
    sectionLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1.5pt solid ${color}`, paddingBottom: 2, marginBottom: 7 },
    sectionBlock: { marginBottom: 14 },
    expTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
    expCompany: { fontSize: 9, color, fontStyle: 'italic', marginBottom: 3 },
    expDate: { fontSize: 8, color: '#9ca3af' },
    expDesc: { fontSize: 9, color: '#4b5563', marginTop: 1, lineHeight: 1.5 },
    skillRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9, marginBottom: 1 },
    skillBar: { height: 2, backgroundColor: '#e5e7eb', borderRadius: 2, marginBottom: 5 },
    skillFill: { height: 2, backgroundColor: color, borderRadius: 2 },
    langRow: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 9, marginBottom: 2 },
    summaryText: { fontSize: 9, color: '#4b5563', lineHeight: 1.6 },
  })

  const contactParts = [p.email, p.phone, p.city, p.linkedin, p.github].filter(Boolean)

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(View, { style: { ...s.header, flexDirection: 'row', alignItems: 'center', gap: 12 } },
        p.photo ? React.createElement(PhotoFramePDF, {
          src: p.photo, size: Math.round(52 * (containerSize ?? 100) / 100), rounded: true, photoSize, positionX,
          borderColor: '#ffffff', borderWidth: 2,
        }) : null,
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: s.headerName }, p.name || ''),
          p.title ? React.createElement(Text, { style: s.headerTitle }, p.title) : null,
          React.createElement(View, { style: s.headerContact },
            ...contactParts.map((c, i) => React.createElement(Text, { key: i }, c))
          )
        )
      ),
      React.createElement(View, { style: s.columns },
        React.createElement(View, { style: s.left },
          data.summary ? React.createElement(View, { style: s.sectionBlock },
            React.createElement(Text, { style: s.sectionLabel }, 'Profil'),
            React.createElement(Text, { style: s.summaryText }, data.summary)
          ) : null,
          data.skills.length ? React.createElement(View, { style: s.sectionBlock },
            React.createElement(Text, { style: s.sectionLabel }, 'Compétences'),
            ...data.skills.map((sk, i) => React.createElement(View, { key: i },
              React.createElement(View, { style: s.skillRow },
                React.createElement(Text, null, sk.name),
                React.createElement(Text, { style: { color: '#9ca3af', textTransform: 'capitalize' } }, sk.level)
              ),
              React.createElement(View, { style: s.skillBar },
                React.createElement(View, { style: { ...s.skillFill, width: skillWidth(sk.level) } })
              )
            ))
          ) : null,
          data.languages.length ? React.createElement(View, { style: s.sectionBlock },
            React.createElement(Text, { style: s.sectionLabel }, 'Langues'),
            ...data.languages.map((l, i) => React.createElement(View, { key: i, style: s.langRow },
              React.createElement(Text, null, l.name),
              React.createElement(Text, { style: { color, fontFamily: 'Helvetica-Bold' } }, l.level)
            ))
          ) : null,
          data.certifications.length ? React.createElement(View, { style: s.sectionBlock },
            React.createElement(Text, { style: s.sectionLabel }, 'Certifications'),
            ...data.certifications.map((c, i) => React.createElement(View, { key: i, style: { marginBottom: 5 } },
              React.createElement(Text, { style: { fontSize: 9, fontFamily: 'Helvetica-Bold' } }, c.title),
              React.createElement(Text, { style: { fontSize: 8, color: '#6b7280' } }, `${c.organization}${c.date ? ` · ${c.date}` : ''}`)
            ))
          ) : null,
        ),
        React.createElement(View, { style: s.right },
          data.experiences.length ? React.createElement(View, { style: s.sectionBlock },
            React.createElement(Text, { style: s.sectionLabel }, 'Expériences'),
            ...data.experiences.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 10 } },
              React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                React.createElement(Text, { style: s.expTitle }, e.position),
                React.createElement(Text, { style: s.expDate }, dateRange(e.startDate, e.current, e.endDate))
              ),
              React.createElement(Text, { style: s.expCompany }, e.company),
              e.description ? React.createElement(Text, { style: s.expDesc }, e.description) : null
            ))
          ) : null,
          data.education.length ? React.createElement(View, { style: s.sectionBlock },
            React.createElement(Text, { style: s.sectionLabel }, 'Formations'),
            ...data.education.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 8 } },
              React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                React.createElement(Text, { style: { fontSize: 10, fontFamily: 'Helvetica-Bold' } }, e.degree),
                React.createElement(Text, { style: s.expDate }, e.year)
              ),
              React.createElement(Text, { style: { fontSize: 9, color: '#4b5563' } }, `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`)
            ))
          ) : null,
        )
      )
    )
  )
}

// ─── Minimal ──────────────────────────────────────────────────────────────────

export function MinimalPDF({ data, color, photoSize, positionX, containerSize }: { data: ResumeData; color: string; photoSize: number; positionX: number; containerSize?: number }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, color: '#111', backgroundColor: '#ffffff', padding: '28 32' },
    name: { fontSize: 26, fontFamily: 'Helvetica-Bold', letterSpacing: -0.5, marginBottom: 3 },
    subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 7 },
    contact: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, fontSize: 9, color: '#6b7280', marginBottom: 12 },
    hr: { borderBottom: `2pt solid #111`, marginBottom: 14 },
    summary: { fontSize: 10, color: '#4b5563', lineHeight: 1.7, marginBottom: 18 },
    sectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, color, marginBottom: 7, textTransform: 'uppercase' },
    expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    expTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
    expDate: { fontSize: 8, color: '#9ca3af' },
    expDesc: { fontSize: 9, color: '#4b5563', marginTop: 2, lineHeight: 1.5 },
    bottom: { flexDirection: 'row', gap: 28, marginTop: 14 },
    skillTag: { fontSize: 8, border: `1pt solid #e5e7eb`, borderRadius: 3, padding: '2 7', marginRight: 5, marginBottom: 4 },
    skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  })

  const contactParts = [p.email, p.phone, p.city, p.linkedin, p.github].filter(Boolean)

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(View, { style: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 4 } },
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: s.name }, p.name || ''),
          p.title ? React.createElement(Text, { style: s.subtitle }, p.title) : null,
          React.createElement(View, { style: s.contact },
            ...contactParts.map((c, i) => React.createElement(Text, { key: i }, c))
          ),
        ),
        p.photo ? React.createElement(PhotoFramePDF, {
          src: p.photo, size: Math.round(60 * (containerSize ?? 100) / 100), rounded: true, photoSize, positionX,
          borderColor: '#000000', borderWidth: 3,
        }) : null,
      ),
      React.createElement(View, { style: s.hr }),
      data.summary ? React.createElement(Text, { style: s.summary }, data.summary) : null,
      data.experiences.length ? React.createElement(View, null,
        React.createElement(Text, { style: s.sectionLabel }, 'Expériences'),
        ...data.experiences.map((e, i) => React.createElement(View, { key: i, style: s.expRow },
          React.createElement(View, null,
            React.createElement(Text, { style: s.expTitle }, `${e.position} — ${e.company}`),
            e.description ? React.createElement(Text, { style: s.expDesc }, e.description) : null
          ),
          React.createElement(Text, { style: s.expDate }, dateRange(e.startDate, e.current, e.endDate))
        ))
      ) : null,
      data.education.length ? React.createElement(View, { style: { marginTop: 14 } },
        React.createElement(Text, { style: s.sectionLabel }, 'Formations'),
        ...data.education.map((e, i) => React.createElement(View, { key: i, style: s.expRow },
          React.createElement(Text, null,
            React.createElement(Text, { style: { fontFamily: 'Helvetica-Bold', fontSize: 10 } }, e.degree),
            React.createElement(Text, { style: { fontSize: 9, color: '#6b7280' } }, ` · ${e.institution}${e.mention ? ` · ${e.mention}` : ''}`)
          ),
          React.createElement(Text, { style: s.expDate }, e.year)
        ))
      ) : null,
      React.createElement(View, { style: s.bottom },
        data.skills.length ? React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, { style: s.sectionLabel }, 'Compétences'),
          React.createElement(View, { style: s.skillsWrap },
            ...data.skills.map((sk, i) => React.createElement(Text, { key: i, style: s.skillTag }, sk.name))
          )
        ) : null,
        data.languages.length ? React.createElement(View, null,
          React.createElement(Text, { style: s.sectionLabel }, 'Langues'),
          ...data.languages.map((l, i) => React.createElement(Text, { key: i, style: { fontSize: 9, marginBottom: 2 } },
            `${l.name} · ${l.level}`
          ))
        ) : null,
      )
    )
  )
}

// ─── Creative ─────────────────────────────────────────────────────────────────

export function CreativePDF({ data, color, photoSize, positionX, containerSize }: { data: ResumeData; color: string; photoSize: number; positionX: number; containerSize?: number }) {
  const p = data.personal
  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, color: '#1f2937', backgroundColor: '#ffffff', flexDirection: 'row' },
    sidebar: { width: 155, backgroundColor: color, padding: '22 13', color: '#ffffff' },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
    contactItem: { fontSize: 8, opacity: 0.9, marginBottom: 4, color: '#ffffff' },
    sbSection: { fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 1, opacity: 0.7, textTransform: 'uppercase', marginTop: 14, marginBottom: 7, color: '#ffffff' },
    skillName: { fontSize: 9, marginBottom: 2, color: '#ffffff' },
    skillBarOuter: { height: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1, marginBottom: 5 },
    skillBarInner: { height: 2, backgroundColor: '#ffffff', borderRadius: 1 },
    main: { flex: 1, padding: '22 18' },
    mainName: { fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    mainTitle: { fontSize: 12, color, fontFamily: 'Helvetica-Bold', marginBottom: 14 },
    summary: { fontSize: 9, color: '#4b5563', lineHeight: 1.7, marginBottom: 16 },
    csLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5, color, marginBottom: 8, borderBottom: `1pt solid #e5e7eb`, paddingBottom: 3 },
    expEntry: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    timelineBar: { width: 2, backgroundColor: color, borderRadius: 1, marginTop: 2 },
    expPos: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
    expDate: { fontSize: 8, color: '#9ca3af' },
    expCompany: { fontSize: 9, color, marginTop: 1, marginBottom: 3 },
    expDesc: { fontSize: 9, color: '#4b5563', lineHeight: 1.5 },
  })

  const initials = (p.name || 'N').charAt(0).toUpperCase()
  const contactParts = [p.email, p.phone, p.city, p.linkedin].filter(Boolean)

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(View, { style: s.sidebar },
        p.photo
          ? React.createElement(PhotoFramePDF, {
              src: p.photo, size: Math.round(58 * (containerSize ?? 100) / 100), rounded: true, photoSize, positionX,
              borderColor: '#1f2937', borderWidth: 2,
            })
          : React.createElement(View, { style: s.avatar },
              React.createElement(Text, { style: s.avatarText }, initials)
            ),
        ...contactParts.map((c, i) => React.createElement(Text, { key: i, style: s.contactItem }, c)),
        data.skills.length ? React.createElement(View, null,
          React.createElement(Text, { style: s.sbSection }, 'Compétences'),
          ...data.skills.map((sk, i) => React.createElement(View, { key: i },
            React.createElement(Text, { style: s.skillName }, sk.name),
            React.createElement(View, { style: s.skillBarOuter },
              React.createElement(View, { style: { ...s.skillBarInner, width: skillWidth(sk.level) } })
            )
          ))
        ) : null,
        data.languages.length ? React.createElement(View, null,
          React.createElement(Text, { style: s.sbSection }, 'Langues'),
          ...data.languages.map((l, i) => React.createElement(Text, { key: i, style: { fontSize: 9, marginBottom: 2, color: '#ffffff' } },
            `${l.name} · ${l.level}`
          ))
        ) : null,
      ),
      React.createElement(View, { style: s.main },
        React.createElement(Text, { style: s.mainName }, p.name || ''),
        p.title ? React.createElement(Text, { style: s.mainTitle }, p.title) : null,
        data.summary ? React.createElement(Text, { style: s.summary }, data.summary) : null,
        data.experiences.length ? React.createElement(View, { style: { marginBottom: 14 } },
          React.createElement(Text, { style: s.csLabel }, 'Expériences'),
          ...data.experiences.map((e, i) => React.createElement(View, { key: i, style: s.expEntry },
            React.createElement(View, { style: s.timelineBar }),
            React.createElement(View, { style: { flex: 1 } },
              React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                React.createElement(Text, { style: s.expPos }, e.position),
                React.createElement(Text, { style: s.expDate }, dateRange(e.startDate, e.current, e.endDate))
              ),
              React.createElement(Text, { style: s.expCompany }, e.company),
              e.description ? React.createElement(Text, { style: s.expDesc }, e.description) : null
            )
          ))
        ) : null,
        data.education.length ? React.createElement(View, null,
          React.createElement(Text, { style: s.csLabel }, 'Formations'),
          ...data.education.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 7 } },
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
              React.createElement(Text, { style: { fontSize: 10, fontFamily: 'Helvetica-Bold' } }, e.degree),
              React.createElement(Text, { style: s.expDate }, e.year)
            ),
            React.createElement(Text, { style: { fontSize: 9, color: '#6b7280' } }, `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`)
          ))
        ) : null,
        data.certifications.length ? React.createElement(View, { style: { marginTop: 14 } },
          React.createElement(Text, { style: s.csLabel }, 'Certifications'),
          ...data.certifications.map((c, i) => React.createElement(Text, { key: i, style: { fontSize: 9, marginBottom: 3 } },
            `${c.title} · ${c.organization}${c.date ? ` (${c.date})` : ''}`
          ))
        ) : null,
      )
    )
  )
}

// ─── Dark ─────────────────────────────────────────────────────────────────────

export function DarkPDF({ data, color }: { data: ResumeData; color: string; photoSize?: number; positionX?: number; containerSize?: number }) {
  const p = data.personal
  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''
  const lastName = nameParts[nameParts.length - 1] || ''

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, color: '#ffffff', backgroundColor: '#070707', padding: '32 32 28 32' },
    header: { marginBottom: 20 },
    firstName: { fontSize: 16, fontFamily: 'Helvetica', color: '#ffffff', letterSpacing: 2 },
    lastName: { fontSize: 36, fontFamily: 'Helvetica-Bold', color, letterSpacing: 1, lineHeight: 1 },
    title: { fontSize: 10, color: '#aaaaaa', marginTop: 5 },
    summary: { fontSize: 9, color: '#727171', lineHeight: 1.7, marginTop: 8, maxWidth: 380 },
    cols: { flexDirection: 'row', gap: 28, marginTop: 20 },
    left: { flex: 1 },
    right: { flex: 1 },
    sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color, letterSpacing: 1, marginBottom: 10 },
    block: { marginBottom: 22 },
    entryDate: { fontSize: 9, color: '#727171', marginBottom: 3 },
    entryName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 2 },
    entrySub: { fontSize: 9, color: '#727171' },
    entryDesc: { fontSize: 9, color: '#727171', lineHeight: 1.6, marginTop: 4 },
    skillItem: { fontSize: 9, color: '#727171', lineHeight: 1.9 },
    hr: { borderBottom: '1pt solid rgba(128,128,128,0.2)', marginTop: 20, marginBottom: 14 },
    contactRow: { flexDirection: 'row', gap: 40, justifyContent: 'center' },
    contactLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color, letterSpacing: 1, marginBottom: 6 },
    contactItem: { fontSize: 9, color: '#727171', marginBottom: 4 },
  })

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(View, { style: s.header },
        React.createElement(Text, { style: s.firstName }, firstName),
        React.createElement(Text, { style: s.lastName }, lastName),
        p.title ? React.createElement(Text, { style: s.title }, p.title) : null,
        data.summary ? React.createElement(Text, { style: s.summary }, data.summary) : null,
      ),
      React.createElement(View, { style: s.cols },
        React.createElement(View, { style: s.left },
          data.skills.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Expertise'),
            ...data.skills.map((sk, i) => React.createElement(Text, { key: i, style: s.skillItem }, `• ${sk.name}`))
          ) : null,
          data.education.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Formation'),
            ...data.education.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 10 } },
              e.year ? React.createElement(Text, { style: s.entryDate }, e.year) : null,
              React.createElement(Text, { style: s.entryName }, e.degree),
              React.createElement(Text, { style: s.entrySub }, `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`)
            ))
          ) : null,
          data.certifications.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Certifications'),
            ...data.certifications.map((c, i) => React.createElement(View, { key: i, style: { marginBottom: 10 } },
              c.date ? React.createElement(Text, { style: s.entryDate }, c.date) : null,
              React.createElement(Text, { style: s.entryName }, c.title),
              React.createElement(Text, { style: s.entrySub }, c.organization)
            ))
          ) : null,
        ),
        React.createElement(View, { style: s.right },
          data.experiences.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Expérience'),
            ...data.experiences.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 12 } },
              React.createElement(Text, { style: s.entryDate }, dateRange(e.startDate, e.current, e.endDate)),
              React.createElement(Text, { style: s.entryName }, e.company),
              React.createElement(Text, { style: s.entrySub }, e.position),
              e.description ? React.createElement(Text, { style: s.entryDesc }, e.description) : null
            ))
          ) : null,
          data.languages.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Langues'),
            ...data.languages.map((l, i) => React.createElement(Text, { key: i, style: s.skillItem }, `${l.name} · ${l.level}`))
          ) : null,
        ),
      ),
      React.createElement(View, { style: s.hr }),
      React.createElement(View, { style: s.contactRow },
        (p.city || p.phone || p.email) ? React.createElement(View, null,
          React.createElement(Text, { style: s.contactLabel }, 'Contact'),
          p.city ? React.createElement(Text, { style: s.contactItem }, p.city) : null,
          p.phone ? React.createElement(Text, { style: s.contactItem }, p.phone) : null,
          p.email ? React.createElement(Text, { style: s.contactItem }, p.email) : null,
        ) : null,
        (p.github || p.linkedin) ? React.createElement(View, null,
          React.createElement(Text, { style: s.contactLabel }, 'Socials'),
          p.github ? React.createElement(Text, { style: s.contactItem }, `gh · ${p.github}`) : null,
          p.linkedin ? React.createElement(Text, { style: s.contactItem }, `in · ${p.linkedin}`) : null,
        ) : null,
      )
    )
  )
}

// ─── Classic ──────────────────────────────────────────────────────────────────

export function ClassicPDF({ data, color, photoSize, positionX, containerSize }: { data: ResumeData; color: string; photoSize: number; positionX: number; containerSize?: number }) {
  const p = data.personal
  const cSize = containerSize ?? 100

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, color: '#1f2937', backgroundColor: '#ffffff', padding: '32 32 28 32' },
    grid: { display: 'flex', flexDirection: 'row', gap: 20 },
    left: { width: '35%' },
    right: { flex: 1, borderLeft: '1pt solid #000', paddingLeft: 16 },
    name: { fontSize: 22, fontFamily: 'Helvetica', marginBottom: 2 },
    title: { fontSize: 9, letterSpacing: 2, marginBottom: 12, color: '#374151' },
    contactItem: { fontSize: 9, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
    contactBullet: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#000000', color: '#ffffff', fontSize: 7, textAlign: 'center', paddingTop: 3 },
    sectionHeader: { fontSize: 11, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
    entryTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    entryCompany: { fontSize: 10, color, marginBottom: 2 },
    entryDate: { fontSize: 9, color: '#9ca3af', marginBottom: 4 },
    entryDesc: { fontSize: 9, color: '#4b5563', lineHeight: 1.6 },
    rightText: { fontSize: 10, color: '#4b5563', marginBottom: 4, textAlign: 'right' },
    dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: color, marginRight: 8, marginTop: 2 },
  })

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(View, { style: s.grid },
        // Left column
        React.createElement(View, { style: s.left },
          p.photo ? React.createElement(PhotoFramePDF, { src: p.photo, size: Math.round(cSize * 0.8), rounded: true, positionX, photoSize }) : null,
          p.city ? React.createElement(View, { style: { marginTop: 12 } },
            React.createElement(Text, { style: s.rightText }, p.city)
          ) : null,
          data.languages.length ? React.createElement(View, { style: { marginTop: 8 } },
            ...data.languages.map((l, i) => React.createElement(Text, { key: i, style: s.rightText }, `${l.name} · ${l.level}`))
          ) : null,
        ),
        // Right column
        React.createElement(View, { style: s.right },
          React.createElement(Text, { style: s.name }, p.name || ''),
          p.title ? React.createElement(Text, { style: s.title }, p.title.toUpperCase()) : null,
          (p.phone || p.email || p.linkedin) ? React.createElement(View, { style: { marginBottom: 8 } },
            p.phone ? React.createElement(View, { style: s.contactItem },
              React.createElement(View, { style: s.contactBullet }, React.createElement(Text, null, 'P')),
              React.createElement(Text, { style: { fontSize: 9 } }, p.phone)
            ) : null,
            p.email ? React.createElement(View, { style: s.contactItem },
              React.createElement(View, { style: s.contactBullet }, React.createElement(Text, null, 'E')),
              React.createElement(Text, { style: { fontSize: 9 } }, p.email)
            ) : null,
            p.linkedin ? React.createElement(View, { style: s.contactItem },
              React.createElement(View, { style: s.contactBullet }, React.createElement(Text, null, 'W')),
              React.createElement(Text, { style: { fontSize: 9, color } }, p.linkedin)
            ) : null,
          ) : null,
          data.summary ? React.createElement(View, null,
            React.createElement(Text, { style: s.sectionHeader }, 'Profil'),
            React.createElement(Text, { style: { fontSize: 9, color: '#4b5563', lineHeight: 1.6, marginBottom: 8 } }, data.summary)
          ) : null,
          data.experiences.length ? React.createElement(View, null,
            React.createElement(Text, { style: s.sectionHeader }, 'Expériences'),
            ...data.experiences.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 10, flexDirection: 'row', gap: 6 } },
              React.createElement(View, { style: s.dot }),
              React.createElement(View, { style: { flex: 1 } },
                React.createElement(Text, { style: s.entryTitle }, e.position),
                React.createElement(Text, { style: s.entryCompany }, e.company),
                React.createElement(Text, { style: s.entryDate }, dateRange(e.startDate, e.current, e.endDate)),
                e.description ? React.createElement(Text, { style: s.entryDesc }, e.description) : null
              )
            ))
          ) : null,
          data.education.length ? React.createElement(View, null,
            React.createElement(Text, { style: s.sectionHeader }, 'Formation'),
            ...data.education.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 8, flexDirection: 'row', gap: 6 } },
              React.createElement(View, { style: s.dot }),
              React.createElement(View, { style: { flex: 1 } },
                React.createElement(Text, { style: s.entryTitle }, e.degree),
                React.createElement(Text, { style: { fontSize: 9, color: '#6b7280' } }, `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`),
                e.year ? React.createElement(Text, { style: s.entryDate }, e.year) : null
              )
            ))
          ) : null,
          data.skills.length ? React.createElement(View, null,
            React.createElement(Text, { style: s.sectionHeader }, 'Compétences'),
            ...data.skills.map((sk, i) => React.createElement(View, { key: i, style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
              React.createElement(View, { style: s.dot }),
              React.createElement(Text, { style: { fontSize: 9 } }, sk.name)
            ))
          ) : null,
        ),
      )
    )
  )
}

// ─── Model-25 ─────────────────────────────────────────────────────────────────

export function Model25PDF({ data, color, photoSize, positionX, containerSize }: { data: ResumeData; color: string; photoSize: number; positionX: number; containerSize?: number }) {
  const p = data.personal
  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''
  const lastName = nameParts[nameParts.length - 1] || ''
  const cSize = containerSize ?? 100
  const frameSize = Math.round(90 * cSize / 100)

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 11, color: '#ffffff', backgroundColor: '#070707', padding: '36 32 28 32' },
    header: { flexDirection: 'row', gap: 28, marginBottom: 20, alignItems: 'flex-start' },
    headerText: { flex: 1 },
    firstName: { fontSize: 13, color: '#ffffff', letterSpacing: 3, marginBottom: 0 },
    lastName: { fontSize: 42, fontFamily: 'Helvetica-Bold', color, letterSpacing: 2, lineHeight: 1, marginBottom: 6 },
    title: { fontSize: 9, color: '#aaaaaa', letterSpacing: 2, marginBottom: 8 },
    summary: { fontSize: 9, color: '#727171', lineHeight: 1.7, maxWidth: 440 },
    hr: { borderBottom: '1pt solid #2a2a2a', marginBottom: 20 },
    cols: { flexDirection: 'row', gap: 28 },
    col: { flex: 1 },
    sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color, letterSpacing: 1, marginBottom: 10 },
    entryDate: { fontSize: 9, color: '#727171', marginBottom: 2 },
    entryName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 1 },
    entrySub: { fontSize: 9, color: '#aaaaaa', marginBottom: 4 },
    entryDesc: { fontSize: 9, color: '#727171', lineHeight: 1.6 },
    skillName: { fontSize: 10, color: '#ffffff' },
    skillSub: { fontSize: 9, color: '#aaaaaa' },
    langName: { fontSize: 10, color: '#ffffff' },
    contactItem: { fontSize: 9, color: '#727171', marginBottom: 4 },
    block: { marginBottom: 20 },
  })

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: s.page },
      React.createElement(View, { style: s.header },
        p.photo ? React.createElement(PhotoFramePDF, { src: p.photo, size: frameSize, rounded: true, positionX, photoSize }) : null,
        React.createElement(View, { style: s.headerText },
          React.createElement(Text, { style: s.firstName }, firstName),
          React.createElement(Text, { style: s.lastName }, lastName),
          p.title ? React.createElement(Text, { style: s.title }, p.title.toUpperCase()) : null,
          data.summary ? React.createElement(Text, { style: s.summary }, data.summary) : null,
        ),
      ),
      React.createElement(View, { style: s.hr }),
      React.createElement(View, { style: s.cols },
        // Left column
        React.createElement(View, { style: s.col },
          data.experiences.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Expériences'),
            ...data.experiences.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 12 } },
              React.createElement(Text, { style: s.entryDate }, dateRange(e.startDate, e.current, e.endDate)),
              React.createElement(Text, { style: s.entryName }, e.position),
              React.createElement(Text, { style: s.entrySub }, e.company),
              e.description ? React.createElement(Text, { style: s.entryDesc }, e.description) : null
            ))
          ) : null,
          data.education.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Études'),
            ...data.education.map((e, i) => React.createElement(View, { key: i, style: { marginBottom: 10 } },
              e.year ? React.createElement(Text, { style: s.entryDate }, e.year) : null,
              React.createElement(Text, { style: s.entryName }, e.degree),
              React.createElement(Text, { style: s.entrySub }, `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`)
            ))
          ) : null,
          (p.email || p.phone || p.city || p.linkedin) ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Contact'),
            p.city ? React.createElement(Text, { style: s.contactItem }, p.city) : null,
            p.phone ? React.createElement(Text, { style: s.contactItem }, p.phone) : null,
            p.email ? React.createElement(Text, { style: s.contactItem }, p.email) : null,
            p.linkedin ? React.createElement(Text, { style: s.contactItem }, p.linkedin) : null,
          ) : null,
        ),
        // Right column
        React.createElement(View, { style: s.col },
          data.skills.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Compétences'),
            ...data.skills.map((sk, i) => React.createElement(View, { key: i, style: { marginBottom: 8 } },
              React.createElement(Text, { style: s.skillName }, sk.name),
              React.createElement(Text, { style: s.skillSub }, sk.level)
            ))
          ) : null,
          data.languages.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Langues'),
            ...data.languages.map((l, i) => React.createElement(View, { key: i, style: { marginBottom: 8 } },
              React.createElement(Text, { style: s.langName }, l.name),
              React.createElement(Text, { style: { fontSize: 9, color: '#aaaaaa' } }, l.level)
            ))
          ) : null,
          data.certifications.length ? React.createElement(View, { style: s.block },
            React.createElement(Text, { style: s.sectionTitle }, 'Certifications'),
            ...data.certifications.map((c, i) => React.createElement(View, { key: i, style: { marginBottom: 10 } },
              React.createElement(Text, { style: s.entryName }, c.title),
              React.createElement(Text, { style: s.entrySub }, c.organization),
              c.date ? React.createElement(Text, { style: s.entryDate }, c.date) : null
            ))
          ) : null,
        ),
      )
    )
  )
}
