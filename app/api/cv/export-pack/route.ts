import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { pdf } from '@react-pdf/renderer'
import JSZip from 'jszip'
import { ResumeData } from '@/types/resume'
import { ModernPDF, MinimalPDF, CreativePDF, DarkPDF, ClassicPDF, Model25PDF } from '../pdf-templates'

const PACK_VARIANTS = [
  { template: 'modern',   color: '#7c3aed', label: 'Moderne_Violet',   photoSize: 100, positionX: 40, containerSize: 180 },
  { template: 'modern',   color: '#2563eb', label: 'Moderne_Bleu',     photoSize: 100, positionX: 40, containerSize: 180 },
  { template: 'minimal',  color: '#059669', label: 'Minimaliste_Vert', photoSize: 100, positionX: 60, containerSize: 180 },
  { template: 'creative', color: '#ea580c', label: 'Creatif_Orange',   photoSize: 100, positionX: 60, containerSize: 160 },
  { template: 'dark',     color: '#ff7613', label: 'Dark_Orange',      photoSize: 100, positionX: 30, containerSize: 100 },
] as const

function slugify(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function generateOnePDF(data: ResumeData, template: string, color: string, photoSize: number, positionX: number, containerSize: number): Promise<any> {
  let element: React.ReactElement
  if (template === 'minimal') {
    element = React.createElement(MinimalPDF, { data, color, photoSize, positionX, containerSize })
  } else if (template === 'creative') {
    element = React.createElement(CreativePDF, { data, color, photoSize, positionX, containerSize })
  } else if (template === 'dark') {
    element = React.createElement(DarkPDF, { data, color, photoSize, positionX, containerSize })
  } else if (template === 'classic') {
    element = React.createElement(ClassicPDF, { data, color, photoSize, positionX, containerSize })
  } else if (template === 'model-25') {
    element = React.createElement(Model25PDF, { data, color, photoSize, positionX, containerSize })
  } else {
    element = React.createElement(ModernPDF, { data, color, photoSize, positionX, containerSize })
  }
  return pdf(element).toBuffer()
}

export async function POST(req: NextRequest) {
  try {
    const { data } = await req.json() as {
      data: ResumeData
    }

    if (!data?.personal?.name || !data?.personal?.email) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
    }

    const nameSlug = data.personal.name ? slugify(data.personal.name) : 'CV'
    const date = new Date().toISOString().slice(0, 10)

    // Générer les 5 PDFs en parallèle (configs fixes par template)
    const buffers = await Promise.all(
      PACK_VARIANTS.map(v => generateOnePDF(data, v.template, v.color, v.photoSize, v.positionX, v.containerSize))
    )

    // Zipper
    const zip = new JSZip()
    buffers.forEach((buf, i) => {
      zip.file(`CV_${nameSlug}_${PACK_VARIANTS[i].label}_${date}.pdf`, buf)
    })

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="Pack_CV_${nameSlug}_${date}.zip"`,
      },
    })
  } catch (err) {
    console.error('[export-pack]', err)
    return NextResponse.json({ error: 'Erreur génération du pack' }, { status: 500 })
  }
}
