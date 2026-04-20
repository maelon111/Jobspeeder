import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { ResumeData, TemplateType } from '@/types/resume'
import { ModernPDF, MinimalPDF, DarkPDF, ClassicPDF, CreativePDF, Model25PDF } from '../pdf-templates'

function buildFilename(data: ResumeData): string {
  const slugify = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
  const date = new Date().toISOString().slice(0, 10)
  const parts = [
    'CV',
    data.personal.name && slugify(data.personal.name),
    data.personal.title && slugify(data.personal.title),
    date,
  ].filter(Boolean)
  return `${parts.join('_')}.pdf`
}

export async function POST(req: NextRequest) {
  try {
    const { data, template, primaryColor, photoSize, photoPositionX, photoContainerSize } = await req.json() as {
      data: ResumeData
      template: TemplateType
      primaryColor: string
      photoSize?: number
      photoPositionX?: number
      photoContainerSize?: number
    }

    if (!data?.personal?.name || !data?.personal?.email) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
    }

    const color = primaryColor || '#7c3aed'
    const pSize = photoSize ?? 100
    const pX = photoPositionX ?? 50
    const cSize = photoContainerSize ?? 100

    let element: React.ReactElement
    if (template === 'minimal') {
      element = React.createElement(MinimalPDF, { data, color, photoSize: pSize, positionX: pX, containerSize: cSize })
    } else if (template === 'dark') {
      element = React.createElement(DarkPDF, { data, color, photoSize: pSize, positionX: pX, containerSize: cSize })
    } else if (template === 'classic') {
      element = React.createElement(ClassicPDF, { data, color, photoSize: pSize, positionX: pX, containerSize: cSize })
    } else if (template === 'creative') {
      element = React.createElement(CreativePDF, { data, color, photoSize: pSize, positionX: pX, containerSize: cSize })
    } else if (template === 'model-25') {
      element = React.createElement(Model25PDF, { data, color, photoSize: pSize, positionX: pX, containerSize: cSize })
    } else {
      element = React.createElement(ModernPDF, { data, color, photoSize: pSize, positionX: pX, containerSize: cSize })
    }

    const buffer = await pdf(element).toBuffer()

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${buildFilename(data)}"`,
      },
    })
  } catch (err) {
    console.error('[export-pdf]', err)
    return NextResponse.json({ error: 'Erreur génération PDF' }, { status: 500 })
  }
}
