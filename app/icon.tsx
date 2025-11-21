import { ImageResponse } from 'next/og'

// Usamos el runtime por defecto para asegurar compatibilidad con generateImageMetadata
// export const runtime = 'edge'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 32, height: 32 },
      id: '32',
    },
    {
      contentType: 'image/png',
      size: { width: 192, height: 192 },
      id: '192',
    },
    {
      contentType: 'image/png',
      size: { width: 512, height: 512 },
      id: '512',
    },
  ]
}

export default function Icon({ id }: { id: string }) {
  const size = parseInt(id, 10)

  // Logo SVG incrustado directamente
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="512" height="512" rx="128" fill="#221B69"/>
          <path d="M256 128L366.851 320H145.149L256 128Z" fill="white"/>
          <path d="M320 256L430.851 448H209.149L320 256Z" fill="#4F46E5"/>
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  )
}