import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

let interBoldData: ArrayBuffer | null = null;
let bodoniItalicData: ArrayBuffer | null = null;

async function fetchFont(fontFamily: string, weight: number, style: string = 'normal'): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@${style === 'italic' ? '1' : '0'},${weight}`;
  const css = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  }).then((res) => res.text());

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype|woff)'\)/);
  if (!resource) throw new Error('Failed to download font');
  return fetch(resource[1]).then((res) => res.arrayBuffer());
}

export async function GET(req: NextRequest) {
  try {
    if (!interBoldData) {
      interBoldData = await fetchFont('Inter', 800);
    }

    if (!bodoniItalicData) {
      bodoniItalicData = await fetchFont('Playfair Display', 400, 'italic');
    }

    const { searchParams } = new URL(req.url);
    const studio = searchParams.get('studio')?.toUpperCase() || 'ESTUDIO';
    const role = searchParams.get('role')?.toUpperCase() || 'PUESTO';
    const location = searchParams.get('location')?.toUpperCase() || 'UBICACIÓN';
    const style = searchParams.get('style') || '';
    
    // Determine action based on style
    const isRental = style.toLowerCase().includes('alquiler');
    const action = isRental ? 'alquila' : 'busca';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#e5e7eb', // Light gray background
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Safe Area 630x630 (WhatsApp 1:1) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '630px',
              height: '630px',
              justifyContent: 'center',
              position: 'relative',
              padding: '40px 0',
            }}
          >
            {/* Dato 1: Studio */}
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: 64,
                fontWeight: 800,
                color: 'black',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: 10,
              }}
            >
              {studio}
            </div>

            {/* Dato 2: Action */}
            <div
              style={{
                fontFamily: '"Bodoni"',
                fontSize: 56,
                color: 'black',
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              {action}
            </div>

            {/* Dato 3: Role */}
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: 96,
                fontWeight: 800,
                color: 'black',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: 10,
              }}
            >
              {role}
            </div>

            {/* Dato 4: en */}
            <div
              style={{
                fontFamily: '"Bodoni"',
                fontSize: 56,
                color: 'black',
                lineHeight: 1,
                marginBottom: 20,
              }}
            >
              en
            </div>

            {/* Dato 5: Location */}
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: 80,
                fontWeight: 800,
                color: 'black',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              {location}
            </div>

            {/* Branding Logo (Bottom Right within Safe Area) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '300px',
                  height: '2px',
                  backgroundColor: 'black',
                  marginRight: '16px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Inter"',
                    fontWeight: 800,
                    fontSize: 32,
                    color: 'black',
                    marginRight: '6px',
                  }}
                >
                  ETA
                </span>
                <span
                  style={{
                    fontFamily: '"Bodoni"',
                    fontSize: 32,
                    color: 'black',
                  }}
                >
                  Web
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interBoldData as ArrayBuffer,
            style: 'normal',
            weight: 800,
          },
          {
            name: 'Bodoni',
            data: bodoniItalicData as ArrayBuffer,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
