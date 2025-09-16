// app/layout.js
export const metadata = {
  title: "Bot con IA",
  description: "Next.js + Vercel (paso base)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
