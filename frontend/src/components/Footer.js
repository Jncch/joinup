export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ロゴ・説明 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-bold">JoinUp</span>
            </div>
            <p className="text-gray-400 mb-4">
              フリーランスとコミュニティをつなげる、新しいマッチングプラットフォーム
            </p>
          </div>

          {/* サービス */}
          <div>
            <h3 className="text-lg font-semibold mb-4">サービス</h3>
            <ul className="space-y-2">
              <li><a href="/matching" className="text-gray-400 hover:text-white">マッチング</a></li>
              <li><a href="/communities" className="text-gray-400 hover:text-white">コミュニティ一覧</a></li>
              <li><a href="/freelancers" className="text-gray-400 hover:text-white">フリーランサー一覧</a></li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h3 className="text-lg font-semibold mb-4">サポート</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">よくある質問</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">お問い合わせ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">利用規約</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-center text-gray-400">
            &copy; 2024 JoinUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}