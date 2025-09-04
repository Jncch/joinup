import Link from 'next/link';
import { User, Search, MessageSquare, Settings, Users, Briefcase } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JoinUp</span>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/matching" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
              <Search className="w-4 h-4" />
              <span>マッチング</span>
            </Link>
            <Link href="/freelancers/1" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>フリーランサー</span>
            </Link>
            <Link href="/communities/3" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>コミュニティ</span>
            </Link>
            <Link href="/mypage" className="text-gray-600 hover:text-primary-600 flex items-center space-x-1">
              <Settings className="w-4 h-4" />
              <span>マイページ</span>
            </Link>
          </nav>

          {/* ユーザーメニュー */}
          <div className="flex items-center space-x-4">
            <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              新規登録
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-primary-600">
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}