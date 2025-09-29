"use client";
import React, { useState, useEffect } from "react";

const JournalPage: React.FC = () => {
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
    // 获取 parentId
    const parentId = typeof window !== "undefined" ? localStorage.getItem("parentId") : null;
    if (!parentId) {
      setError("未找到用户ID，请重新登录。");
      setLoading(false);
      return;
    }
    // 获取 case 列表
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("获取案子失败");
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
    console.log("comments", data);
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
      body: JSON.stringify({ content: message, case_cases: caseId, cover_img_url }),
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
    // 从 localStorage 获取 parentId
    const parentId = typeof window !== 'undefined' ? localStorage.getItem('parentId') : null;
    await fetch("/api/post_comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentText,
        comment_role: "intended_parent",
        post_posts: postId,
        intended_parent_intended_parents: parentId ? Number(parentId) : undefined,
      }),
    });
    setCommentText("");
    setLoading(false);
    fetchComments(postId);
  };

  return (
    <div
      className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-8 py-6 flex flex-col items-center"
      style={{ fontFamily: 'Source Serif 4, serif' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-1">My Journal</h1>
        <p className="mb-6 text-base">Record your experiences and feelings through your journey as a surrogate</p>
        <div className="flex gap-8">
          {/* 左侧日志卡片区 */}
          <div className="flex-1 flex flex-col gap-6">
            {loading ? (
              <div className="text-center py-8">加载中...</div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex gap-4 items-center"
                >
                  <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                    {post.cover_img_url ? (
                      <img src={post.cover_img_url} alt="cover" className="w-full h-full object-cover rounded-md" />
                    ) : null}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="text-lg font-semibold">{post.content?.slice(0, 20) || "This week I felt..."}</div>
                    <div className="text-sm text-[#271F18] opacity-80">{post.content}</div>
                    <button
                      className="mt-2 px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition"
                      onClick={() => {
                        if (activePostId === post.id) {
                          setActivePostId(null);
                        } else {
                          setActivePostId(post.id);
                          fetchComments(post.id);
                        }
                      }}
                    >
                      {activePostId === post.id ? "关闭评论" : "查看评论"}
                    </button>
                    {activePostId === post.id && (
                      <div className="mt-2">
                        <div className="mb-2 text-xs font-bold">评论：</div>
                        <div className="flex flex-col gap-2">
                          {Array.isArray(comments[post.id]) && comments[post.id].length > 0
                            ? comments[post.id].map((c: any) => (
                                <div key={c.id} className="bg-white rounded px-2 py-2 text-xs border border-[#E6E6E6] flex items-center justify-between">
                                  <div>
                                    <span className="font-bold mr-2 text-[#3a2c1e]">{c.comment_role === "surrogate_mother" ? "孕母" : c.comment_role === "intended_parent" ? "我" : c.comment_role}</span>
                                    <span>{c.content}</span>
                                  </div>
                                  <span className="ml-4 text-[11px] text-gray-400 whitespace-nowrap">
                                    {c.created_at ? new Date(c.created_at).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ""}
                                  </span>
                                </div>
                              ))
                            : (Array.isArray(post.post_comments) ? post.post_comments : []).map((c: any) => (
                                <div key={c.id} className="bg-white rounded px-2 py-1 text-xs border border-[#E6E6E6]">
                                  <span className="font-bold mr-2">{c.comment_role === "surrogate_mother" ? "孕母" : c.comment_role === "intended_parent" ? "准父母" : c.comment_role}</span>
                                  {c.content}
                                </div>
                              ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            className="border rounded px-2 py-1 text-xs flex-1"
                            placeholder="写评论..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                          />
                          <button
                            className="px-3 py-1 bg-[#271F18] text-white rounded text-xs"
                            onClick={() => handleComment(post.id)}
                          >发表评论</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[#271F18] opacity-60 self-start">{post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</div>
                </div>
              ))
            )}
          </div>
          {/* 右侧填写区（准父母端隐藏，仅展示动态和评论） */}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
