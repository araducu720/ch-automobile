'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#0a0a0a', color: '#fafafa' }}>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#c0272d', margin: 0 }}>500</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1rem' }}>
            Ein Fehler ist aufgetreten / An error occurred
          </h2>
          <p style={{ marginTop: '0.5rem', maxWidth: '28rem', color: '#a1a1aa' }}>
            Wir entschuldigen uns für die Unannehmlichkeiten. Bitte versuchen Sie es erneut.
          </p>
          <p style={{ marginTop: '0.25rem', maxWidth: '28rem', color: '#71717a', fontSize: '0.875rem' }}>
            We apologize for the inconvenience. Please try again.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#c0272d',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Erneut versuchen / Retry
            </button>
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#fafafa',
                border: '1px solid #3f3f46',
                borderRadius: '0.5rem',
                fontWeight: 500,
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Startseite / Home
            </a>
          </div>
          {error.digest && (
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#71717a' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
