'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Users, Star, ExternalLink, MessageSquare, Heart, 
  Calendar, Clock, Award, TrendingUp, ArrowLeft, Share,
  CheckCircle, UserPlus, Globe, Target
} from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id;
  
  const [community, setCommunity] = useState(null);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCommunityData();
  }, [communityId]);

  const fetchCommunityData = async () => {
    try {
      // 実際のデータを取得（コミュニティ一覧から該当IDを探す）
      const response = await apiClient.getCommunities();
      const communityData = response.communities.find(c => c.id === parseInt(communityId));
      
      if (communityData) {
        setCommunity(communityData);
        
        // モック用のイベントデータ
        setEvents([
          {
            id: 1,
            title: "React最新機能解説ワークショップ",
            description: "React 18の新機能について詳しく学ぶハンズオンワークショップです。Server Componentsやconcurrent featuresについて実践的に学習します。",
            date: "2024-02-10",
            time: "14:00-17:00",
            location: "東京・渋谷",
            attendees: 25,
            max_attendees: 30,
            status: "upcoming",
            type: "workshop"
          },
          {
            id: 2,
            title: "フロントエンド開発LT大会",
            description: "メンバーによるライトニングトーク大会。新しい技術やツール、開発体験などを5分で発表します。",
            date: "2024-02-03",
            time: "19:00-21:00", 
            location: "オンライン",
            attendees: 45,
            max_attendees: 50,
            status: "completed",
            type: "event"
          },
          {
            id: 3,
            title: "Next.js + TypeScript実践講座",
            description: "Next.js 14とTypeScriptを使った実践的なWebアプリケーション開発。認証機能やAPIの実装まで網羅します。",
            date: "2024-01-27",
            time: "13:00-18:00",
            location: "東京・渋谷",
            attendees: 20,
            max_attendees: 25,
            status: "completed",
            type: "workshop"
          }
        ]);

        // モック用のメンバーデータ
        setMembers([
          {
            id: 1,
            name: "田中太郎",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka",
            role: "エンジニア",
            skills: ["React", "Node.js"],
            joined_at: "2023-08-15",
            contribution_level: "active"
          },
          {
            id: 2,
            name: "佐藤花子",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sato",
            role: "デザイナー",
            skills: ["UI/UX", "Figma"],
            joined_at: "2023-09-20",
            contribution_level: "regular"
          },
          {
            id: 4,
            name: "山田次郎",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=yamada",
            role: "学生",
            skills: ["JavaScript", "Python"],
            joined_at: "2023-10-05",
            contribution_level: "beginner"
          },
          {
            id: 5,
            name: "鈴木美咲",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki",
            role: "フロントエンドエンジニア",
            skills: ["Vue.js", "TypeScript"],
            joined_at: "2023-07-10",
            contribution_level: "active"
          }
        ]);

        // モック用のレビューデータ
        setReviews([
          {
            id: 1,
            reviewer: {
              name: "田中太郎",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka",
              role: "フリーランサー"
            },
            rating: 5,
            comment: "とても活発で学びの多いコミュニティです。技術レベルが高く、初心者にも優しい環境で、毎回参加するのが楽しみです。運営の方々のサポートも手厚く、安心して参加できます。",
            event: "React基礎ワークショップ",
            created_at: "2024-01-20",
            helpful_count: 8
          },
          {
            id: 2,
            reviewer: {
              name: "佐藤花子",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sato",
              role: "フリーランサー"
            },
            rating: 4,
            comment: "技術的な内容が充実していて、実践的なスキルを身につけることができました。参加者同士の交流も活発で、新しいつながりができました。",
            event: "JavaScript応用講座",
            created_at: "2024-01-15",
            helpful_count: 5
          },
          {
            id: 3,
            reviewer: {
              name: "高橋明",
              avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=takahashi",
              role: "エンジニア"
            },
            rating: 5,
            comment: "コミュニティの雰囲気が素晴らしく、質問しやすい環境が整っています。講師の方々の説明も分かりやすく、技術レベルに関係なく楽しめます。",
            event: "フロントエンド勉強会",
            created_at: "2024-01-10",
            helpful_count: 12
          }
        ]);
      }
    } catch (error) {
      console.error('コミュニティデータ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    try {
      // モック用の現在ユーザーID（フリーランサーとして）
      const currentUserId = 1;
      
      await apiClient.createMatch({
        freelancer_id: currentUserId,
        community_id: parseInt(communityId),
        message: `${community.name}に参加希望です。技術的な貢献ができるよう頑張りたいと思います。`
      });
      
      alert('参加申請を送信しました！');
    } catch (error) {
      console.error('参加申請エラー:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="ml-6 flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">コミュニティが見つかりません</h2>
          <p className="text-gray-600 mb-4">指定されたコミュニティは存在しないか、削除された可能性があります。</p>
          <Link href="/matching" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            コミュニティ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const activeMembers = members.filter(member => member.contribution_level === 'active');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ナビゲーション */}
      <div className="flex items-center mb-6">
        <Link href="/matching" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          コミュニティ一覧に戻る
        </Link>
      </div>

      {/* コミュニティヘッダー */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src={community.avatar_url}
                alt={community.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{community.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {community.community_type}
                  </span>
                  <MapPin className="w-4 h-4 mr-1" />
                  {community.location}
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500 ml-1">({reviews.length}件の評価)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={toggleFavorite}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'お気に入り済み' : 'お気に入り'}
              </button>
              
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4 mr-2" />
                シェア
              </button>
              
              <button 
                onClick={handleJoinRequest}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                参加申請
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">メンバー数</div>
                <div className="text-sm text-gray-600">{community.member_count}人</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">開催頻度</div>
                <div className="text-sm text-gray-600">月2-3回</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Target className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">対象者</div>
                <div className="text-sm text-gray-600">{community.target_audience}</div>
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{community.activity_description}</p>
          </div>

          {/* 外部リンク */}
          <div className="flex gap-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Globe className="w-4 h-4 mr-1" />
              ウェブサイト
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Slack
            </a>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', label: '概要', icon: TrendingUp },
              { id: 'events', label: 'イベント', icon: Calendar },
              { id: 'members', label: 'メンバー', icon: Users },
              { id: 'reviews', label: 'レビュー', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* 概要タブ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">コミュニティについて</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">活動内容</h4>
                    <p className="text-gray-600">
                      最新のフロントエンド技術に関する勉強会、ハンズオンワークショップ、LT大会などを定期的に開催しています。実践的なスキル向上を重視した内容です。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">コミュニティの特徴</h4>
                    <p className="text-gray-600">
                      初心者から上級者まで幅広く参加できる環境を提供しています。技術的な質問や相談がしやすく、メンバー同士のサポートが活発です。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">参加メリット</h4>
                    <p className="text-gray-600">
                      最新技術のキャッチアップ、実践的なスキル習得、同じ志を持つ仲間との出会い、キャリア相談やネットワーキングの機会を得られます。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">参加方法</h4>
                    <p className="text-gray-600">
                      オンライン・オフライン両方で開催。事前申込制で、参加費は基本無料（一部ワークショップで材料費実費）です。
                    </p>
                  </div>
                </div>
              </div>

              {/* 統計情報 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">統計情報</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{community.member_count}</div>
                    <div className="text-sm text-gray-600">総メンバー数</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{events.length}</div>
                    <div className="text-sm text-gray-600">開催イベント数</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{activeMembers.length}</div>
                    <div className="text-sm text-gray-600">アクティブメンバー</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">{averageRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">平均評価</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* イベントタブ */}
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">イベント</h3>
                <span className="text-sm text-gray-500">
                  開催予定: {upcomingEvents.length}件
                </span>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-gray-900 mr-3">{event.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                            event.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {event.status === 'upcoming' ? '開催予定' :
                             event.status === 'completed' ? '開催済み' : '開催中'}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            event.type === 'workshop' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {event.type === 'workshop' ? 'ワークショップ' : 'イベント'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString('ja-JP')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.attendees}/{event.max_attendees}人
                          </div>
                        </div>
                      </div>
                      {event.status === 'upcoming' && (
                        <button className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                          参加申込
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* メンバータブ */}
          {activeTab === 'members' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">メンバー</h3>
                <span className="text-sm text-gray-500">
                  {members.length}人のメンバー
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-3">
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.contribution_level === 'active' ? 'bg-green-100 text-green-700' :
                            member.contribution_level === 'regular' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {member.contribution_level === 'active' ? 'アクティブ' :
                             member.contribution_level === 'regular' ? 'レギュラー' : 'ビギナー'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {member.skills.map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      参加日: {new Date(member.joined_at).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* レビュータブ */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">レビュー・評価</h3>
                {averageRating > 0 && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">/ 5.0</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={review.reviewer.avatar_url}
                          alt={review.reviewer.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{review.reviewer.name}</div>
                          <div className="text-sm text-gray-500">{review.reviewer.role}</div>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(review.created_at).toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        参加イベント: {review.event}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {review.helpful_count}人が参考になったと回答
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}