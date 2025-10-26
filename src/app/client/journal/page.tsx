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
    const parentId = typeof window !== 'undefined' ? localStorage.getItem('parentId') : null;
    if (comment.comment_role === "intended_parent" && comment.intended_mother_surrogate_mothers == parentId) {
      return t('me', '我');
    }
    if (comment.comment_role === "surrogate_mother") {
      return t('surrogateMother', 'Surrogate Mother');
    }
    if (comment.comment_role === "intended_parent") {
      return t('me', '我');
    }
    return comment.comment_role;
  }, [comment.comment_role, comment.intended_mother_surrogate_mothers, t]);

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
    <div className="bg-white rounded px-2 py-2 text-xs border border-[#E6E6E6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
      <div className="flex-1 min-w-0">
        <span className="font-semibold mr-2 text-sage-800">{displayName}</span>
        <span>{comment.content}</span>
      </div>
      <span className="sm:ml-4 text-[11px] text-gray-400 whitespace-nowrap">
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
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentTexts, setCommentTexts] = useState<{ [postId: number]: string }>({});
  const [comments, setComments] = useState<{ [postId: number]: any[] }>({});
  const [caseId, setCaseId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // 认证检查和 cookie 读取
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_client')
      const userEmail = getCookie('userEmail_client')
      const userId = getCookie('userId_client')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client/login')
      }
    }
  }, [router]);

  // 获取caseId：优先URL参数，无则取最新case
  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated) return;

    if (urlCaseId) {
      setCaseId(Number(urlCaseId));
      return;
    }
    const parentId = getCookie('userId_client');
    if (!parentId) {
      setError(t('myCases.error.noUserId', '未找到用户ID，请重新登录。'));
      setLoading(false);
      return;
    }
    // 获取 case 列表
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(t('myCases.error.fetchFailed', '获取案子失败'));
        const data = await res.json();
        const casesRaw = data.cases || data.data || data || [];
        if (casesRaw.length > 0) {
          // 取 updated_at 最大（最新）的那个 case
          const latestCase = casesRaw.reduce((max: any, cur: any) => {
            if (!max) return cur;
            return new Date(cur.updated_at) > new Date(max.updated_at) ? cur : max;
          }, null);
          if (latestCase) setCaseId(latestCase.id);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [urlCaseId, t, isAuthenticated]);

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
      });
  }, [caseId]);


  // 使用 useCallback 缓存发表动态函数
  const handlePost = useCallback(async () => {
    if (!message.trim() || !caseId) return;
    setLoading(true);
    let cover_img_url = "";
    if (photo) {
      const formData = new FormData();
      formData.append("file", photo);
      const uploadRes = await fetch("/api/upload/form", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.success) {
        cover_img_url = uploadData.data.url || uploadData.data.path || uploadData.data.fileUrl || uploadData.data;
      }
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message, case_cases: caseId, url: cover_img_url ? [cover_img_url] : [] }),
    });
    const data = await res.json();
    setMessage("");
    setPhoto(null);
    setLoading(false);
    // 刷新动态和评论
    fetch(`/api/posts?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        const postsData = data.data || [];
        setPosts(postsData);
        // 重新加载所有评论
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
        });
      });
  }, [message, caseId, photo, t]);

  // 使用 useCallback 缓存发表评论函数
  const handleComment = useCallback(async (postId: number) => {
    const commentText = commentTexts[postId] || "";
    if (!commentText.trim()) return;
    setLoading(true);
    // 从 localStorage 获取 parentId
    const parentId = typeof window !== 'undefined' ? localStorage.getItem('parentId') : null;
    await fetch("/api/post_comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentText,
        comment_role: "intended_parent",
        post_posts: postId,
        intended_mother_surrogate_mothers: parentId ? Number(parentId) : undefined,
      }),
    });
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
    setLoading(false);
    // 重新获取评论
    const res = await fetch(`/api/post_comments?postId=${postId}`);
    const data = await res.json();
    setComments(prev => ({ ...prev, [postId]: data.data || [] }));
  }, [commentTexts]);


  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, []);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }, []);

  const handleVisibleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setVisible(e.target.value === 'true');
  }, []);

  const handleCommentTextChange = useCallback((postId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentTexts(prev => ({ ...prev, [postId]: e.target.value }));
  }, []);

  // 使用 useMemo 缓存按钮禁用状态
  const canPost = useMemo(() => message.trim() && caseId, [message, caseId]);

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
      className="min-h-screen bg-[#FBF0DA40] text-sage-800 px-2 md:px-8 py-6 flex flex-col items-center"
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col gap-6">
        {/* 标题与描述 */}
        <h1 className="text-2xl font-medium mb-1 text-sage-800">{t('myCases.surrogateJournalTitle', t('journal.surrogateTitle', 'Surrogate Journal'))}</h1>
        <p className="mb-6 text-base text-sage-800">{t('journal.surrogateDescription', 'Here you can find the latest updates and photos from your surrogate mother, allowing you to follow her progress in real-time')}</p>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧日志卡片区 */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {loading ? (
              <div className="text-center py-8">{t('loadingText', '加载中...')}</div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex flex-col gap-4 min-w-0"
                >
                  {/* 1. 帖子文字内容 - 最上面 */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-lg font-medium flex-1 min-w-0 text-sage-800">{post.title || post.content || t('myCases.publishUpdate', t('journey.stage1.title', 'This week I felt...'))}</div>
                    <div className="text-xs text-[#271F18] opacity-60 whitespace-nowrap">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</div>
                  </div>

                  {/* 2. 图片 - 在文字下面 */}
                  {Array.isArray(post.url) && post.url.length > 0 && (
                    <div className="w-full">
                      <div className={`grid gap-2 ${post.url.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.url.slice(0, 4).map((url: string, index: number) => (
                          <div key={index} className="w-full rounded-md overflow-hidden">
                            <img src={url} alt={`post image ${index + 1}`} className="w-full h-auto max-h-96 object-contain rounded-md mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. 评论区域 - 最下面 */}
                  <div className="pt-3 border-t border-sage-300">
                    <div className="mb-2 text-sm font-semibold text-sage-800">{t('comments', '评论：')}</div>
                    <div className="flex flex-col gap-2 mb-3">
                      {(comments[post.id] || post.post_comments || []).map((c: any) => (
                        <CommentItem key={c.id} comment={c} t={t} />
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:border-sage-400 focus:shadow-sm transition-colors"
                        placeholder={t('ivfClinic.addNewNote', '写评论...')}
                        value={commentTexts[post.id] || ""}
                        onChange={handleCommentTextChange(post.id)}
                      />
                      <button
                        className="px-3 py-1 bg-[#271F18] text-white rounded text-xs w-full sm:w-auto font-medium focus:outline-none hover:bg-[#1a1a1a] transition cursor-pointer"
                        onClick={() => handleComment(post.id)}
                      >{t('submit', '发表评论')}</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* 右侧填写区（准父母视图不显示，仅保留查看和评论） */}
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
