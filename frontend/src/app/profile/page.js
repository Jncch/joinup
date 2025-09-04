'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Edit, MapPin, Clock, Star, Github, ExternalLink, 
  Users, Calendar, Award, MessageSquare, Settings 
} from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function ProfilePage() {
  // モック用のユーザーID（実際の実装では認証から取得）
  const currentUserId = 1;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchReviews();
    fetchMatches();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiClient.getUserProfile(currentUserId);
      setProfile(data);
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    // モックデータ
    setReviews([
      {
        id: 1,
        reviewer: { name: 'Tech勉強会', avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=TC' },
        rating: 5,
        comment: 'とても優秀なエンジニアです。技術力が高く、コミュニケーションも円滑でした。',
        created_at: '2024-01-15'
      },
      {
        id: 2,
        reviewer: { name: 'デザイン交流会', avatar_url: 'https://api.dicebear.com/7.x/initials/svg?seed=DC' },
        rating: 4,
        comment: 'プロジェクトに積極的に参加していただき、大変助かりました。',
        created_at: '2024-01-10'
      }
    ]);
  };

  const fetchMatches = async () => {
    try {
      const data = await apiClient.getMatches(currentUserId);
      setMatches(data.matches || []);
    } catch (error) {
      console.error('マッチング履歴取得エラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="ml-6 flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">プロフィールが見つかりません</h2>
          <p className="text-gray-600">プロフィールを作成してください。</p>
        </div>
      </div>
    );
  }

  const isFreelancer = profile.user_type === 'freelancer';
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* プロフィールヘッダー */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.profile?.location || '未設定'}
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
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              編集
            </button>
          </div>

          {/* プロフィール概要 */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {profile.profile?.bio || 'プロフィールの説明がまだ設定されていません。'}
            </p>
          </div>

          {/* フリーランサー向け情報 */}
          {isFreelancer && profile.profile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">稼働状況</div>
                  <div className="text-sm text-gray-600">{profile.profile.availability}</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Award className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">経験年数</div>
                  <div className="text-sm text-gray-600">{profile.profile.experience_years}年</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Star className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">時給</div>
                  <div className="text-sm text-gray-600">¥{profile.profile.hourly_rate?.toLocaleString()}/時</div>
                </div>
              </div>
            </div>
          )}

          {/* コミュニティ向け情報 */}
          {!isFreelancer && profile.profile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">メンバー数</div>
                  <div className="text-sm text-gray-600">{profile.profile.member_count}人</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">カテゴリ</div>
                  <div className="text-sm text-gray-600">{profile.profile.community_type}</div>
                </div>
              </div>
            </div>
          )}

          {/* スキル・リンク */}
          {isFreelancer && profile.profile?.skills && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">スキル</h3>
              <div className="flex flex-wrap gap-2">
                {profile.profile.skills.map((skill) => (
                  <span key={skill} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 外部リンク */}
          <div className="flex gap-4">
            {profile.profile?.github_url && (
              <a
                href={profile.profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </a>
            )}
            {profile.profile?.portfolio_url && (
              <a
                href={profile.profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                ポートフォリオ
              </a>
            )}
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'overview', label: '概要', icon: Users },
              { id: 'reviews', label: 'レビュー', icon: Star },
              { id: 'activity', label: '活動履歴', icon: MessageSquare }
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
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">プロフィール詳細</h3>
              {isFreelancer ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">希望するコミュニティ</h4>
                    <p className="text-gray-600">
                      {profile.profile?.preferred_communities?.join(', ') || 'まだ設定されていません'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">リモート対応</h4>
                    <p className="text-gray-600">
                      {profile.profile?.remote_ok ? '対応可能' : '対面のみ'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">活動内容</h4>
                    <p className="text-gray-600">
                      {profile.profile?.activity_description || 'まだ設定されていません'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">対象者</h4>
                    <p className="text-gray-600">
                      {profile.profile?.target_audience || 'まだ設定されていません'}
                    </p>
                  </div>
                </div>
              )}
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

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Image
                          src={review.reviewer.avatar_url}
                          alt={review.reviewer.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900">{review.reviewer.name}</div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">{review.created_at}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">まだレビューがありません</h4>
                  <p className="text-gray-500">
                    コミュニティでの活動を通じてレビューを集めましょう
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 活動履歴タブ */}
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">マッチング履歴</h3>

              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image
                            src={isFreelancer ? match.community.avatar_url : match.freelancer.avatar_url}
                            alt={isFreelancer ? match.community.name : match.freelancer.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">
                              {isFreelancer ? match.community.name : match.freelancer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(match.created_at).toLocaleDateString('ja-JP')}
                            </div>
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
                      {match.message && (
                        <p className="mt-3 text-gray-600 text-sm">{match.message}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">まだ活動履歴がありません</h4>
                  <p className="text-gray-500 mb-4">
                    マッチング機能を使って新しいつながりを作りましょう
                  </p>
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    マッチングを始める
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}