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
  const { t } = useTranslation("common")
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
    if (data.success) {
      setForm({ ...form, cover_img_url: data.data.url || data.data });
      alert('图片上传成功');
    } else {
      alert('图片上传失败');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  const categoryOptions = [
    '代孕妈妈相关',
    '准父母相关',
    '孕达品牌相关',
    '代孕流程相关',
    '法律法规相关',
    '行业动态相关',
    '医学健康相关',
    '教育科普相关',
    '成功案例相关',
    '心理情绪相关',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <h2 className="text-lg font-bold mb-2">{form.id ? '编辑博客' : '新增博客'}</h2>
        <Label>标题<Input name="title" value={form.title} onChange={handleChange} required /></Label>
        <Label>内容<textarea name="content" value={form.content} onChange={handleChange} required className="w-full p-2 min-h-[80px] border rounded" /></Label>
        <Label>作者<Input name="reference_author" value={form.reference_author} onChange={handleChange} placeholder="请输入作者名称" /></Label>
        <Label>标签<Input name="tags" value={form.tags} onChange={handleChange} placeholder="多个标签用|分隔，如：代孕|法律|权益保护" /></Label>
        <Label>分类
          <select name="category" value={form.category} onChange={handleChange} required className="w-full p-2 border rounded">
            <option value="">请选择分类</option>
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </Label>
        <Label>封面图片<input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} /></Label>
        {form.cover_img_url && <img src={form.cover_img_url} alt="cover" style={{ maxWidth: 200, marginTop: 8 }} />}
        <div className="flex gap-2 mt-2">
          <Button type="submit" disabled={uploading}>{form.id ? '保存修改' : '新增'}</Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
        </div>
      </form>
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
    if (!window.confirm('确定要删除吗？')) return;
    await fetch(BLOG_API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    alert('删除成功');
    fetchBlogs();
  };

  const handleSubmit = async (form: any) => {
    if (form.id) {
      await fetch(BLOG_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert('修改成功');
    } else {
      await fetch(BLOG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert('新增成功');
    }
    setAddOpen(false);
    fetchBlogs();
  };

  return (
    <AdminLayout>
      <PageContent>
        <PageHeader title={t('blogs') || '博客管理'}
          rightContent={
            <Button onClick={handleAdd}>新增博客</Button>
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
            <div className="p-8 text-center text-gray-500">加载中...</div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">暂无博客</div>
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
                      <span className="bg-sage-100 text-sage-700 px-3 py-1 text-xs rounded-full">博客</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">作者：</span>
                      <span className="truncate">{blog.reference_author || '未设置'}</span>
                    </div>
                    {blog.tags && (
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-xs text-sage-400">标签：</span>
                        <span className="truncate">{blog.tags}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs text-sage-400">内容：</span>
                      <span className="truncate">{blog.content}</span>
                    </div>
                  </div>
                  <hr className="my-3 border-sage-100" />
                  <div className="flex items-center justify-between text-sage-500 text-sm">
                    <span>
                      创建时间<br />{blog.created_at ? new Date(blog.created_at).toLocaleString() : "-"}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(blog)}>编辑</Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(blog.id)}>删除</Button>
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
