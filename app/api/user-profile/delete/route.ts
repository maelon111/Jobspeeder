import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { google } from 'googleapis'

const SHEET_ID = '1_-3ex3Dh1wSLHrXFos1pUbqrnv1gsIPehJ3WTfZwul4'
const SHEET_NAME = 'USER_PROFILES'

function parseGviz(text: string) {
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/)
  if (!match) return null
  return JSON.parse(match[1])
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { profil_id } = await request.json()
  if (!profil_id) return NextResponse.json({ error: 'Missing profil_id' }, { status: 400 })

  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyJson) return NextResponse.json({ error: 'Google credentials not configured' }, { status: 500 })

  let credentials: { client_email: string; private_key: string }
  try {
    credentials = JSON.parse(keyJson)
  } catch {
    return NextResponse.json({ error: 'Invalid Google credentials' }, { status: 500 })
  }

  // Find the row number via GViz (column A = profil_id, B = user_id)
  const userId = user.id.replace(/'/g, "\\'")
  const safeProfilId = String(profil_id).replace(/'/g, "\\'")
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&tq=${encodeURIComponent(`select A where A = '${safeProfilId}' and B = '${userId}'`)}`

  const gvizRes = await fetch(gvizUrl)
  const gvizText = await gvizRes.text()
  const gvizJson = parseGviz(gvizText)
  const rows = gvizJson?.table?.rows || []

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Use Sheets API to find the exact row index
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  // Get all profil_ids from column A to find the row index
  const readRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:A`,
  })

  const colA = readRes.data.values || []
  const rowIndex = colA.findIndex((row) => row[0] === String(profil_id))

  if (rowIndex === -1) {
    return NextResponse.json({ error: 'Row not found in sheet' }, { status: 404 })
  }

  // Get sheet gid
  const metaRes = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID })
  const sheet = metaRes.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME
  )
  const sheetId = sheet?.properties?.sheetId

  if (sheetId === undefined) {
    return NextResponse.json({ error: 'Sheet not found' }, { status: 404 })
  }

  // Delete the row (rowIndex is 0-based)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  })

  return NextResponse.json({ success: true })
}
