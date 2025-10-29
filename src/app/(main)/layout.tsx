import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ConfettiCanvas } from '@/components/shared/confetti-provider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ConfettiCanvas />
    </div>
  );
}
