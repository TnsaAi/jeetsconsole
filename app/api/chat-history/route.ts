import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const HISTORY_FILE = path.join(process.cwd(), 'chat_history.json')

export async function GET() {
  try {
    await fs.access(HISTORY_FILE)
    const data = await fs.readFile(HISTORY_FILE, 'utf-8')
    const history = JSON.parse(data)
    return NextResponse.json(history)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return an empty array
      return NextResponse.json([])
    }
    console.error('Error reading chat history:', error)
    return NextResponse.json({ error: 'Failed to read chat history' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const history = await req.json()
    if (!Array.isArray(history)) {
      throw new Error('Invalid history format')
    }
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving chat history:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save chat history' }, { status: 500 })
  }
}

