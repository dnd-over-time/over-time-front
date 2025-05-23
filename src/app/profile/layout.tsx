export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='h-screen bg-[#F7F4F2] p-4'>{children}</div>;
}
