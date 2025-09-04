'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Clock, Star, Github, ExternalLink, 
  MessageSquare, Heart, Award, TrendingUp,
  Calendar, CheckCircle, ArrowLeft, Share
} from 'lucide-react';
import { apiClient } from '../../../lib/api';

export default function FreelancerDetailPage() {
  const params = useParams();
  const freelancerId = params.id;
  
  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchFreelancerData();
  }, [freelancerId]);

  const fetchFreelancerData = async () => {
    try {
      // 実際のデータを取得（フリーランサー一覧から該当IDを探す）
      const response = await apiClient.getFreelancers();
      const freelancerData = response.freelancers.find(f => f.id === parseInt(freelancerId));
      
      if (freelancerData) {
        setFreelancer(freelancerData);
        
        // モック用のレビューデータ
        setReviews([
          {
            id: 1,
            reviewer: {
              name: "Tech勉強会",
              avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
              type: "community"
            },
            rating: 5,
            comment: "非常に優秀なエンジニアでした。技術力が高く、コミュニケーションも円滑で、プロジェクトを成功に導いてくれました。また機会があればぜひお願いしたいです。",
            project: "Webアプリケーション開発",
            created_at: "2024-01-15",
            skills_used: ["React", "Node.js"]
          },
          {
            id: 2,
            reviewer: {
              name: "スタートアップ勉強会",
              avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=SU",
              type: "community"
            },
            rating: 4,
            comment: "プロジェクトに積極的に参加していただき、大変助かりました。技術的な提案も的確で、チーム全体のレベル向上に貢献してくれました。",
            project: "API設計ワークショップ",
            created_at: "2024-01-10",
            skills_used: ["Python", "FastAPI"]
          },
          {
            id: 3,
            reviewer: {
              name: "フロントエンド勉強会",
              avatar_url: "https://api.dicebear.com/7.x/initials/svg?seed=FE",
              type: "community"
            },
            rating: 5,
            comment: "React の深い知識をお持ちで、初心者にも分かりやすく教えてくださいました。人柄も素晴らしく、コミュニティの雰囲気を良くしてくれます。",
            project: "React基礎講座",
            created_at: "2024-01-05",
            skills_used: ["React", "JavaScript"]
          }
        ]);

        // モック用のポートフォリオデータ
        setPortfolio([
          {
            id: 1,
            title: "Eコマースプラットフォーム",
            description: "React + Node.js で構築したフルスタックのEコマースサイト。ユーザー認証、決済機能、管理画面を実装。",
            technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
            image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
            demo_url: "https://demo.example.com",
            github_url: "https://github.com/example/ecommerce",
            created_at: "2024-01-01"
          },
          {
            id: 2,
            title: "タスク管理アプリ",
            description: "チーム向けのタスク管理ツール。リアルタイム更新、ドラッグ&ドロップ、通知機能を実装。",
            technologies: ["React", "Python", "WebSocket", "Redis"],
            image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
            demo_url: "https://taskapp.example.com",
            github_url: "https://github.com/example/taskapp",
            created_at: "2023-12-15"
          },
          {
            id: 3,
            title: "データ可視化ダッシュボード",
            description: "ビジネスデータを美しく可視化するダッシュボード。インタラクティブなグラフとリアルタイム更新機能。",
            technologies: ["React", "D3.js", "Python", "FastAPI"],
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            demo_url: "https://dashboard.example.com",
            github_url: "https://github.com/example/dashboard",
            created_at: "2023-11-20"
          }
        ]);
      }
    } catch (error) {
      console.error('フリーランサーデータ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchRequest = async () => {
    try {
      // モック用の現在ユーザーID（コミュニティとして）
      const currentUserId = 3;
      
      await apiClient.createMatch({
        freelancer_id: parseInt(freelancerId),
        community_id: currentUserId,
        message: `${freelancer.name}さんのスキルに興味があります。ぜひ一度お話しできればと思います。`
      });
      
      alert('マッチングリクエストを送信しました！');
    } catch (error) {
      console.error('マッチングリクエストエラー:', error);
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

  if (!freelancer) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">フリーランサーが見つかりません</h2>
          <p className="text-gray-600 mb-4">指定されたフリーランサーは存在しないか、削除された可能性があります。</p>
          <Link href="/matching" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
            フリーランサー一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ナビゲーション */}
      <div className="flex items-center mb-6">
        <Link href="/matching" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          フリーランサー一覧に戻る
        </Link>
      </div>

      {/* プロフィールヘッダー */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src={freelancer.avatar_url}
                alt={freelancer.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{freelancer.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {freelancer.location}
                  {freelancer.remote_ok && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      リモートOK
                    </span>
                  )}
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
                onClick={handleMatchRequest}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                マッチング申請
              </button>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">稼働状況</div>
                <div className="text-sm text-gray-600">{freelancer.availability}</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Award className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">経験年数</div>
                <div className="text-sm text-gray-600">{freelancer.experience_years}年</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-900">時給</div>
                <div className="text-sm text-gray-600">¥{freelancer.hourly_rate?.toLocaleString()}/時</div>
              </div>
            </div>
          </div>

          {/* 自己紹介 */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{freelancer.bio}</p>
          </div>

          {/* スキル */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">スキル</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills?.map((skill) => (
                <span key={skill} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 外部リンク */}
          <div className="flex gap-4">
            {freelancer.github_url && (
              <a
                href={freelancer.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="w-4 h-4 mr-1" />
                GitHub
              </a>
            )}
            {freelancer.portfolio_url && (
              <a
                href={freelancer.portfolio_url}
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
              { id: 'overview', label: '概要', icon: TrendingUp },
              { id: 'portfolio', label: 'ポートフォリオ', icon: ExternalLink },
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細プロフィール</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">専門分野</h4>
                    <p className="text-gray-600">
                      フルスタック開発を得意とし、特にReactを使ったフロントエンド開発とNode.js/Pythonを使ったバックエンド開発に強みがあります。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">働き方</h4>
                    <p className="text-gray-600">
                      リモートワーク中心で、必要に応じてオンサイトでの作業も可能です。コミュニケーションを重視し、チームワークを大切にしています。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">得意プロジェクト</h4>
                    <p className="text-gray-600">
                      Webアプリケーション開発、API設計・開発、データベース設計、CI/CD構築など、幅広いプロジェクトに対応可能です。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">コミュニティ活動</h4>
                    <p className="text-gray-600">
                      技術勉強会での講師経験が豊富で、初心者向けの技術指導も得意です。知識共有を通じたコミュニティ貢献を心がけています。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ポートフォリオタブ */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">ポートフォリオ</h3>
                <span className="text-sm text-gray-500">{portfolio.length}件のプロジェクト</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((project) => (
                  <div key={project.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(project.created_at).toLocaleDateString('ja-JP')}
                        </span>
                        <div className="flex gap-2">
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              デモ
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                            >
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
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
                          <div className="text-sm text-gray-500">{review.project}</div>
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
                    
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-gray-500 mr-2">使用スキル:</span>
                      {review.skills_used.map((skill) => (
                        <span key={skill} className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
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