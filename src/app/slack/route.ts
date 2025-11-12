// app/slack/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ensure Node runtime (not edge)

export async function GET() {
  const url = process.env.SLACK_LINK;
  if (!url) return new NextResponse('Slack URL not configured', { status: 500 });
  return NextResponse.redirect(url);
}
