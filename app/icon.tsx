import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default async function Icon() {
  // Fetch the SVG logo from the public directory
  const logoSvg = await fetch(new URL('/logo.svg', 'http://localhost:3000')).then(
    (res) => res.text()
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        //   backgroundColor: '#221b69',
        }}
      >
        <img 
          src={`data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`}
          width="64"
          height="64"
          alt="Logo"
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
