'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client';
import { Users, User_Notifications } from '@/types/graphql';

interface UserDetailProps {}

export default function UserDetailPage({}: UserDetailProps) {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<Users | null>(null);
  const [notifications, setNotifications] = useState<User_Notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const hasuraClient = getHasuraClient();
      
      // 并行获取用户信息和通知记录
      const [userResult, notificationsResult] = await Promise.all([
        // 获取用户信息
        hasuraClient.data_by_pk<Users>({
          table: 'users',
          args: { id: userId },
          data_fields: [
            'id',
            'email',
            'nickname',
            'phone',
            'created_at',
            'updated_at'
          ]
        }),
        // 获取用户通知记录
        hasuraClient.datas<User_Notifications>({
          table: 'user_notifications',
          args: {
            where: { user_users: { _eq: userId } },
            order_by: { created_at: () => 'desc' }
          },
          datas_fields: [
            'id',
            'content',
            'created_at',
            'updated_at'
          ]
        })
      ]);

      setUser(userResult);
      setNotifications(notificationsResult);
    } catch (err) {
      console.error('获取用户详情失败:', err);
      setError('获取用户详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '刚刚';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error || '用户不存在'}</p>
          <div className="space-x-4">
            <button
              onClick={fetchUserDetails}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
            <Link
              href="/users"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              返回用户列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                首页
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href="/users" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">用户管理</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">用户详情</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 用户基本信息卡片 */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">用户详情</h1>
              <button
                onClick={fetchUserDetails}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex items-start space-x-6">
              {/* 用户头像 */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              
              {/* 用户信息 */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">用户ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">昵称</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user.nickname || <span className="text-gray-400 italic">未设置</span>}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">手机号</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user.phone || <span className="text-gray-400 italic">未设置</span>}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">时间信息</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">注册时间</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">最后更新</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(user.updated_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">通知数量</dt>
                        <dd className="mt-1 text-sm text-gray-900">{notifications.length} 条</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 通知记录 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">通知记录</h2>
            <p className="mt-1 text-sm text-gray-500">该用户的所有通知消息</p>
          </div>
          
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
              <p className="text-gray-500">该用户还没有收到任何通知</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div key={notification.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.content}</p>
                          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatDate(notification.created_at)}</span>
                            <span>•</span>
                            <span>{getRelativeTime(notification.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        通知 #{notification.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 返回按钮 */}
        <div className="mt-8 flex justify-end">
          <Link
            href="/users"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回用户列表
          </Link>
        </div>
      </div>
    </div>
  );
}
