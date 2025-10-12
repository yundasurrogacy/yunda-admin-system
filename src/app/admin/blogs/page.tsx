"use client"

import { useEffect, useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import { AdminLayout } from "@/components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { CustomButton } from "@/components/ui/CustomButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const BLOG_API = '/api/blog';
const UPLOAD_API = '/api/upload/form';

function BlogForm({ open, onOpenChange, onSubmit, initialValues }: any) {
  const { t, i18n } = useTranslation("common")
  const [form, setForm] = useState({
    title: '',
    content: '',
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
      alert(t('uploadSuccess'));
    } else {
      alert(t('uploadFailed'));
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-0 overflow-hidden animate-fadeIn">
        <form onSubmit={handleSubmit} className="p-4 space-y-2">
          <h2 className="text-2xl font-bold text-sage-800 text-center mb-2 tracking-wide">{form.id ? t('editBlog') : t('addBlog')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700">{t('title')}</Label>
              <Input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                required 
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px]"
                placeholder={t('pleaseEnterTitle')}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700">{t('author')}</Label>
              <Input 
                name="reference_author" 
                value={form.reference_author} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterAuthor')}
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700">{t('tags')}</Label>
              <Input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterTags')}
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold text-sage-700">{t('category')}</Label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-1 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-[16px] bg-white"
              >
                <option value="">{t('pleaseSelectCategory')}</option>
                {categoryOptions.map(opt => (
                  <option key={opt.key} value={opt.value}>{t(opt.key)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-base font-semibold text-sage-700">{t('content')}</Label>
            <textarea 
              name="content" 
              value={form.content} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 min-h-[80px] max-h-[160px] border border-sage-300 rounded-lg resize-y focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-[16px]"
              placeholder={t('pleaseEnterContent')}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-base font-semibold text-sage-700">{t('coverImage')}</Label>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sage-500 text-sm">{uploading ? t('uploading') : (i18n.language === 'en' ? 'Please select an image file' : '请选择图片文件')}</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-sage-100 text-sage-700 mt-1">
                    {i18n.language === 'en' ? 'Choose File' : '选择文件'}
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
                    <div className="px-4 py-2 text-center text-sm bg-sage-50 text-sage-700 border border-sage-200 rounded-md hover:bg-sage-100 transition-colors">
                      {uploading ? t('uploading') : (i18n.language === 'en' ? 'Change Image' : '更换图片')}
                    </div>
                  </label>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    {i18n.language === 'en' ? 'Remove' : '移除'}
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
                    <span className="text-sm text-red-700">{i18n.language === 'en' ? 'Failed to load image. Please try uploading again.' : '图片加载失败，请重新上传。'}</span>
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
                    <div className="px-4 py-2 text-center text-sm bg-sage-50 text-sage-700 border border-sage-200 rounded-md hover:bg-sage-100 transition-colors">
                      {uploading ? t('uploading') : (i18n.language === 'en' ? 'Upload New Image' : '重新上传图片')}
                    </div>
                  </label>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    {i18n.language === 'en' ? 'Remove' : '移除'}
                  </button>
                </div>
              </div>
            )}
          </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-sage-100 mt-2">
            <CustomButton 
              type="submit" 
              disabled={uploading}
              className="min-w-[120px] px-6 py-2 text-base font-semibold bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors shadow cursor-pointer"
            >
              {uploading ? t('uploading') : (form.id ? t('save') : t('add'))}
            </CustomButton>
            <CustomButton 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="min-w-[100px] px-6 py-2 text-base font-semibold border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminBlogsPage() {
  const { t } = useTranslation("common")
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [pageSize, setPageSize] = useState(8);
  // page变化时同步pageInput
  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // 校验输入页码有效性
  const validatePageInput = (val: string) => {
    if (!val) return false;
    const num = Number(val);
    if (isNaN(num) || num < 1 || num > totalPages) return false;
    return true;
  };
  const containerRef = useRef<HTMLDivElement>(null);

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

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch(BLOG_API);
    const data = await res.json();
    setBlogs(data.blogs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setAddOpen(true);
  };

  const handleEdit = (blog: any) => {
    setEditing(blog);
    setAddOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('confirmDelete'))) return;
    await fetch(BLOG_API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    alert(t('deleteSuccess'));
    fetchBlogs();
  };

  const handleSubmit = async (form: any) => {
    if (form.id) {
      await fetch(BLOG_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert(t('editSuccess'));
    } else {
      await fetch(BLOG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert(t('addSuccess'));
    }
    setAddOpen(false);
    fetchBlogs();
  };

  // 分页相关
  const totalPages = Math.max(1, Math.ceil(blogs.length / pageSize));
  const pagedBlogs = blogs.slice((page - 1) * pageSize, page * pageSize);

  // 翻页时如果超出总页数，自动回到最后一页
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader title={t('Blog Management') || '博客管理'}
          rightContent={
            <CustomButton className="font-medium text-sage-800 cursor-pointer" onClick={handleAdd}>{t('Add Blog')}</CustomButton>
          }
        />
        <BlogForm
          open={addOpen}
          onOpenChange={setAddOpen}
          onSubmit={handleSubmit}
          initialValues={editing}
        />
        <div className="mt-8">
          {loading ? (
            <div className="p-8 text-center text-gray-500 font-medium">{t('loading')}</div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">{t('noBlog')}</div>
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
                {pagedBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {blog.cover_img_url ? (
                          <img src={blog.cover_img_url} alt="cover" className="w-12 h-12 object-cover rounded-full" />
                        ) : (
                          <span className="text-sage-400 text-xl font-semibold">{blog.title?.[0]?.toUpperCase() || 'B'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-sage-800 truncate">{blog.title}</div>
                        <div className="text-sage-500 text-sm truncate font-medium">{blog.category}</div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {/* <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full font-medium">{t('blog')}</span> */}
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
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-xs text-sage-400">{t('content')}：</span>
                        <span className="truncate font-medium">{blog.content}</span>
                      </div>
                    </div>
                    <hr className="my-3 border-sage-100" />
                    <div className="flex items-center justify-between text-sage-500 text-sm font-medium">
                      <span>
                        {t('createdAt')}<br />{blog.created_at ? new Date(blog.created_at).toLocaleString() : "-"}
                      </span>
                      <div className="flex gap-2">
                        <CustomButton className="font-medium cursor-pointer px-3 py-1 text-sm" onClick={() => handleEdit(blog)}>{t('edit')}</CustomButton>
                        <CustomButton className="font-medium cursor-pointer border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm" onClick={() => handleDelete(blog.id)}>{t('Delete')}</CustomButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 分页控件 */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <CustomButton className="border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm cursor-pointer" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>{t('pagination.prevPage', '上一页')}</CustomButton>
                <span>
                  {t('pagination.page', '第')}
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pageInput}
                    onChange={e => {
                      // 只允许数字
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setPageInput(val);
                    }}
                    onBlur={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      if (validatePageInput(val)) {
                        setPage(Number(val));
                      } else {
                        setPageInput(String(page));
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
                        if (validatePageInput(val)) {
                          setPage(Number(val));
                        } else {
                          setPageInput(String(page));
                        }
                      }
                    }}
                    className="w-12 border rounded text-center mx-1"
                    style={{height: 28}}
                  />
                  {t('pagination.of', '共')} {totalPages} {t('pagination.pages', '页')}
                </span>
                <CustomButton className="border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm cursor-pointer" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{t('pagination.nextPage', '下一页')}</CustomButton>
              </div>
            </>
          )}
        </div>
      </PageContent>
    </AdminLayout>
  )
}

export default AdminBlogsPage;