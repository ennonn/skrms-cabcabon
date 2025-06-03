import { Head } from '@inertiajs/react';

interface RootLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function RootLayout({ children, title = 'Herd' }: RootLayoutProps) {
  return (
    <>
      <Head title={title} />
      <main>{children}</main>
    </>
  );
} 