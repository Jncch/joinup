import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'JoinUp - フリーランスとコミュニティのマッチングプラットフォーム',
  description: 'フリーランスと魅力的なコミュニティをつなげる、新しいマッチングサービス',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}