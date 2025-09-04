'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Users, Target, MessageCircle, Star, ArrowRight, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function HomePage() {
  const [featuredCommunities, setFeaturedCommunities] = useState([]);
  const [featuredFreelancers, setFeaturedFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        const [communitiesRes, freelancersRes] = await Promise.all([
          apiClient.getFeaturedCommunities(),
          apiClient.getFreelancers()
        ]);
        
        setFeaturedCommunities(communitiesRes.featured_communities || []);
        setFeaturedFreelancers((freelancersRes.freelancers || []).slice(0, 6));
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              フリーランスと<br />
              コミュニティを<span className="text-yellow-300">つなぐ</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              あなたのスキルを活かせるコミュニティを見つけよう
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center">
                無料で始める
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/matching" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                コミュニティを探す
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              JoinUpの特徴
            </h2>
            <p className="text-xl text-gray-600">
              フリーランスとコミュニティの新しいつながり方
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特徴1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">多様なコミュニティ</h3>
              <p className="text-gray-600">
                エンジニア、デザイナー、マーケター向けなど、様々な分野のコミュニティが参加
              </p>
            </div>

            {/* 特徴2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">精密なマッチング</h3>
              <p className="text-gray-600">
                スキル、経験、希望条件をもとに最適なコミュニティをご提案
              </p>
            </div>

            {/* 特徴3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">安心のサポート</h3>
              <p className="text-gray-600">
                マッチング後のやり取りからトラブル対応まで、運営チームがサポート
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 注目のコミュニティ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                注目のコミュニティ
              </h2>
              <p className="text-gray-600">
                活発に活動している人気のコミュニティ
              </p>
            </div>
            <Link href="/matching" className="text-primary-600 hover:text-primary-700 flex items-center">
              すべて見る
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : (
              featuredCommunities.map((community) => (
                <div key={community.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Image
                      src={community.avatar_url}
                      alt={community.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{community.name}</h3>
                      <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {community.community_type}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {community.activity_description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {community.member_count}人
                    </div>
                    <Link href={`/communities/${community.id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 注目のフリーランサー */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                注目のフリーランサー
              </h2>
              <p className="text-gray-600">
                様々なスキルを持つ優秀なフリーランサー
              </p>
            </div>
            <Link href="/freelancers" className="text-primary-600 hover:text-primary-700 flex items-center">
              すべて見る
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredFreelancers.map((freelancer) => (
                <div key={freelancer.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
                  <Image
                    src={freelancer.avatar_url}
                    alt={freelancer.name}
                    width={64}
                    height={64}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">{freelancer.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{freelancer.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {freelancer.skills?.slice(0, 3).map((skill) => (
                      <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{freelancer.experience_years}年経験</span>
                    <Link href={`/freelancers/${freelancer.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      プロフィール
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* メリットセクション */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* フリーランサー向け */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                フリーランサーの方へ
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                あなたのスキルを活かせるコミュニティと出会い、新しいネットワークを構築しませんか？
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'スキルに合ったコミュニティをAIが提案',
                  '継続的な案件・プロジェクトの機会',
                  '同じ分野の仲間との交流',
                  '新しいスキル習得のチャンス'
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?type=freelancer" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center">
                フリーランサー登録
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {/* コミュニティ向け */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                コミュニティ主催者の方へ
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                優秀なフリーランサーとつながり、コミュニティをより活発にしませんか？
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  '専門スキルを持つ人材の発見',
                  'イベント運営やコンテンツ制作の支援',
                  'コミュニティの価値向上',
                  '長期的なパートナーシップの構築'
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?type=community" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center">
                コミュニティ登録
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            今すぐJoinUpを始めよう
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            無料登録で、あなたに最適なマッチングを見つけましょう
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
              無料で始める
            </Link>
            <Link href="/matching" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              マッチング機能を試す
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}