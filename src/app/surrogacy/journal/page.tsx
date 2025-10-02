"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
const JournalPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [postId: number]: any[] }>({});
  const [caseId, setCaseId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  // 获取动态列表
  useEffect(() => {
    // 获取 surrogateId
    const surrogateId = typeof window !== "undefined" ? localStorage.getItem("surrogateId") : null;
    if (!surrogateId) {
  setError(t('myCases.error.noUserId', '未找到用户ID，请重新登录。'));
      setLoading(false);
      return;
    }
    // 获取 case 列表
    fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`)
      .then(async (res) => {
  if (!res.ok) throw new Error(t('myCases.error.fetchFailed', '获取案子失败'));
        const data = await res.json();
        const casesRaw = data.cases || data.data || data || [];
        if (casesRaw.length > 0) {
          setCaseId(casesRaw[0].id);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // caseId 变化时获取动态
  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`/api/posts?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.data || []);
        setLoading(false);
      });
  }, [caseId]);

  // 获取评论
  const fetchComments = async (postId: number) => {
    const res = await fetch(`/api/post_comments?postId=${postId}`);
    const data = await res.json();
    setComments(prev => ({ ...prev, [postId]: data.data || [] }));
  };

  // 发表动态
  const handlePost = async () => {
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
    // 刷新动态
    fetch(`/api/posts?caseId=${caseId}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.data || []);
      });
  };

  // 发表评论
  const handleComment = async (postId: number) => {
    if (!commentText.trim()) return;
    setLoading(true);
    // 从 localStorage 获取 surrogateId
    const surrogateId = typeof window !== 'undefined' ? localStorage.getItem('surrogateId') : null;
    await fetch("/api/post_comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentText,
        comment_role: "surrogate_mother",
        post_posts: postId,
        surrogate_mother_surrogate_mothers: surrogateId ? Number(surrogateId) : undefined,
      }),
    });
    setCommentText("");
    setLoading(false);
    fetchComments(postId);
  };

  return (
    <div
      className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-2 md:px-8 py-6 flex flex-col items-center"
      style={{ fontFamily: 'Source Serif 4, serif' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col gap-6">
  {/* 标题与描述 */}
  <h1 className="text-2xl font-bold mb-1">{t('myCases.journey', t('journey.title', 'My Journal'))}</h1>
  <p className="mb-6 text-base">{t('journey.description', 'Record your experiences and feelings through your journey as a surrogate')}</p>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧日志卡片区 */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {loading ? (
              <div className="text-center py-8">{t('loadingText', '加载中...')}</div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 min-w-0"
                >
                  {/* 左侧图片区 */}
                  {Array.isArray(post.url) && post.url.length > 0 && (
                    <div className="flex-shrink-0 w-full md:w-1/3 max-w-xs min-w-[120px] flex items-center justify-center mx-auto md:mx-0">
                      <div className={`grid gap-2 ${post.url.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} w-full`}>
                        {post.url.slice(0, 4).map((url: string, index: number) => (
                          <div key={index} className="w-full aspect-square bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                            <img src={url} alt={`post image ${index + 1}`} className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 右侧内容区 */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="text-lg font-semibold flex-1 min-w-0 truncate">{post.title || post.content || t('myCases.publishUpdate', t('journey.stage1.title', 'This week I felt...'))}</div>
                      <div className="text-xs text-[#271F18] opacity-60 ml-0 md:ml-4 flex-shrink-0 whitespace-nowrap">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</div>
                    </div>
                    <button
                      className="mt-2 px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition self-start"
                      onClick={() => {
                        if (activePostId === post.id) {
                          setActivePostId(null);
                        } else {
                          setActivePostId(post.id);
                          fetchComments(post.id);
                        }
                      }}
                    >
                      {activePostId === post.id ? t('cancel', '关闭评论') : t('viewDetails', '查看评论')}
                    </button>

                    {activePostId === post.id && (
                      <div className="mt-2">
                        <div className="mb-2 text-xs font-bold">{t('comments', '评论：')}</div>
                        <div className="flex flex-col gap-2">
                          {(comments[post.id] || post.post_comments || []).map((c: any) => (
                            <div key={c.id} className="bg-white rounded px-2 py-2 text-xs border border-[#E6E6E6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                              <div className="flex-1 min-w-0">
                                <span className="font-bold mr-2 text-[#3a2c1e]">
                                  {(() => {
                                    // 当前端为代孕母，自己发的评论显示“我”
                                    const surrogateId = typeof window !== 'undefined' ? localStorage.getItem('surrogateId') : null;
                                    if (c.comment_role === "surrogate_mother" && c.surrogate_mother_surrogate_mothers == surrogateId) {
                                      return t('me', '我');
                                    }
                                    if (c.comment_role === "surrogate_mother") {
                                      return t('surrogateMother', 'Surrogate Mother');
                                    }
                                    if (c.comment_role === "intended_parent") {
                                      return t('intendedParent', 'Intended Parent');
                                    }
                                    return c.comment_role;
                                  })()}
                                </span>
                                <span>{c.content}</span>
                              </div>
                              <span className="sm:ml-4 text-[11px] text-gray-400 whitespace-nowrap">
                                {c.created_at ? new Date(c.created_at).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                          <input
                            type="text"
                            className="border rounded px-2 py-1 text-xs flex-1 min-w-0"
                            placeholder={t('ivfClinic.addNewNote', '写评论...')}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                          />
                          <button
                            className="px-3 py-1 bg-[#271F18] text-white rounded text-xs w-full sm:w-auto"
                            onClick={() => handleComment(post.id)}
                          >{t('submit', '发表评论')}</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* 右侧填写区 */}
          <div className="w-full lg:w-[420px] flex flex-col gap-4 flex-shrink-0">
            <div className="bg-[#FBF0DA] rounded-xl shadow-md p-4 mb-2">
              <div className="text-lg font-semibold mb-2">{t('myCases.publishUpdate', t('journey.stage1.title', "This week, I'm feeling..."))}</div>
              <textarea
                className="w-full h-24 rounded-md border border-[#E6E6E6] p-2 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#271F18]"
                placeholder={t('ivfClinic.noteContent', 'Write a message...')}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <div className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex flex-col items-center justify-center h-32">
              <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                <svg width="32" height="32" fill="#271F18" className="mb-2 opacity-40"><path d="M16 4a12 12 0 100 24 12 12 0 000-24zm0 22a10 10 0 110-20 10 10 0 010 20zm-4-8l2.5 3 3.5-4.5 4.5 6H8l4-4.5z"/></svg>
                <span className="text-sm text-[#271F18] opacity-60">{t('files.upload', 'Upload')}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
              {photo && (
                <div className="mt-2 text-xs text-[#271F18]">{photo.name}</div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <span>{t('visible', 'Visible')}</span>
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={e => setVisible(e.target.checked)}
                  className="accent-[#271F18] w-4 h-4 rounded"
                />
              </label>
              <button
                className="w-full sm:w-auto ml-0 sm:ml-auto px-6 py-2 bg-[#271F18] text-white rounded-full font-semibold shadow hover:bg-[#3a2c1e] transition"
                onClick={handlePost}
                disabled={loading}
              >
                {t('myCases.publishUpdate', '发布动态')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
