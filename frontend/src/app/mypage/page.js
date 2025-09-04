'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, Settings, Bell, MessageSquare, Heart, 
  TrendingUp, Calendar, Star, Edit, Plus, 
  Eye, ArrowRight, CheckCircle, Clock, X 
} from 'lucide-react';
import { apiClient } from '../../lib/api';

export default function MyPage() {
  // モック用の現在ユーザーID（実際は認証から取得）
  const currentUserId = 1;
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [profileRes, matchesRes] = await Promise.all([
        apiClient.getUserProfile(currentUserId),
        apiClient.getMatches(currentUserId)
      ]);
      
      setProfile(profileRes);
      setMatches(matchesRes.matches || []);
      
      // モック用のお気に入りと通知データ
      setFavorites([
        {
          id: 3,
          name: "Tech勉強会",
          avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
          type: "community",
          added_at: "2024-01-20"
        },
        {
          id: 4,
          name: "デザイン交流会", 
          avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=DC",
          type: "community",
          added_at: "2024-01-18"
        }
      ]);
      
      setNotifications([
        {
          id: 1,
          type: "match",
          title: "新しいマッチング申請",
          message: "Tech勉強会からマッチング申請が届きました",
          created_at: "2024-01-22T10:00:00Z",
          read: false
        },
        {
          id: 2,
          type: "message",
          title: "新しいメッセージ",
          message: "デザイン交流会からメッセージが届きました",
          created_at: "2024-01-21T15:30:00Z",
          read: true
        }
      ]);
      
    } catch (error) {
      console.error('ユーザーデータ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const removeFromFavorites = (itemId) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">プロフィールが見つかりません</h2>
          <p className="text-gray-600 mb-4">まずはプロフィールを作成してください。</p>
          <Link href="/register" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            プロフィール作成
          </Link>
        </div>
      </div>
    );
  }

  const isFreelancer = profile.user_type === 'freelancer';
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">マイページ</h1>
          <p className="text-gray-600">ダッシュボードでアクティビティを確認しましょう</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link href="/profile" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Edit className="w-4 h-4 mr-2" />
            プロフィール編集
          </Link>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            設定
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'ダッシュボード', icon: TrendingUp },
            { id: 'matches', label: 'マッチング', icon: MessageSquare },
            { id: 'favorites', label: 'お気に入り', icon: Heart },
            { id: 'notifications', label: '通知', icon: Bell, badge: unreadNotifications }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ダッシュボードタブ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">マッチング数</p>
                  <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">お気に入り</p>
                  <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">プロフィール閲覧</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">平均評価</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
              </div>
            </div>
          </div>

          {/* 最近のアクティビティ */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">最近のアクティビティ</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {matches.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Image
                        src={isFreelancer ? match.community.avatar_url : match.freelancer.avatar_url}
                        alt={isFreelancer ? match.community.name : match.freelancer.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {isFreelancer ? match.community.name : match.freelancer.name}とマッチング
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(match.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'completed' ? 'bg-green-100 text-green-700' :
                      match.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                      match.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {match.status === 'completed' ? '完了' :
                       match.status === 'accepted' ? '承認済み' :
                       match.status === 'rejected' ? '却下' : '保留中'}
                    </span>
                  </div>
                ))}
                
                {matches.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">まだマッチングがありません</p>
                    <Link href="/matching" className="text-primary-600 hover:text-primary-700 font-medium">
                      マッチングを始める
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* マッチングタブ */}
      {activeTab === 'matches' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">マッチング履歴</h3>
              <Link href="/matching" className="text-primary-600 hover:text-primary-700 font-medium">
                新しいマッチングを探す
              </Link>
            </div>
          </div>
          <div className="p-6">
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={isFreelancer ? match.community.avatar_url : match.freelancer.avatar_url}
                          alt={isFreelancer ? match.community.name : match.freelancer.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="ml-4">
                          <h4 className="font-medium text-gray-900">
                            {isFreelancer ? match.community.name : match.freelancer.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(match.created_at).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          match.status === 'completed' ? 'bg-green-100 text-green-700' :
                          match.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          match.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {match.status === 'completed' ? '完了' :
                           match.status === 'accepted' ? '承認済み' :
                           match.status === 'rejected' ? '却下' : '保留中'}
                        </span>
                        <button className="text-primary-600 hover:text-primary-700">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {match.message && (
                      <p className="mt-3 text-gray-600 text-sm">{match.message}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">マッチングがありません</h4>
                <p className="text-gray-500 mb-4">新しいつながりを見つけてみましょう</p>
                <Link href="/matching" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                  マッチングを始める
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* お気に入りタブ */}
      {activeTab === 'favorites' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">お気に入り</h3>
          </div>
          <div className="p-6">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Image
                          src={item.avatar_url}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.type}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromFavorites(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        追加日: {new Date(item.added_at).toLocaleDateString('ja-JP')}
                      </span>
                      <Link 
                        href={`/${item.type}s/${item.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">お気に入りがありません</h4>
                <p className="text-gray-500 mb-4">気になるコミュニティやフリーランサーをお気に入りに追加しましょう</p>
                <Link href="/matching" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
                  探してみる
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 通知タブ */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">通知</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                すべて既読にする
              </button>
            </div>
          </div>
          <div className="p-6">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'match' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {notification.type === 'match' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">通知がありません</h4>
                <p className="text-gray-500">新しい通知が届くとここに表示されます</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}