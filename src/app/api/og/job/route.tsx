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

function formatLocation(rawLocation: string): string {
  const parts = rawLocation.split(',').map(p => p.trim().toUpperCase());
  let province = '';
  let city = '';

  if (parts.length >= 3) {
    province = parts[parts.length - 1];
    city = parts[parts.length - 2];
  } else if (parts.length === 2) {
    province = parts[1];
    city = parts[0];
  } else {
    return rawLocation;
  }

  if (province.includes('CABA') || province.includes('CIUDAD AUTÓNOMA')) {
    return city;
  }

  if (province.includes('BUENOS AIRES') || province === 'GBA' || province.includes('GRAN BUENOS AIRES')) {
    return city;
  }

  const provinceMap: Record<string, string> = {
    'SANTA FE': 'SF', 'CÓRDOBA': 'CBA', 'CORDOBA': 'CBA', 'MENDOZA': 'MDZ',
    'TUCUMÁN': 'TUC', 'TUCUMAN': 'TUC', 'SALTA': 'SLA', 'JUJUY': 'JUJ',
    'SANTIAGO DEL ESTERO': 'SDE', 'CHACO': 'CHA', 'CORRIENTES': 'COR',
    'MISIONES': 'MIS', 'ENTRE RÍOS': 'ER', 'ENTRE RIOS': 'ER', 'LA RIOJA': 'LR',
    'CATAMARCA': 'CAT', 'SAN JUAN': 'SJ', 'SAN LUIS': 'SL', 'LA PAMPA': 'LP',
    'NEUQUÉN': 'NQN', 'NEUQUEN': 'NQN', 'RÍO NEGRO': 'RN', 'RIO NEGRO': 'RN',
    'CHUBUT': 'CHU', 'SANTA CRUZ': 'SCZ', 'TIERRA DEL FUEGO': 'TDF'
  };

  const init = provinceMap[province] || province.split(' ').map(w => w[0]).join('');
  return `${city}, ${init}`;
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
    const rawLocation = searchParams.get('location') || 'UBICACIÓN';
    const style = searchParams.get('style') || '';
    
    const formattedLocation = formatLocation(rawLocation);
    const isRental = style.toLowerCase().includes('alquiler');
    const action = isRental ? 'alquila' : 'busca';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#c4c4c4',
            padding: '60px 80px',
            position: 'relative',
          }}
        >
          {/* Dato 1: Studio */}
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 100,
              fontWeight: 800,
              color: 'black',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {studio}
          </div>

          {/* Dato 2: Action */}
          <div
            style={{
              fontFamily: '"Bodoni"',
              fontSize: 48,
              color: 'black',
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            {action}
          </div>

          {/* Dato 3: Role */}
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 100,
              fontWeight: 800,
              color: 'black',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {role}
          </div>

          {/* Dato 4: en */}
          <div
            style={{
              fontFamily: '"Bodoni"',
              fontSize: 48,
              color: 'black',
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            en
          </div>

          {/* Dato 5: Location */}
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 100,
              fontWeight: 800,
              color: 'black',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {formattedLocation}
          </div>

          {/* Branding Logo & Line (Bottom) */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: 80,
              right: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                height: '4px',
                backgroundColor: 'black',
                flexGrow: 1,
                marginRight: '32px',
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
                  fontSize: 56,
                  color: 'black',
                  marginRight: '8px',
                  letterSpacing: '-0.02em',
                }}
              >
                ETA
              </span>
              <span
                style={{
                  fontFamily: '"Bodoni"',
                  fontSize: 56,
                  color: 'black',
                }}
              >
                Web
              </span>
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
