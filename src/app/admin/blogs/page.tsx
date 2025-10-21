"use client"

import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
// import { AdminLayout } from "@/components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/RichTextEditor"
import { useSidebar } from "@/context/sidebar-context"

const BLOG_API = '/api/blog';
const UPLOAD_API = '/api/upload/form';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

function BlogForm({ open, onOpenChange, onSubmit, initialValues }: any) {
  const { t } = useTranslation("common")
  const { sidebarOpen } = useSidebar()
  const [form, setForm] = useState({
    title: '',
    content: '',
    en_title: '',
    en_content: '',
    category: '',
    cover_img_url: '',
    reference_author: '',
    tags: '',
    ...initialValues,
  });
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setForm({
      title: '',
      content: '',
      en_title: '',
      en_content: '',
      category: '',
      cover_img_url: '',
      reference_author: '',
      tags: '',
      ...initialValues,
    })
  }, [initialValues, open])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(UPLOAD_API, {
      method: 'POST',
      body: fd,
    });
    const data = await res.json();
    // console.log('Upload response:', data); // 添加调试信息
    if (data.success) {
      const imageUrl = data.data.url || data.data;
      // console.log('Image URL:', imageUrl); // 添加调试信息
      setForm({ ...form, cover_img_url: imageUrl });
      setImageError(false); // 重置错误状态
      console.log('Image uploaded successfully');
    } else {
      console.error('Image upload failed');
    }
    setUploading(false);
    // 清空file input的值，以便能重新选择同一个文件
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setForm({ ...form, cover_img_url: '' });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  const categoryOptions = [
    { key: 'categoryRelatedToSurrogate', value: '代孕妈妈相关' },
    { key: 'categoryRelatedToParents', value: '准父母相关' },
    { key: 'categoryRelatedToBrand', value: '孕达品牌相关' },
    { key: 'categoryRelatedToProcess', value: '代孕流程相关' },
    { key: 'categoryRelatedToLaw', value: '法律法规相关' },
    { key: 'categoryRelatedToIndustry', value: '行业动态相关' },
    { key: 'categoryRelatedToMedical', value: '医学健康相关' },
    { key: 'categoryRelatedToEducation', value: '教育科普相关' },
    { key: 'categoryRelatedToSuccess', value: '成功案例相关' },
    { key: 'categoryRelatedToPsychology', value: '心理情绪相关' },
  ];

  if (!open) return null;
  
  // 根据侧边栏状态计算弹窗的居中位置
  // 侧边栏宽度：展开240px，收起80px
  // 内容区域宽度 = 总宽度 - 侧边栏宽度
  // 居中偏移 = 侧边栏宽度 / 2
  const sidebarWidth = sidebarOpen ? 240 : 80;
  const centerOffset = sidebarWidth / 2;
  
  const modalStyle = {
    transform: `translateX(${centerOffset}px)`,
    transition: 'transform 0.3s ease-in-out'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {/* 弹窗内容 */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fadeIn relative z-10 max-h-[90vh] flex flex-col pointer-events-auto"
        style={modalStyle}
      >
        {/* 固定标题栏 */}
        <div className="px-6 py-4 border-b border-sage-200 bg-white flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-sage-800 tracking-wide capitalize">{form.id ? t('editBlog') : t('addBlog')}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label={t('close', '关闭')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 可滚动的表单内容 */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">

          <div className="space-y-2">
            <Label className="text-base font-semibold text-sage-700">{t('chineseTitle', { defaultValue: '中文标题' })}</Label>
            <Input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              required 
              className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px]"
              placeholder={t('pleaseEnterChineseTitle', '请输入中文标题')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-sage-700">{t('englishTitle', { defaultValue: '英文标题' })}</Label>
            <Input 
              name="en_title" 
              value={form.en_title} 
              onChange={handleChange} 
              className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px]"
              placeholder={t('pleaseEnterEnglishTitle', 'Please enter English title')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700 capitalize">{t('author')}</Label>
              <Input 
                name="reference_author" 
                value={form.reference_author} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterAuthor')}
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px] capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700 capitalize">{t('tags')}</Label>
              <Input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterTags')}
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px] capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700 capitalize">{t('category')}</Label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-1 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-[16px] bg-white capitalize cursor-pointer"
              >
                <option value="" className="capitalize cursor-pointer">{t('pleaseSelectCategory')}</option>
                {categoryOptions.map(opt => (
                  <option key={opt.key} value={opt.value} className="capitalize cursor-pointer">{t(opt.key)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-sage-700">{t('chineseContent', { defaultValue: '中文内容' })}</Label>
            <RichTextEditor
              value={form.content} 
              onChange={(value) => setForm({ ...form, content: value })}
              placeholder={t('pleaseEnterChineseContent', '请输入中文内容')}
              minHeight="200px"
              className="text-[16px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-sage-700">{t('englishContent', { defaultValue: '英文内容' })}</Label>
            <RichTextEditor
              value={form.en_content} 
              onChange={(value) => setForm({ ...form, en_content: value })}
              placeholder={t('pleaseEnterEnglishContent', 'Please enter English content')}
              minHeight="200px"
              className="text-[16px]"
            />
          </div>

            <div className="space-y-2">
            <Label className="text-base font-semibold text-sage-700 capitalize">{t('coverImage')}</Label>
            {/* 没有图片时的上传区块 */}
            {!form.cover_img_url && (
              <div className="relative w-full h-24 flex items-center justify-center border-2 border-dashed border-sage-300 rounded-lg bg-sage-50 hover:border-sage-400 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload} 
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="coverImageUpload"
                />
                <div className="flex flex-col items-center gap-2 z-10">
                  <svg className="w-8 h-8 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 1 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sage-500 text-sm capitalize">{uploading ? t('uploading') : t('pleaseSelectImageFile')}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-sage-100 text-sage-700 mt-1 capitalize">
                    {t('chooseFile')}
                  </span>
                </div>
              </div>
            )}
            {/* 有图片时的预览和操作区块 */}
            {form.cover_img_url && !imageError && (
              <div className="space-y-1">
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-sage-200 bg-white flex items-center justify-center">
                  <img 
                    src={form.cover_img_url} 
                    alt="cover" 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                  <div className="absolute inset-0 bg-transparent cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUpload} 
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUpload} 
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="px-4 py-2 text-center text-sm bg-sage-50 text-sage-700 border border-sage-200 rounded-md hover:bg-sage-100 transition-colors capitalize">
                      {uploading ? t('uploading') : t('changeImage')}
                    </div>
                  </label>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer capitalize"
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>
            )}
            {/* 图片加载错误时的显示 */}
            {form.cover_img_url && imageError && (
              <div className="space-y-1">
                <div className="w-full p-4 border-2 border-red-300 rounded-lg bg-red-50">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-700 capitalize">{t('imageLoadFailed')}</span>
                  </div>
                  <div className="mt-2 text-xs text-red-600 font-mono">URL: {form.cover_img_url}</div>
                </div>
                <div className="flex gap-2 justify-end">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUpload} 
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="px-4 py-2 text-center text-sm bg-sage-50 text-sage-700 border border-sage-200 rounded-md hover:bg-sage-100 transition-colors capitalize">
                      {uploading ? t('uploading') : t('uploadNewImage')}
                    </div>
                  </label>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer capitalize"
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* 固定底部按钮栏 */}
          <div className="px-6 py-4 border-t border-sage-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
            <CustomButton 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="min-w-[100px] px-6 py-2 text-base font-semibold border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-100 transition-colors cursor-pointer capitalize"
            >
              {t('cancel')}
            </CustomButton>
            <CustomButton 
              type="submit" 
              disabled={uploading}
              className="min-w-[120px] px-6 py-2 text-base font-semibold bg-[#C2A87A] text-white rounded-lg hover:bg-[#a88a5c] transition-colors shadow cursor-pointer capitalize"
            >
              {uploading ? t('uploading') : (form.id ? t('save') : t('add'))}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminBlogsPage() {
  const { t, i18n } = useTranslation("common")
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [pageSize, setPageSize] = useState(8);
  const containerRef = useRef<HTMLDivElement>(null);

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router])

  // page变化时同步pageInput
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // 自适应每页条数
  useEffect(() => {
    function calcPageSize() {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const cardWidth = 340 + 32;
      const columns = Math.max(1, Math.floor(width / cardWidth));
      setPageSize(columns * 2); // 2 行
    }
    calcPageSize();
    window.addEventListener('resize', calcPageSize);
    return () => window.removeEventListener('resize', calcPageSize);
  }, []);

  // 使用 useCallback 缓存数据加载函数
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    // 请求所有博客数据，不使用服务端分页（设置一个很大的 limit）
    const res = await fetch(`${BLOG_API}?limit=1000`);
    const data = await res.json();
    console.log(data)
    setBlogs(data.blogs || []);
    setLoading(false);
  }, []);

  // 只在认证后才加载数据
  useEffect(() => {
    if (isAuthenticated) {
    fetchBlogs();
    }
  }, [isAuthenticated, fetchBlogs]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存分页数据
  const { totalPages, pagedBlogs } = useMemo(() => {
    const pages = Math.max(1, Math.ceil(blogs.length / pageSize));
    const paged = blogs.slice((page - 1) * pageSize, page * pageSize);
    return { totalPages: pages, pagedBlogs: paged };
  }, [blogs, page, pageSize]);

  // 翻页时如果超出总页数，自动回到最后一页
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // 使用 useCallback 缓存事件处理函数
  const handleAdd = useCallback(() => {
    setEditing(null);
    setAddOpen(true);
  }, []);

  const handleEdit = useCallback((blog: any) => {
    setEditing(blog);
    setAddOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    // 直接删除，不使用浏览器确认弹窗
    await fetch(BLOG_API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    console.log('Blog deleted successfully');
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSubmit = useCallback(async (form: any) => {
    if (form.id) {
      await fetch(BLOG_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      console.log('Blog edited successfully');
    } else {
      await fetch(BLOG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      console.log('Blog added successfully');
    }
    setAddOpen(false);
    fetchBlogs();
  }, [fetchBlogs]);

  const handlePrevPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPageInput(val);
  }, []);

  const handlePageInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val && !isNaN(Number(val))) {
      const num = Number(val);
      if (num >= 1 && num <= totalPages) {
        setPage(num);
      } else {
        setPageInput(String(page));
      }
    } else {
      setPageInput(String(page));
    }
  }, [page, totalPages]);

  const handlePageInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
      if (val && !isNaN(Number(val))) {
        const num = Number(val);
        if (num >= 1 && num <= totalPages) {
          setPage(num);
        } else {
          setPageInput(String(page));
        }
      } else {
        setPageInput(String(page));
      }
    }
  }, [page, totalPages]);

  const handleOpenChange = useCallback((open: boolean) => {
    setAddOpen(open);
  }, []);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <PageContent>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </PageContent>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (
      <PageContent>
        <PageHeader title={t('blogManagement', { defaultValue: '博客管理' })}
          rightContent={
            <CustomButton className="font-medium text-sage-800 cursor-pointer" onClick={handleAdd}>{t('addBlog', { defaultValue: '添加博客' })}</CustomButton>
          }
        />
        <BlogForm
          open={addOpen}
          onOpenChange={handleOpenChange}
          onSubmit={handleSubmit}
          initialValues={editing}
        />
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="text-sage-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-xl text-sage-600 font-medium mb-2">{t('noBlog', { defaultValue: '暂无博客' })}</p>
                <p className="text-sm text-sage-400 mb-6">{t('noBlogDesc', { defaultValue: '还没有创建任何博客，点击上方按钮开始创建' })}</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className="grid w-full"
                ref={containerRef}
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '32px',
                  alignItems: 'stretch',
                }}
              >
                {pagedBlogs.map((blog) => {
                  // 根据当前语言选择显示的标题和内容
                  const displayTitle = i18n.language === 'zh-CN' ? blog.title : (blog.en_title || blog.title);
                  const displayContent = i18n.language === 'zh-CN' ? blog.content : (blog.en_content || blog.content);
                  
                  // 创建分类中文到翻译key的映射
                  const categoryMap: Record<string, string> = {
                    '代孕妈妈相关': 'categoryRelatedToSurrogate',
                    '准父母相关': 'categoryRelatedToParents',
                    '孕达品牌相关': 'categoryRelatedToBrand',
                    '代孕流程相关': 'categoryRelatedToProcess',
                    '法律法规相关': 'categoryRelatedToLaw',
                    '行业动态相关': 'categoryRelatedToIndustry',
                    '医学健康相关': 'categoryRelatedToMedical',
                    '教育科普相关': 'categoryRelatedToEducation',
                    '成功案例相关': 'categoryRelatedToSuccess',
                    '心理情绪相关': 'categoryRelatedToPsychology',
                  };
                  
                  // 获取翻译key，如果找不到则直接使用原值
                  const categoryKey = categoryMap[blog.category] || blog.category;
                  const displayCategory = t(categoryKey, { defaultValue: blog.category });
                  
                  return (
                  <div
                    key={blog.id}
                    className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {blog.cover_img_url ? (
                          <img src={blog.cover_img_url} alt="cover" className="w-12 h-12 object-cover rounded-full" />
                        ) : (
                          <span className="text-sage-400 text-xl font-semibold">{displayTitle?.[0]?.toUpperCase() || 'B'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-sage-800 truncate" title={displayTitle}>{displayTitle}</div>
                        <div className="text-sage-500 text-sm truncate font-medium">{displayCategory}</div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {blog.en_title && blog.en_content && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-full font-medium">{t('bilingual', { defaultValue: '双语' })}</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-sage-700 text-[15px] font-medium">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-xs text-sage-400">{t('author')}：</span>
                        <span className="truncate font-medium">{blog.reference_author || t('notAvailable')}</span>
                      </div>
                      {blog.tags && (
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-xs text-sage-400">{t('tags')}：</span>
                          <span className="truncate font-medium">{blog.tags}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-sage-400 flex-shrink-0">{t('content')}：</span>
                        <div 
                          className="flex-1 font-medium line-clamp-2 overflow-hidden text-ellipsis"
                          dangerouslySetInnerHTML={{ __html: displayContent || '' }}
                          style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        />
                      </div>
                    </div>
                    <hr className="my-3 border-sage-100" />
                    <div className="flex items-center justify-between text-sage-500 text-sm font-medium">
                      <span>
                        {t('createdAt')}<br />{blog.created_at ? new Date(blog.created_at).toLocaleString() : "-"}
                      </span>
                      <div className="flex gap-2">
                        <CustomButton className="font-medium cursor-pointer px-3 py-1 text-sm" onClick={() => handleEdit(blog)}>{t('edit', { defaultValue: '编辑' })}</CustomButton>
                        <CustomButton className="font-medium cursor-pointer border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm" onClick={() => handleDelete(blog.id)}>{t('delete', { defaultValue: '删除' })}</CustomButton>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              {/* 分页控件 */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <CustomButton className="border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm cursor-pointer" onClick={handlePrevPage} disabled={page === 1}>{t('pagination.prevPage', '上一页')}</CustomButton>
                <span>
                  {t('pagination.page', '第')}
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputBlur}
                    onKeyDown={handlePageInputKeyDown}
                    className="w-12 border rounded text-center mx-1"
                    style={{height: 28}}
                  />
                  {t('pagination.of', '共')} {totalPages} {t('pagination.pages', '页')}
                </span>
                <CustomButton className="border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm cursor-pointer" onClick={handleNextPage} disabled={page === totalPages}>{t('pagination.nextPage', '下一页')}</CustomButton>
              </div>
            </>
          )}
        </div>
      </PageContent>
  )
}

export default AdminBlogsPage;