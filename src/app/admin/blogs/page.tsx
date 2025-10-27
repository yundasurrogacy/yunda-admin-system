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
  
  // 确保所有表单值都是字符串，避免 null 值
  const sanitizeFormValues = (values: any) => {
    if (!values) return {};
    const sanitized: any = {};
    Object.keys(values).forEach(key => {
      sanitized[key] = values[key] === null || values[key] === undefined ? '' : String(values[key]);
    });
    return sanitized;
  };

  const [form, setForm] = useState({
    title: '',
    content: '',
    en_title: '',
    en_content: '',
    category: '',
    cover_img_url: '',
    reference_author: '',
    tags: '',
    route_id: '',
    ...sanitizeFormValues(initialValues),
  });
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('warning');

  // 显示Toast提示
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

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
      route_id: '',
      ...sanitizeFormValues(initialValues),
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
      console.log(t('blogValidation.imageUploadSuccess'));
    } else {
      console.error(t('blogValidation.imageUploadFailed'));
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
    
    // 防止重复提交
    if (submitting) {
      console.log(t('blogValidation.alreadySubmitting'));
      return;
    }
    
    // 验证必填字段
    if (!form.en_title.trim()) {
      showToastMessage(t('blogValidation.englishTitleRequired'), 'warning');
      return;
    }
    
    if (!form.en_content.trim()) {
      showToastMessage(t('blogValidation.englishContentRequired'), 'warning');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await onSubmit(form);
    } catch (error) {
      console.error(t('blogValidation.submitError'), error);
    } finally {
      setSubmitting(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
      {/* 弹窗内容 */}
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl overflow-hidden animate-fadeIn relative z-10 max-h-[98vh] sm:max-h-[95vh] flex flex-col pointer-events-auto transform transition-all duration-300 ease-out hover:shadow-3xl"
        style={modalStyle}
      >
        {/* 固定标题栏 */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-sage-200 bg-gradient-to-r from-sage-50 to-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#C2A87A] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-sage-800 tracking-wide capitalize">{form.id ? t('editBlog') : t('addBlog')}</h2>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
            aria-label={t('close', '关闭')}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 可滚动的表单内容 */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1 bg-gradient-to-b from-white to-sage-25">

          {/* 1. 路由标识 */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-sage-700">{t('routeId')}</Label>
            <Input 
              name="route_id" 
              value={form.route_id} 
              onChange={handleChange} 
              placeholder={t('pleaseEnterRouteId')}
              className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-3 sm:px-4 py-2 sm:py-1 text-sm sm:text-[16px]"
            />
          </div>

          {/* 2. 作者、标签、分类 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-semibold text-sage-700 capitalize">{t('author')}</Label>
              <Input 
                name="reference_author" 
                value={form.reference_author} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterAuthor')}
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px] capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-semibold text-sage-700 capitalize">{t('tags')}</Label>
              <Input 
                name="tags" 
                value={form.tags} 
                onChange={handleChange} 
                placeholder={t('pleaseEnterTags')}
                className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-4 py-1 text-[16px] capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-semibold text-sage-700 capitalize">{t('category')}</Label>
              <select 
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                required 
                className="w-full px-3 sm:px-4 py-2 sm:py-1 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-sm sm:text-[16px] bg-white capitalize cursor-pointer"
              >
                <option value="" className="capitalize cursor-pointer">{t('pleaseSelectCategory')}</option>
                {categoryOptions.map(opt => (
                  <option key={opt.key} value={opt.value} className="capitalize cursor-pointer">{t(opt.key)}</option>
                ))}
              </select>
            </div>
          </div>

          
          {/* 3. 封面图 */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-sage-700 capitalize">{t('coverImage')}</Label>
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
                 <div className="relative w-full rounded-lg overflow-hidden border border-sage-200 bg-gray-50">
                   <img 
                     src={form.cover_img_url} 
                     alt="cover" 
                     className="w-full h-auto object-contain cursor-pointer"
                     style={{ 
                       objectFit: 'contain',
                       maxHeight: '200px'
                     }}
                     onError={() => setImageError(true)}
                     onLoad={() => setImageError(false)}
                     onClick={() => document.getElementById('coverImageUpload')?.click()}
                   />
                   <input 
                     type="file" 
                     accept="image/*" 
                     onChange={handleUpload} 
                     disabled={uploading}
                     id="coverImageUpload"
                     className="hidden"
                   />
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

          {/* 4. 英文标题 */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-sage-700">{t('englishTitle')} <span className="text-red-500">*</span></Label>
            <Input 
              name="en_title" 
              value={form.en_title} 
              onChange={handleChange} 
              required
              className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-3 sm:px-4 py-2 sm:py-1 text-sm sm:text-[16px]"
              placeholder={t('pleaseEnterEnglishTitle')}
            />
          </div>

          {/* 5. 英文内容 */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-sage-700">{t('englishContent')} <span className="text-red-500">*</span></Label>
            <RichTextEditor
              value={form.en_content} 
              onChange={(value) => setForm({ ...form, en_content: value })}
              placeholder={t('pleaseEnterEnglishContent')}
              minHeight="200px"
              className="text-sm sm:text-[16px]"
            />
          </div>

          {/* 6. 中文标题 */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-sage-700">{t('chineseTitle')}</Label>
            <Input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              className="w-full border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 px-3 sm:px-4 py-2 sm:py-1 text-sm sm:text-[16px]"
              placeholder={t('pleaseEnterChineseTitle')}
            />
          </div>


          {/* 7. 中文内容 */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold text-sage-700">{t('chineseContent')}</Label>
            <RichTextEditor
              value={form.content} 
              onChange={(value) => setForm({ ...form, content: value })}
              placeholder={t('pleaseEnterChineseContent')}
              minHeight="200px"
              className="text-sm sm:text-[16px]"
            />
          </div>
          </div>

          {/* 固定底部按钮栏 */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-sage-200 bg-gradient-to-r from-sage-50 to-white flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 sticky bottom-0">
            <CustomButton 
              type="button" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className={`w-full sm:min-w-[120px] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold border rounded-lg transition-all duration-200 capitalize ${
                submitting 
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                  : 'border-sage-300 text-sage-700 hover:bg-sage-100 hover:border-sage-400 cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              {t('cancel')}
            </CustomButton>
            <CustomButton 
              type="submit" 
              disabled={uploading || submitting}
              className={`w-full sm:min-w-[140px] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-200 shadow-lg capitalize ${
                uploading || submitting 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-[#C2A87A] text-white hover:bg-[#a88a5c] cursor-pointer hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('saving')}</span>
                </div>
              ) : uploading ? (
                t('uploading')
              ) : (
                form.id ? t('save') : t('add')
              )}
            </CustomButton>
          </div>
        </form>
      </div>

      {/* Toast 提示组件 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
          <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[300px] max-w-[500px] ${
            toastType === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : toastType === 'error'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              toastType === 'success' 
                ? 'bg-green-100' 
                : toastType === 'error'
                ? 'bg-red-100'
                : 'bg-yellow-100'
            }`}>
              {toastType === 'success' && (
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toastType === 'error' && (
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toastType === 'warning' && (
                <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium flex-1">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors ${
                toastType === 'success' 
                  ? 'hover:bg-green-600' 
                  : toastType === 'error'
                  ? 'hover:bg-red-600'
                  : 'hover:bg-yellow-600'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 分类映射函数
const getCategoryTranslationKey = (category: string): string => {
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
  
  return categoryMap[category] || category;
};

function AdminBlogsPage() {
  const { t, i18n } = useTranslation("common")
  const router = useRouter()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [pageSize] = useState(8); // 固定页面大小，不再动态计算
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toast 通知状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  // 删除确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<{ id: number; title: string } | null>(null);

  // 显示Toast提示
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

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

  // 移除动态页面大小计算，使用固定的服务端分页

  // 获取分类列表
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/blog/categories');
      
      // 检查响应状态
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // 检查响应内容类型
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      // 获取响应文本，检查是否为空
      const text = await res.text();
      if (!text || text.trim() === '') {
        throw new Error('Empty response');
      }
      
      // 解析 JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response');
      }
      
      setAvailableCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setAvailableCategories([]);
    }
  }, []);

  // 使用 useCallback 缓存数据加载函数
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });
      
      if (searchValue.trim()) {
        params.append('search', searchValue.trim());
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      // 使用服务端分页，支持搜索和筛选
      const res = await fetch(`${BLOG_API}?${params.toString()}`);
      
      // 检查响应状态
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // 检查响应内容类型
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      // 获取响应文本，检查是否为空
      const text = await res.text();
      if (!text || text.trim() === '') {
        throw new Error('Empty response');
      }
      
      // 解析 JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response');
      }
      
      console.log('Blog data:', data);
      
      if (data.blogs) {
        setBlogs(data.blogs);
      } else {
        // 兼容旧的API响应格式
        setBlogs(Array.isArray(data) ? data : data.data || []);
      }
      
      // 设置分页信息
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.totalCount || 0);
      } else {
        // 如果没有分页信息，使用默认值
        setTotalPages(1);
        setTotalCount(data.blogs?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // 显示错误提示
      showToastMessage(
        error instanceof Error ? error.message : t('unknownError'),
        'error'
      );
      setBlogs([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchValue, selectedCategory, showToastMessage, t]);

  // 监听分页和筛选条件变化，重新获取数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchValue, selectedCategory, isAuthenticated]);

  // 只加载一次分类列表
  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      fetchCategories();
      setDataLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 翻页时如果超出总页数，自动回到最后一页
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
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

  const handleDeleteClick = useCallback((blog: any) => {
    const displayTitle = i18n.language === 'zh-CN' ? blog.title : (blog.en_title || blog.title);
    setBlogToDelete({ id: blog.id, title: displayTitle });
    setShowDeleteConfirm(true);
  }, [i18n.language]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!blogToDelete) return;
    
    try {
      const res = await fetch(BLOG_API, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blogToDelete.id }),
      });
      
      if (res.ok) {
        showToastMessage(t('blogValidation.blogDeletedSuccess'), 'success');
        fetchBlogs();
      } else {
        showToastMessage(t('blogValidation.blogDeletedFailed'), 'error');
      }
    } catch (error) {
      showToastMessage(t('blogValidation.deleteError'), 'error');
    } finally {
      setShowDeleteConfirm(false);
      setBlogToDelete(null);
    }
  }, [blogToDelete, fetchBlogs, showToastMessage, t]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
    setBlogToDelete(null);
  }, []);

  const handleSubmit = useCallback(async (form: any) => {
    try {
      if (form.id) {
        const res = await fetch(BLOG_API, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showToastMessage(t('blogValidation.blogEditedSuccess'), 'success');
          setAddOpen(false);
          fetchBlogs();
        } else {
          showToastMessage(t('blogValidation.blogEditedFailed'), 'error');
        }
      } else {
        const res = await fetch(BLOG_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showToastMessage(t('blogValidation.blogAddedSuccess'), 'success');
          setAddOpen(false);
          fetchBlogs();
        } else {
          showToastMessage(t('blogValidation.blogAddedFailed'), 'error');
        }
      }
    } catch (error) {
      showToastMessage(t('blogValidation.submitError'), 'error');
    }
  }, [fetchBlogs, showToastMessage, t]);

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

  // 搜索处理函数
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1); // 重置到第一页
  }, []);

  // 分类筛选处理函数
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setPage(1); // 重置到第一页
  }, []);

  // 清除筛选条件
  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    setSelectedCategory('');
    setPage(1);
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
        <PageHeader 
          title={t('blogManagement')}
          showSearch
          onSearch={handleSearch}
          rightContent={
            <CustomButton className="font-medium text-sage-800 cursor-pointer" onClick={handleAdd}>{t('addBlog')}</CustomButton>
          }
        />
        <BlogForm
          open={addOpen}
          onOpenChange={handleOpenChange}
          onSubmit={handleSubmit}
          initialValues={editing}
        />
        
        {/* 分类筛选控件 */}
        <div className="mt-6 bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            {/* 全部分类按钮 */}
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer ${
                selectedCategory === '' ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-sage-600 hover:bg-sage-150"
              }`}
            >
              {t('allCategories')}
            </button>
            
            {/* 动态分类按钮 */}
            {availableCategories.map((category) => {
              const categoryKey = getCategoryTranslationKey(category);
              const displayCategory = t(categoryKey);
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer capitalize ${
                    selectedCategory === category ? "bg-sage-200 text-sage-800" : "bg-sage-100 text-sage-600 hover:bg-sage-150"
                  }`}
                >
                  {displayCategory}
                </button>
              );
            })}
          </div>
          
          {/* 当前筛选条件显示 */}
          {(searchValue || selectedCategory) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-sage-600">{t('currentFilters')}:</span>
              {searchValue && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {t('search')}: "{searchValue}"
                  <button
                    onClick={() => setSearchValue('')}
                    className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {t('category')}: {t(getCategoryTranslationKey(selectedCategory))}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-green-500 hover:text-green-700 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                {t('clearAll')}
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                <div className="text-lg text-sage-700">{t('loading')}</div>
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
                <p className="text-xl text-sage-600 font-medium mb-2">{t('noBlog')}</p>
                <p className="text-sm text-sage-400 mb-6">{t('noBlogDesc')}</p>
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
                {blogs.map((blog) => {
                  // 根据当前语言选择显示的标题和内容
                  const displayTitle = i18n.language === 'zh-CN' ? blog.title : (blog.en_title || blog.title);
                  const displayContent = i18n.language === 'zh-CN' ? blog.content : (blog.en_content || blog.content);
                  
                  // 获取翻译key，如果找不到则直接使用原值
                  const categoryKey = getCategoryTranslationKey(blog.category);
                  const displayCategory = t(categoryKey);
                  
                  
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
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-xs text-sage-400">{t('routeId')}：</span>
                        <span className="truncate font-medium">{blog.route_id || t('notAvailable')}</span>
                      </div>
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
                        <CustomButton className="font-medium cursor-pointer px-3 py-1 text-sm" onClick={() => handleEdit(blog)}>{t('edit')}</CustomButton>
                        <CustomButton className="font-medium cursor-pointer border border-red-300 text-red-700 bg-white hover:bg-red-50 px-3 py-1 text-sm" onClick={() => handleDeleteClick(blog)}>{t('delete')}</CustomButton>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              {/* 分页控件 */}
              <div className="flex flex-col items-center justify-center gap-4 mt-8">
                {/* 总数信息 */}
                {/* <div className="text-sm text-sage-600">
                  {t('pagination.total', '共')} {totalCount} {t('pagination.items', '条记录')}
                </div> */}
                
                {/* 分页控件 */}
                <div className="flex items-center justify-center gap-4">
                  <CustomButton className="border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm cursor-pointer" onClick={handlePrevPage} disabled={page === 1}>{t('pagination.prevPage')}</CustomButton>
                  <span>
                    {t('pagination.page')}
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
                    {t('pagination.of')} {totalPages} {t('pagination.pages')}
                  </span>
                  <CustomButton className="border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 px-3 py-1 text-sm cursor-pointer" onClick={handleNextPage} disabled={page === totalPages}>{t('pagination.nextPage')}</CustomButton>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && blogToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sage-800">{t('confirmDelete')}</h3>
                </div>
              </div>
              <p className="text-sm text-sage-600 mb-2">{t('confirmDeleteDesc')}</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-red-800 truncate">{blogToDelete.title}</p>
              </div>
              <div className="flex gap-3 justify-end">
                <CustomButton 
                  onClick={handleDeleteCancel}
                  className="px-6 py-2 border border-sage-300 text-sage-700 bg-white hover:bg-sage-50 rounded-lg cursor-pointer"
                >
                  {t('cancel')}
                </CustomButton>
                <CustomButton 
                  onClick={handleDeleteConfirm}
                  className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg cursor-pointer"
                >
                  {t('confirmDelete')}
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        {/* Toast 通知组件 */}
        {showToast && (
          <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
            <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[300px] max-w-[500px] ${
              toastType === 'success' 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : toastType === 'error'
                ? 'bg-red-50 border-red-400 text-red-800'
                : 'bg-yellow-50 border-yellow-400 text-yellow-800'
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                toastType === 'success' 
                  ? 'bg-green-100' 
                  : toastType === 'error'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
              }`}>
                {toastType === 'success' && (
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {toastType === 'error' && (
                  <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {toastType === 'warning' && (
                  <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium flex-1">{toastMessage}</span>
              <button
                onClick={() => setShowToast(false)}
                className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors ${
                  toastType === 'success' 
                    ? 'hover:bg-green-600' 
                    : toastType === 'error'
                    ? 'hover:bg-red-600'
                    : 'hover:bg-yellow-600'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </PageContent>
  )
}

export default AdminBlogsPage;