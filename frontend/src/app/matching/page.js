'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, MapPin, Users, Star, Heart, MessageSquare, X } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function MatchingPage() {
  const [searchType, setSearchType] = useState('communities'); // 'communities' or 'freelancers'
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    experience: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchResults();
  }, [searchType]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let data;
      if (searchType === 'communities') {
        const response = await apiClient.searchCommunities({
          keyword: searchQuery,
          location: filters.location,
          community_type: filters.category
        });
        data = response.communities || [];
      } else {
        const response = await apiClient.getFreelancers();
        data = response.freelancers || [];
      }
      setResults(data);
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleMatch = async (targetId) => {
    try {
      // モック用の現在ユーザーID（実際の実装では認証から取得）
      const currentUserId = 1;
      
      const matchData = searchType === 'communities' 
        ? { freelancer_id: currentUserId, community_id: targetId }
        : { freelancer_id: targetId, community_id: currentUserId };

      await apiClient.createMatch({
        ...matchData,
        message: '興味があります。詳しくお話しできればと思います。'
      });
      
      alert('マッチングリクエストを送信しました！');
    } catch (error) {
      console.error('マッチングエラー:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">マッチング</h1>
        <p className="text-gray-600">あなたにぴったりなパートナーを見つけましょう</p>
      </div>

      {/* 検索タイプ切り替え */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setSearchType('communities')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === 'communities'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            コミュニティを探す
          </button>
          <button
            onClick={() => setSearchType('freelancers')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === 'freelancers'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            フリーランサーを探す
          </button>
        </div>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'communities'
                  ? 'コミュニティ名やキーワードで検索...'
                  : 'スキルや名前で検索...'
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            フィルター
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            検索
          </button>
        </form>

        {/* フィルターパネル */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">検索フィルター</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">すべて</option>
                  <option value="東京">東京</option>
                  <option value="大阪">大阪</option>
                  <option value="愛知">愛知</option>
                  <option value="福岡">福岡</option>
                  <option value="リモート">リモート</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {searchType === 'communities' ? 'カテゴリ' : 'スキル'}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">すべて</option>
                  {searchType === 'communities' ? (
                    <>
                      <option value="Tech">エンジニア・IT</option>
                      <option value="Design">デザイン</option>
                      <option value="Business">ビジネス</option>
                      <option value="Creative">クリエイティブ</option>
                    </>
                  ) : (
                    <>
                      <option value="React">React</option>
                      <option value="Python">Python</option>
                      <option value="Design">デザイン</option>
                      <option value="Marketing">マーケティング</option>
                    </>
                  )}
                </select>
              </div>
              {searchType === 'freelancers' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">経験年数</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">すべて</option>
                    <option value="1-2">1-2年</option>
                    <option value="3-5">3-5年</option>
                    <option value="5+">5年以上</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={fetchResults}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                フィルターを適用
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 検索結果 */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {searchType === 'communities' ? 'コミュニティ' : 'フリーランサー'}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({results.length}件)
            </span>
          </h2>
        </div>
      </div>

      {/* 結果一覧 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {/* ヘッダー */}
              <div className="flex items-center mb-4">
                <Image
                  src={item.avatar_url}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {searchType === 'communities' ? (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded text-xs mr-2">
                        {item.community_type}
                      </span>
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {item.experience_years}年経験 • {item.location}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.has(item.id)
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* コンテンツ */}
              <div className="mb-4">
                {searchType === 'communities' ? (
                  <>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.activity_description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {item.member_count}人
                      </div>
                      <span className="text-gray-500">
                        対象: {item.target_audience}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.skills?.slice(0, 3).map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {item.skills?.length > 3 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{item.skills.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{item.availability}</span>
                      <span className="font-medium text-primary-600">
                        ¥{item.hourly_rate?.toLocaleString()}/時
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* アクション */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleMatch(item.id)}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">
                    {searchType === 'communities' ? '参加申請' : 'オファー'}
                  </span>
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-600">詳細</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 結果が空の場合 */}
      {!loading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            検索結果が見つかりませんでした
          </h3>
          <p className="text-gray-500 mb-4">
            検索条件を変更して再度お試しください
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({ location: '', category: '', experience: '' });
              fetchResults();
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            すべての結果を表示
          </button>
        </div>
      )}
    </div>
  );
}