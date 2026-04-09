import { NextRequest, NextResponse } from 'next/server'
import {
  Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle,
  Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign,
} from 'docx'
import { ResumeData, TemplateType } from '@/types/resume'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const hex = (color: string) => color.replace('#', '').toUpperCase()

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideH: noBorder, insideV: noBorder }

const skillWidth = (level: string) =>
  level === 'expert' ? '████████' : level === 'intermédiaire' ? '█████' : '██'

const dateRange = (start: string, current: boolean, end: string) =>
  `${start}${start ? ' – ' : ''}${current ? 'Présent' : end}`

function spacer(pts = 80) {
  return new Paragraph({ spacing: { after: pts } })
}

// ─── Modern template ──────────────────────────────────────────────────────────
// Colored header + two-column layout (left sidebar 35% / main 65%)

function buildModern(data: ResumeData, accentColor: string): (Paragraph | Table)[] {
  const p = data.personal
  const contactParts = [p.email, p.phone, p.city, p.linkedin, p.github].filter(Boolean)
  const sections: (Paragraph | Table)[] = []

  // ── Colored header ──────────────────────────────────────────────────────────
  const headerCell = new TableCell({
    shading: { fill: accentColor, type: ShadingType.SOLID, color: accentColor },
    borders: noBorders,
    margins: { top: 200, bottom: 200, left: 280, right: 280 },
    children: [
      new Paragraph({
        children: [new TextRun({ text: p.name || '', bold: true, size: 48, color: 'FFFFFF' })],
      }),
      ...(p.title ? [new Paragraph({
        children: [new TextRun({ text: p.title, size: 26, color: 'F3F4F6' })],
      })] : []),
      ...(contactParts.length ? [new Paragraph({
        children: [new TextRun({ text: contactParts.join('  ·  '), size: 18, color: 'E5E7EB' })],
        spacing: { before: 60 },
      })] : []),
    ],
  })

  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({ children: [headerCell] })],
  }))
  sections.push(spacer(60))

  // ── Left column paragraphs ──────────────────────────────────────────────────
  const leftChildren: Paragraph[] = []

  if (data.summary) {
    leftChildren.push(sectionHeaderModern('PROFIL', accentColor))
    leftChildren.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: 18, color: '4B5563' })],
      spacing: { after: 100 },
    }))
  }

  if (data.skills.length) {
    leftChildren.push(sectionHeaderModern('COMPÉTENCES', accentColor))
    for (const sk of data.skills) {
      leftChildren.push(new Paragraph({
        children: [
          new TextRun({ text: sk.name, size: 18, bold: true }),
          new TextRun({ text: `  ${skillWidth(sk.level)}`, size: 14, color: accentColor }),
        ],
        spacing: { after: 40 },
      }))
    }
    leftChildren.push(spacer(60))
  }

  if (data.languages.length) {
    leftChildren.push(sectionHeaderModern('LANGUES', accentColor))
    for (const l of data.languages) {
      leftChildren.push(new Paragraph({
        children: [
          new TextRun({ text: l.name, size: 18, bold: true }),
          new TextRun({ text: `  ${l.level}`, size: 16, color: '6B7280' }),
        ],
        spacing: { after: 40 },
      }))
    }
    leftChildren.push(spacer(60))
  }

  if (data.certifications.length) {
    leftChildren.push(sectionHeaderModern('CERTIFICATIONS', accentColor))
    for (const c of data.certifications) {
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: c.title, size: 18, bold: true })],
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: `${c.organization}${c.date ? ` · ${c.date}` : ''}`, size: 16, color: '6B7280' })],
        spacing: { after: 60 },
      }))
    }
  }

  // ── Right column paragraphs ─────────────────────────────────────────────────
  const rightChildren: Paragraph[] = []

  if (data.experiences.length) {
    rightChildren.push(sectionHeaderModern('EXPÉRIENCES', accentColor))
    for (const e of data.experiences) {
      rightChildren.push(new Paragraph({
        children: [
          new TextRun({ text: e.position, bold: true, size: 22 }),
          new TextRun({ text: `  ·  ${e.company}`, size: 20, color: accentColor }),
        ],
      }))
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: dateRange(e.startDate, e.current, e.endDate), size: 16, color: '9CA3AF' })],
      }))
      if (e.description) {
        for (const line of e.description.split('\n').filter(Boolean)) {
          rightChildren.push(new Paragraph({
            children: [new TextRun({ text: line, size: 18, color: '4B5563' })],
            bullet: { level: 0 },
          }))
        }
      }
      rightChildren.push(spacer(80))
    }
  }

  if (data.education.length) {
    rightChildren.push(sectionHeaderModern('FORMATIONS', accentColor))
    for (const e of data.education) {
      rightChildren.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree, bold: true, size: 22 }),
          new TextRun({ text: `  ·  ${e.institution}`, size: 20, color: '4B5563' }),
          ...(e.year ? [new TextRun({ text: `  —  ${e.year}`, size: 18, color: '9CA3AF' })] : []),
        ],
        spacing: { after: 60 },
      }))
    }
  }

  // ── Two-column table ────────────────────────────────────────────────────────
  sections.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          borders: { ...noBorders, right: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
          margins: { top: 0, bottom: 0, left: 0, right: 200 },
          verticalAlign: VerticalAlign.TOP,
          children: leftChildren,
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: noBorders,
          margins: { top: 0, bottom: 0, left: 200, right: 0 },
          verticalAlign: VerticalAlign.TOP,
          children: rightChildren,
        }),
      ],
    })],
  }))

  return sections
}

function sectionHeaderModern(label: string, color: string) {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true, size: 18, color, allCaps: true })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color } },
    spacing: { before: 120, after: 60 },
  })
}

// ─── Minimal template ─────────────────────────────────────────────────────────
// Single column, clean typography, skill tags

function buildMinimal(data: ResumeData, accentColor: string): (Paragraph | Table)[] {
  const p = data.personal
  const contactParts = [p.email, p.phone, p.city, p.linkedin, p.github].filter(Boolean)
  const sections: (Paragraph | Table)[] = []

  // Name
  sections.push(new Paragraph({
    children: [new TextRun({ text: p.name || '', bold: true, size: 52, color: '111111' })],
    spacing: { after: 40 },
  }))
  if (p.title) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: p.title, size: 26, color: '6B7280' })],
      spacing: { after: 60 },
    }))
  }
  if (contactParts.length) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join('  ·  '), size: 18, color: '6B7280' })],
      spacing: { after: 80 },
    }))
  }

  // HR
  sections.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '111111' } },
    spacing: { after: 120 },
    children: [],
  }))

  // Summary
  if (data.summary) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: 20, color: '4B5563' })],
      spacing: { after: 140 },
    }))
  }

  // Experiences
  if (data.experiences.length) {
    sections.push(sectionLabelMinimal('Expériences', accentColor))
    for (const e of data.experiences) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: `${e.position} — ${e.company}`, bold: true, size: 20 }),
          new TextRun({ text: `   ${dateRange(e.startDate, e.current, e.endDate)}`, size: 16, color: '9CA3AF' }),
        ],
      }))
      if (e.description) {
        sections.push(new Paragraph({
          children: [new TextRun({ text: e.description, size: 18, color: '4B5563' })],
          spacing: { after: 80 },
        }))
      } else {
        sections.push(spacer(60))
      }
    }
  }

  // Education
  if (data.education.length) {
    sections.push(sectionLabelMinimal('Formations', accentColor))
    for (const e of data.education) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree, bold: true, size: 20 }),
          new TextRun({ text: ` · ${e.institution}${e.mention ? ` · ${e.mention}` : ''}`, size: 18, color: '6B7280' }),
          ...(e.year ? [new TextRun({ text: `   ${e.year}`, size: 16, color: '9CA3AF' })] : []),
        ],
        spacing: { after: 60 },
      }))
    }
  }

  // Bottom row: skills + languages in two columns
  const skillsChildren: Paragraph[] = []
  const langsChildren: Paragraph[] = []

  if (data.skills.length) {
    skillsChildren.push(sectionLabelMinimal('Compétences', accentColor))
    skillsChildren.push(new Paragraph({
      children: data.skills.map((sk, i) => [
        new TextRun({ text: sk.name, size: 18, color: '374151' }),
        i < data.skills.length - 1 ? new TextRun({ text: '  ·  ', size: 18, color: '9CA3AF' }) : new TextRun(''),
      ]).flat(),
    }))
  }

  if (data.languages.length) {
    langsChildren.push(sectionLabelMinimal('Langues', accentColor))
    for (const l of data.languages) {
      langsChildren.push(new Paragraph({
        children: [
          new TextRun({ text: l.name, size: 18, bold: true }),
          new TextRun({ text: ` · ${l.level}`, size: 18, color: '6B7280' }),
        ],
        spacing: { after: 40 },
      }))
    }
  }

  if (skillsChildren.length || langsChildren.length) {
    sections.push(spacer(60))
    sections.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders: noBorders,
            margins: { top: 0, bottom: 0, left: 0, right: 200 },
            verticalAlign: VerticalAlign.TOP,
            children: skillsChildren.length ? skillsChildren : [new Paragraph({})],
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: noBorders,
            margins: { top: 0, bottom: 0, left: 200, right: 0 },
            verticalAlign: VerticalAlign.TOP,
            children: langsChildren.length ? langsChildren : [new Paragraph({})],
          }),
        ],
      })],
    }))
  }

  // Certifications
  if (data.certifications.length) {
    sections.push(spacer(80))
    sections.push(sectionLabelMinimal('Certifications', accentColor))
    for (const c of data.certifications) {
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: c.title, bold: true, size: 20 }),
          new TextRun({ text: ` · ${c.organization}${c.date ? ` (${c.date})` : ''}`, size: 18, color: '6B7280' }),
        ],
        spacing: { after: 40 },
      }))
    }
  }

  return sections
}

function sectionLabelMinimal(label: string, color: string) {
  return new Paragraph({
    children: [new TextRun({ text: label.toUpperCase(), bold: true, size: 16, color, allCaps: true })],
    spacing: { before: 140, after: 60 },
  })
}

// ─── Creative template ────────────────────────────────────────────────────────
// Colored sidebar on left, main content on right

function buildCreative(data: ResumeData, accentColor: string): (Paragraph | Table)[] {
  const p = data.personal
  const contactParts = [p.email, p.phone, p.city, p.linkedin].filter(Boolean)
  const initials = (p.name || 'N').charAt(0).toUpperCase()

  // ── Sidebar content ─────────────────────────────────────────────────────────
  const sidebarChildren: Paragraph[] = []

  // Avatar initial
  sidebarChildren.push(new Paragraph({
    children: [new TextRun({ text: initials, bold: true, size: 52, color: 'FFFFFF' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
  }))

  // Contact
  if (contactParts.length) {
    sidebarChildren.push(sectionHeaderSidebar('Contact'))
    for (const c of contactParts) {
      sidebarChildren.push(new Paragraph({
        children: [new TextRun({ text: c, size: 16, color: 'F3F4F6' })],
        spacing: { after: 40 },
      }))
    }
    sidebarChildren.push(spacer(60))
  }

  // Skills
  if (data.skills.length) {
    sidebarChildren.push(sectionHeaderSidebar('Compétences'))
    for (const sk of data.skills) {
      sidebarChildren.push(new Paragraph({
        children: [new TextRun({ text: sk.name, size: 18, color: 'FFFFFF' })],
      }))
      sidebarChildren.push(new Paragraph({
        children: [new TextRun({ text: skillWidth(sk.level), size: 14, color: 'FFFFFFB0' })],
        spacing: { after: 40 },
      }))
    }
    sidebarChildren.push(spacer(60))
  }

  // Languages
  if (data.languages.length) {
    sidebarChildren.push(sectionHeaderSidebar('Langues'))
    for (const l of data.languages) {
      sidebarChildren.push(new Paragraph({
        children: [
          new TextRun({ text: l.name, size: 18, color: 'FFFFFF' }),
          new TextRun({ text: ` · ${l.level}`, size: 16, color: 'D1D5DB' }),
        ],
        spacing: { after: 40 },
      }))
    }
  }

  // ── Main content ────────────────────────────────────────────────────────────
  const mainChildren: Paragraph[] = []

  mainChildren.push(new Paragraph({
    children: [new TextRun({ text: p.name || '', bold: true, size: 36, color: '1F2937' })],
    spacing: { after: 40 },
  }))
  if (p.title) {
    mainChildren.push(new Paragraph({
      children: [new TextRun({ text: p.title, bold: true, size: 22, color: accentColor })],
      spacing: { after: 120 },
    }))
  }

  if (data.summary) {
    mainChildren.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: 18, color: '4B5563' })],
      spacing: { after: 140 },
    }))
  }

  if (data.experiences.length) {
    mainChildren.push(sectionHeaderCreative('Expériences', accentColor))
    for (const e of data.experiences) {
      mainChildren.push(new Paragraph({
        children: [
          new TextRun({ text: e.position, bold: true, size: 20 }),
          new TextRun({ text: `   ${dateRange(e.startDate, e.current, e.endDate)}`, size: 16, color: '9CA3AF' }),
        ],
      }))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: e.company, size: 18, color: accentColor })],
        spacing: { before: 20, after: 20 },
      }))
      if (e.description) {
        for (const line of e.description.split('\n').filter(Boolean)) {
          mainChildren.push(new Paragraph({
            children: [new TextRun({ text: line, size: 18, color: '4B5563' })],
            bullet: { level: 0 },
          }))
        }
      }
      mainChildren.push(spacer(80))
    }
  }

  if (data.education.length) {
    mainChildren.push(sectionHeaderCreative('Formations', accentColor))
    for (const e of data.education) {
      mainChildren.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree, bold: true, size: 20 }),
          ...(e.year ? [new TextRun({ text: `   ${e.year}`, size: 16, color: '9CA3AF' })] : []),
        ],
      }))
      mainChildren.push(new Paragraph({
        children: [new TextRun({ text: `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`, size: 18, color: '6B7280' })],
        spacing: { after: 60 },
      }))
    }
  }

  if (data.certifications.length) {
    mainChildren.push(sectionHeaderCreative('Certifications', accentColor))
    for (const c of data.certifications) {
      mainChildren.push(new Paragraph({
        children: [
          new TextRun({ text: c.title, bold: true, size: 20 }),
          new TextRun({ text: ` · ${c.organization}${c.date ? ` (${c.date})` : ''}`, size: 18, color: '6B7280' }),
        ],
        spacing: { after: 60 },
      }))
    }
  }

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: 32, type: WidthType.PERCENTAGE },
          shading: { fill: accentColor, type: ShadingType.SOLID, color: accentColor },
          borders: noBorders,
          margins: { top: 300, bottom: 300, left: 200, right: 200 },
          verticalAlign: VerticalAlign.TOP,
          children: sidebarChildren,
        }),
        new TableCell({
          width: { size: 68, type: WidthType.PERCENTAGE },
          borders: noBorders,
          margins: { top: 300, bottom: 300, left: 280, right: 200 },
          verticalAlign: VerticalAlign.TOP,
          children: mainChildren,
        }),
      ],
    })],
  })]
}

function sectionHeaderSidebar(label: string) {
  return new Paragraph({
    children: [new TextRun({ text: label.toUpperCase(), bold: true, size: 16, color: 'FFFFFF', allCaps: true })],
    spacing: { before: 60, after: 60 },
  })
}

function sectionHeaderCreative(label: string, color: string) {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true, size: 20, color })],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
    spacing: { before: 100, after: 80 },
  })
}

// ─── Dark template ────────────────────────────────────────────────────────────
// Dark background, two columns, accent on section titles and last name

function buildDark(data: ResumeData, accentColor: string): { sections: (Paragraph | Table)[], dark: boolean } {
  const p = data.personal
  const BG = '0C0C0C'
  const nameParts = (p.name || '').trim().split(' ')
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''
  const lastName = nameParts[nameParts.length - 1] || p.name || ''

  const sections: (Paragraph | Table)[] = []

  // ── Header ──────────────────────────────────────────────────────────────────
  if (firstName) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: firstName.toUpperCase(), size: 32, color: 'FFFFFF' })],
      shading: { fill: BG, type: ShadingType.SOLID },
    }))
  }
  sections.push(new Paragraph({
    children: [new TextRun({ text: lastName.toUpperCase(), bold: true, size: 72, color: accentColor })],
    shading: { fill: BG, type: ShadingType.SOLID },
    spacing: { after: 40 },
  }))
  if (p.title) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: p.title.toUpperCase(), size: 20, color: 'AAAAAA' })],
      shading: { fill: BG, type: ShadingType.SOLID },
    }))
  }
  if (data.summary) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: 18, color: '727171' })],
      shading: { fill: BG, type: ShadingType.SOLID },
      spacing: { before: 80, after: 80 },
    }))
  }

  // ── Two columns ─────────────────────────────────────────────────────────────
  const leftChildren: Paragraph[] = []
  const rightChildren: Paragraph[] = []

  // Left: skills, education, certifications
  if (data.skills.length) {
    leftChildren.push(darkSectionTitle('Expertise', accentColor))
    for (const sk of data.skills) {
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: `• ${sk.name}`, size: 18, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
        spacing: { after: 30 },
      }))
    }
    leftChildren.push(spacer(80))
  }
  if (data.education.length) {
    leftChildren.push(darkSectionTitle('Formation', accentColor))
    for (const e of data.education) {
      if (e.year) leftChildren.push(new Paragraph({
        children: [new TextRun({ text: e.year, size: 16, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: e.degree, bold: true, size: 20, color: 'FFFFFF' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: `${e.institution}${e.mention ? ` · ${e.mention}` : ''}`, size: 16, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
        spacing: { after: 80 },
      }))
    }
  }
  if (data.certifications.length) {
    leftChildren.push(darkSectionTitle('Certifications', accentColor))
    for (const c of data.certifications) {
      if (c.date) leftChildren.push(new Paragraph({
        children: [new TextRun({ text: c.date, size: 16, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: c.title, bold: true, size: 20, color: 'FFFFFF' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: c.organization, size: 16, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
        spacing: { after: 80 },
      }))
    }
  }

  // Right: experiences, languages
  if (data.experiences.length) {
    rightChildren.push(darkSectionTitle('Expérience', accentColor))
    for (const e of data.experiences) {
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: dateRange(e.startDate, e.current, e.endDate), size: 16, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: e.company, bold: true, size: 20, color: 'FFFFFF' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: e.position, size: 18, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
      }))
      if (e.description) {
        rightChildren.push(new Paragraph({
          children: [new TextRun({ text: e.description, size: 16, color: '727171' })],
          shading: { fill: BG, type: ShadingType.SOLID },
          spacing: { after: 100 },
        }))
      } else {
        rightChildren.push(spacer(80))
      }
    }
  }
  if (data.languages.length) {
    rightChildren.push(darkSectionTitle('Langues', accentColor))
    for (const l of data.languages) {
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: `${l.name} · ${l.level}`, size: 18, color: '727171' })],
        shading: { fill: BG, type: ShadingType.SOLID },
        spacing: { after: 40 },
      }))
    }
  }

  if (leftChildren.length || rightChildren.length) {
    sections.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorders,
      rows: [new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: BG, type: ShadingType.SOLID },
            borders: noBorders,
            margins: { top: 100, bottom: 0, left: 0, right: 240 },
            verticalAlign: VerticalAlign.TOP,
            children: leftChildren.length ? leftChildren : [new Paragraph({ shading: { fill: BG, type: ShadingType.SOLID }, children: [] })],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: BG, type: ShadingType.SOLID },
            borders: noBorders,
            margins: { top: 100, bottom: 0, left: 240, right: 0 },
            verticalAlign: VerticalAlign.TOP,
            children: rightChildren.length ? rightChildren : [new Paragraph({ shading: { fill: BG, type: ShadingType.SOLID }, children: [] })],
          }),
        ],
      })],
    }))
  }

  // ── Contact footer ──────────────────────────────────────────────────────────
  sections.push(new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: '333333' } },
    shading: { fill: BG, type: ShadingType.SOLID },
    spacing: { before: 200, after: 80 },
    children: [],
  }))

  const contactItems = [p.email, p.phone, p.city, p.linkedin, p.github].filter(Boolean)
  if (contactItems.length) {
    sections.push(new Paragraph({
      children: [new TextRun({ text: contactItems.join('   ·   '), size: 18, color: '727171' })],
      shading: { fill: BG, type: ShadingType.SOLID },
      alignment: AlignmentType.CENTER,
    }))
  }

  return { sections, dark: true }
}

function darkSectionTitle(label: string, color: string) {
  return new Paragraph({
    children: [new TextRun({ text: label.toUpperCase(), bold: true, size: 20, color, allCaps: true })],
    shading: { fill: '0C0C0C', type: ShadingType.SOLID },
    spacing: { before: 140, after: 80 },
  })
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { data, primaryColor, template } = await req.json() as {
      data: ResumeData
      primaryColor?: string
      template?: TemplateType
    }
    const p = data.personal
    const accentColor = hex(primaryColor ?? '#7C3AED')

    let docSections: (Paragraph | Table)[]
    let isDark = false

    if (template === 'minimal') {
      docSections = buildMinimal(data, accentColor)
    } else if (template === 'creative') {
      docSections = buildCreative(data, accentColor)
    } else if (template === 'dark') {
      const result = buildDark(data, accentColor)
      docSections = result.sections
      isDark = result.dark
    } else {
      docSections = buildModern(data, accentColor)
    }

    const doc = new Document({
      ...(isDark ? { background: { color: '0C0C0C' } } : {}),
      sections: [{
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: docSections,
      }],
    })

    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="CV_${(p.name || 'CV').replace(/\s+/g, '_')}.docx"`,
      },
    })
  } catch (err) {
    console.error('[export-docx]', err)
    return NextResponse.json({ error: 'Erreur génération Word' }, { status: 500 })
  }
}
