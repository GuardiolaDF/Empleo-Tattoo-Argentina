import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

let bodoniRegularData: ArrayBuffer | null = null;
let interRegularData: ArrayBuffer | null = null;

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
    if (!bodoniRegularData) {
      bodoniRegularData = await fetchFont('Playfair Display', 400);
    }

    if (!interRegularData) {
      interRegularData = await fetchFont('Inter', 400);
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#e5e7eb', // Light gray background
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: '"Bodoni"',
                fontSize: 120,
                color: 'black',
                lineHeight: 0.9,
                marginBottom: 10,
              }}
            >
              EMPLEO
            </div>
            <div
              style={{
                fontFamily: '"Bodoni"',
                fontSize: 120,
                color: 'black',
                lineHeight: 0.9,
                marginBottom: 10,
              }}
            >
              TATTOO
            </div>
            <div
              style={{
                fontFamily: '"Bodoni"',
                fontSize: 120,
                color: 'black',
                lineHeight: 0.9,
                marginBottom: 40,
              }}
            >
              ARGENTINA
            </div>

            <div
              style={{
                width: '100%',
                height: '3px',
                backgroundColor: 'black',
                marginBottom: 20,
              }}
            />

            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: 40,
                color: 'black',
                letterSpacing: '-0.02em',
              }}
            >
              Conectando artistas con los mejores estudios del país
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        fonts: [
          {
            name: 'Bodoni',
            data: bodoniRegularData as ArrayBuffer,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: interRegularData as ArrayBuffer,
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
