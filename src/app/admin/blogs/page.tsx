"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AdminLayout } from "@/components/admin-layout"
import { PageHeader, PageContent } from "@/components/ui/page-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@/components/ui/dialog"
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
    console.log('Upload response:', data); // 添加调试信息
    if (data.success) {
      const imageUrl = data.data.url || data.data;
      console.log('Image URL:', imageUrl); // 添加调试信息
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="w-full max-w-none">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-bold mb-4">{form.id ? t('editBlog') : t('addBlog')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('title')}</Label>
              <Input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                required 
                className="w-full"
                placeholder={t('pleaseEnterTitle')}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('author')}</Label>
              <Input 
                name="reference_author" 
                value={form.reference_author} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterAuthor')}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('tags')}</Label>
              <Input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterTags')}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('category')}</Label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                required 
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('pleaseSelectCategory')}</option>
                {categoryOptions.map(opt => (
                  <option key={opt.key} value={opt.value}>{t(opt.key)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('content')}</Label>
            <textarea 
              name="content" 
              value={form.content} 
              onChange={handleChange} 
              required 
              className="w-full p-3 min-h-[120px] max-h-[200px] border rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('pleaseEnterContent')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('coverImage')}</Label>
            
            {/* 如果没有图片，显示上传区域 */}
            {!form.cover_img_url && (
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUpload} 
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="coverImageUpload"
                />
                <div className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="flex-1 text-sm text-gray-600">
                      {uploading ? (
                        <span className="text-blue-600">{t('uploading')}</span>
                      ) : (
                        <span>{i18n.language === 'en' ? 'Please select an image file' : '请选择图片文件'}</span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {i18n.language === 'en' ? 'Choose File' : '选择文件'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 如果有图片，显示图片预览和操作按钮 */}
            {form.cover_img_url && !imageError && (
              <div className="space-y-3">
                <div className="relative">
                  <img 
                    src={form.cover_img_url} 
                    alt="cover" 
                    className="w-full h-auto max-h-48 object-cover rounded-md border bg-white"
                    onError={(e) => {
                      console.error('Image failed to load:', form.cover_img_url);
                      setImageError(true);
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', form.cover_img_url);
                      setImageError(false);
                    }}
                  />
                  {/* 点击覆盖层用于更换图片 */}
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
                
                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUpload} 
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="w-full p-2 text-center text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                      {uploading ? t('uploading') : (i18n.language === 'en' ? 'Change Image' : '更换图片')}
                    </div>
                  </label>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                  >
                    {i18n.language === 'en' ? 'Remove' : '移除'}
                  </button>
                </div>
              </div>
            )}

            {/* 图片加载错误时的显示 */}
            {form.cover_img_url && imageError && (
              <div className="space-y-3">
                <div className="w-full p-4 border-2 border-red-300 rounded-md bg-red-50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-sm text-red-700">
                      {i18n.language === 'en' ? 'Failed to load image. Please try uploading again.' : '图片加载失败，请重新上传。'}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-red-600 font-mono">
                    URL: {form.cover_img_url}
                  </div>
                </div>
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleUpload} 
                      disabled={uploading}
                      className="hidden"
                    />
                    <div className="w-full p-2 text-center text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                      {uploading ? t('uploading') : (i18n.language === 'en' ? 'Upload New Image' : '重新上传图片')}
                    </div>
                  </label>
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                  >
                    {i18n.language === 'en' ? 'Remove' : '移除'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={uploading}
              className="flex-1 sm:flex-none sm:min-w-[100px]"
            >
              {uploading ? t('uploading') : (form.id ? t('save') : t('add'))}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none sm:min-w-[80px]"
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export default function BlogsPage() {
  const { t } = useTranslation("common")
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

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

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader title={t('blogs') || '博客管理'}
          rightContent={
            <Button onClick={handleAdd}>{t('addBlog')}</Button>
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
            <div className="p-8 text-center text-gray-500">{t('loading')}</div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">{t('noBlog')}</div>
          ) : (
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'stretch',
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {blog.cover_img_url ? (
                        <img src={blog.cover_img_url} alt="cover" className="w-12 h-12 object-cover rounded-full" />
                      ) : (
                        <span className="text-sage-400 text-xl font-bold">{blog.title?.[0]?.toUpperCase() || 'B'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-lg text-sage-800 truncate">{blog.title}</div>
                      <div className="text-sage-500 text-sm truncate">{blog.category}</div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full">{t('blog')}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('author')}：</span>
                      <span className="truncate">{blog.reference_author || t('notAvailable')}</span>
                    </div>
                    {blog.tags && (
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-xs text-sage-400">{t('tags')}：</span>
                        <span className="truncate">{blog.tags}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">{t('content')}：</span>
                      <span className="truncate">{blog.content}</span>
                    </div>
                  </div>
                  <hr className="my-3 border-sage-100" />
                  <div className="flex items-center justify-between text-sage-500 text-sm">
                    <span>
                      {t('createdAt')}<br />{blog.created_at ? new Date(blog.created_at).toLocaleString() : "-"}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(blog)}>{t('edit')}</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(blog.id)}>{t('delete')}</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContent>
    </AdminLayout>
  )
}
