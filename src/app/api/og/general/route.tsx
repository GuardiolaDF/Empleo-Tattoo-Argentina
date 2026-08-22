import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const bodoniRegular = fetch(
  new URL('https://github.com/googlefonts/PlayfairDisplay/raw/main/fonts/ttf/PlayfairDisplay-Regular.ttf')
).then((res) => res.arrayBuffer());

const interRegular = fetch(
  new URL('https://github.com/rsms/inter/releases/download/v3.19/Inter-Regular.ttf')
).then((res) => res.arrayBuffer());

export async function GET(req: NextRequest) {
  try {
    const bodoniRegularData = await bodoniRegular;
    const interRegularData = await interRegular;

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
        fonts: [
          {
            name: 'Bodoni',
            data: bodoniRegularData,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: interRegularData,
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
