import { Footer } from "@/components/main/footer";
import { Header } from "@/components/main/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 antialiased overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
