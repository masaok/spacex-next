import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params;
  const size = parseInt(sizeParam);

  if (isNaN(size) || size <= 0 || size > 1024) {
    return new NextResponse('Invalid size', { status: 400 });
  }

  // Create a simple SVG icon with SpaceX theme
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#0b0f19"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
      <text x="${size/2}" y="${size/2 + 8}" text-anchor="middle" fill="#0b0f19" font-family="Arial, sans-serif" font-size="${size/8}" font-weight="bold">SpaceX</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}