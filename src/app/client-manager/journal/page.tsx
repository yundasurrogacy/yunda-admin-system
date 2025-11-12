"use client";
import React, { Suspense, useState, useEffect, useMemo, useCallback, memo } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter, useSearchParams } from 'next/navigation';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取评论组件（使用 memo 优化）
const CommentItem = memo(({ 
  comment, 
  t 
}: { 
  comment: any; 
  t: any;
}) => {
  const displayName = useMemo(() => {
    if (comment.comment_role === "admin") {
      return t('admin', 'Admin');
    }
    if (comment.comment_role === "client_manager") {
      return t('clientManager', 'Client Manager');
    }
    if (comment.comment_role === "surrogate_mother") {
      return t('surrogateMother', 'Surrogate Mother');
    }
    if (comment.comment_role === "intended_parent") {
      return t('intendedParent', 'Intended Parent');
    }
    return comment.comment_role;
  }, [comment.comment_role, t]);

  const formattedDate = useMemo(() => {
    return comment.created_at 
      ? new Date(comment.created_at).toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      : "";
  }, [comment.created_at]);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2.5 text-sm border border-sage-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
      <div className="flex-1 min-w-0">
        <span className="font-bold mr-2 text-sage-700">{displayName}</span>
        <span className="text-sage-600">{comment.content}</span>
      </div>
      <span className="sm:ml-4 text-xs text-gray-500 whitespace-nowrap font-medium">
        {formattedDate}
      </span>
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

function JournalPageInner() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCaseId = searchParams.get('caseId');
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentTexts, setCommentTexts] = useState<{ [postId: number]: string }>({});
  const [comments, setComments] = useState<{ [postId: number]: any[] }>({});
  const [caseId, setCaseId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // 认证检查和 cookie 读取
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_manager')
      const userEmail = getCookie('userEmail_manager')
      const userId = getCookie('userId_manager')
      const authed = !!(userRole && userEmail && userId && userRole === 'manager')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client-manager/login')
      }
    }
  }, [router]);

  // 获取caseId：从URL参数获取
  useEffect(() => {
    if (!isAuthenticated) return;
    if (urlCaseId) {
      setCaseId(Number(urlCaseId));
    } else {
      setError(t('myCases.error.noCaseId', '请提供案件ID'));
    }
  }, [urlCaseId, isAuthenticated, t]);

  // caseId 变化时获取动态和评论
  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/posts?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        const postsData = data.data || [];
        setPosts(postsData);
        // 自动加载所有评论
        const commentsPromises = postsData.map((post: any) => 
          fetch(`/api/post_comments?postId=${post.id}`)
            .then(res => res.json())
            .then(result => ({ postId: post.id, comments: result.data || [] }))
        );
        Promise.all(commentsPromises).then(commentsData => {
          const commentsMap: { [postId: number]: any[] } = {};
          commentsData.forEach(({ postId, comments }) => {
            commentsMap[postId] = comments;
          });
          setComments(commentsMap);
          setLoading(false);
        });
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [caseId]);

  // 使用 useCallback 缓存发表评论函数
  const handleComment = useCallback(async (postId: number) => {
    const commentText = commentTexts[postId] || "";
    if (!commentText.trim()) return;
    setLoading(true);
    await fetch("/api/post_comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentText,
        comment_role: "client_manager",
        post_posts: postId,
      }),
    });
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
    setLoading(false);
    // 重新获取评论
    const res = await fetch(`/api/post_comments?postId=${postId}`);
    const data = await res.json();
    setComments(prev => ({ ...prev, [postId]: data.data || [] }));
  }, [commentTexts]);

  const handleCommentTextChange = useCallback((postId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentTexts(prev => ({ ...prev, [postId]: e.target.value }));
  }, []);

  // 认证检查中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-sage-700">{t('loading', '加载中...')}</div>
      </div>
    );
  }

  // 未认证
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-main-bg text-sage-800 px-4 lg:px-12 py-8"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-8 mx-auto">
        {/* 标题与描述 */}
        <div className="border-b border-sage-200 pb-6">
          <h1 className="text-3xl font-bold mb-3 text-sage-800">{t('myCases.surrogateJournalTitle', t('journal.surrogateTitle', 'Surrogate Journal'))}</h1>
          <p className="text-base text-sage-600 leading-relaxed">{t('journal.surrogateDescription', 'Here you can find the latest updates and photos from your surrogate mother, allowing you to follow her progress in real-time')}</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧日志卡片区 */}
          <div className="flex-[3] flex flex-col gap-6 min-w-0">
            {error && (
              <div className="text-center py-8 text-red-600">{error}</div>
            )}
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sage-300 border-t-sage-600"></div>
                <p className="mt-4 text-sage-600 font-medium">{t('loadingText', '加载中...')}</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-[#FBF0DA] to-[#F9ECD8] rounded-2xl shadow-lg p-6 flex flex-col gap-5 min-w-0"
                >
                  {/* 1. 帖子文字内容 - 最上面 */}
                  <div className="flex justify-between items-start gap-3 pb-3 border-b border-sage-200">
                    <div className="text-lg font-semibold flex-1 min-w-0 text-sage-800 leading-relaxed">{post.title || post.content || t('myCases.publishUpdate', t('journey.stage1.title', 'This week I felt...'))}</div>
                    <div className="text-xs font-medium text-sage-600 bg-white px-2 py-1 rounded-full whitespace-nowrap">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</div>
                  </div>

                  {/* 2. 图片 - 在文字下面 */}
                  {Array.isArray(post.url) && post.url.length > 0 && (
                    <div className="w-full">
                      <div className={`grid gap-3 ${post.url.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.url.slice(0, 4).map((url: string, imgIndex: number) => (
                          <div key={imgIndex} className="w-full rounded-xl overflow-hidden shadow-md">
                            <img 
                              src={url} 
                              alt={`post image ${imgIndex + 1}`} 
                              className="w-full h-auto max-h-96 object-contain rounded-xl mx-auto" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. 评论区域 - 最下面 */}
                  <div className="pt-4 border-t border-sage-200">
                    <div className="mb-3 text-sm font-bold text-sage-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
                      </svg>
                      {t('comments', '评论：')}
                    </div>
                    <div className="flex flex-col gap-3 mb-4">
                      {(comments[post.id] || post.post_comments || []).length > 0 ? (
                        (comments[post.id] || post.post_comments || []).map((c: any) => (
                          <CommentItem key={c.id} comment={c} t={t} />
                        ))
                      ) : (
                        <div className="text-sm text-sage-500 italic py-2">{t('journal.noComments', '暂无评论')}</div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        className="border border-sage-300 rounded-lg px-4 py-2.5 text-sm flex-1 min-w-0 bg-white focus:outline-none focus:border-sage-400 focus:shadow-sm placeholder:text-sage-400"
                        placeholder={t('ivfClinic.addNewNote', '写评论...')}
                        value={commentTexts[post.id] || ""}
                        onChange={handleCommentTextChange(post.id)}
                      />
                      <button
                        className="px-6 py-2.5 bg-sage-700 text-white rounded-lg text-sm w-full sm:w-auto font-semibold focus:outline-none focus:ring-2 focus:ring-sage-300 hover:bg-sage-800 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleComment(post.id)}
                        disabled={loading || !commentTexts[post.id]?.trim()}
                      >
                        {t('submit', '发表评论')}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JournalPage() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <JournalPageInner />
    </Suspense>
  );
}

