import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'C-H Automobile & Exclusive Cars';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%)',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            C-H Automobile
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              opacity: 0.9,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
            }}
          >
            & Exclusive Cars
          </div>
          <div
            style={{
              width: 80,
              height: 3,
              background: '#F59E0B',
              borderRadius: 2,
              marginTop: 8,
              marginBottom: 8,
            }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              opacity: 0.8,
              textAlign: 'center',
              maxWidth: 600,
            }}
          >
            Premium-Fahrzeughändler in Friedberg
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
