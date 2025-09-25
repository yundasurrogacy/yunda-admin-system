"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// ...existing code...
interface SurrogateMother {
  id: string;
  email: string;
  name: string;
}

interface IntendedParent {
  id: string;
  email: string;
  name: string;
}

interface CaseFile {
  id: string;
  file_url: string;
  category: string;
  created_at: string;
}

interface IvfClinic {
  id: string;
  type: string;
  created_at: string;
  name: string;
}

interface CaseItem {
  id: string;
  process_status?: string;
  trust_account_balance: number;
  surrogate_mother?: SurrogateMother;
  intended_parent?: IntendedParent;
  cases_files?: CaseFile[];
  ivf_clinics?: IvfClinic[];
}

export default function MyCasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parentId = typeof window !== "undefined" ? localStorage.getItem("parentId") : null;
    if (!parentId) {
      setError("未找到用户ID，请重新登录。");
      setLoading(false);
      return;
    }
  fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("获取案子失败");
        const data = await res.json();
        // 打印接口返回原始数据，方便调试
        console.log('接口返回数据:', data);
        // const casesRaw = data.cases || data.data || [];
        const casesRaw = data;
        console.log('格式化后的数据:', casesRaw);
        // 格式化数据
        setCases(
          casesRaw.map((item: any) => ({
            id: item.id,
            process_status: item.process_status,
            trust_account_balance: item.trust_account_balance,
            surrogate_mother: item.surrogate_mother
              ? {
                  id: item.surrogate_mother.id,
                  email: item.surrogate_mother.email,
                  name: item.surrogate_mother.contact_information?.name || item.surrogate_mother.contact_information || '',
                }
              : undefined,
            intended_parent: item.intended_parent
              ? {
                  id: item.intended_parent.id,
                  email: item.intended_parent.email,
                  name: item.intended_parent.basic_information?.name || item.intended_parent.basic_information || '',
                }
              : undefined,
            cases_files: item.cases_files?.map((f: any) => ({
              id: f.id,
              file_url: f.file_url,
              category: f.category,
              created_at: f.created_at,
            })) || [],
            ivf_clinics: item.ivf_clinics?.map((c: any) => ({
              id: c.id,
              type: c.type,
              created_at: c.created_at,
              name: c.data?.name || c.data || '',
            })) || [],
          }))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">我的案子</h1>
      <div
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px',
          alignItems: 'stretch',
        }}
      >
        {cases.length === 0 ? (
          <div className="text-center py-8 col-span-full text-gray-500">暂无案子</div>
        ) : (
          cases.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-sage-200 rounded-xl shadow-sm p-6 flex flex-col justify-between w-full min-w-0 transition hover:shadow-md overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sage-400 text-xl font-bold">{String(item.id).slice(-2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-sage-800 truncate">案件ID：{item.id}</div>
                  <div className="text-sage-500 text-sm truncate">状态：{item.process_status || '-'}</div>
                </div>
              </div>
              <div className="mt-2 space-y-1 text-sage-700 text-[15px]">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs text-sage-400">信托余额：</span>
                  <span>{item.trust_account_balance ?? '-'}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs text-sage-400">准父母：</span>
                  {item.intended_parent ? (
                    <span>{item.intended_parent.name} <span className="text-xs text-sage-400">({item.intended_parent.email})</span></span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs text-sage-400">代孕妈妈：</span>
                  {item.surrogate_mother ? (
                    <Link href={`/surrogacy/profile?id=${item.surrogate_mother.id}`} className="text-blue-600 underline">{item.surrogate_mother.name}</Link>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs text-sage-400">文件：</span>
                  {item.cases_files && item.cases_files.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {item.cases_files.map((f) => (
                        <li key={f.id}>
                          <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{f.category}</a>
                          <span className="ml-2 text-xs text-gray-500">{new Date(f.created_at).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-xs text-sage-400">诊所：</span>
                  {item.ivf_clinics && item.ivf_clinics.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {item.ivf_clinics.map((c) => (
                        <li key={c.id}>
                          {c.name}（{c.type}）<span className="ml-2 text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
              </div>
              <hr className="my-3 border-sage-100" />
              <div className="flex flex-wrap gap-2 text-sm">
                <Link href={`/surrogacy/journal?caseId=${item.id}`} className="text-blue-600 underline">孕母动态</Link>
                <Link href={`/surrogacy/journey?caseId=${item.id}`} className="text-blue-600 underline">JOURNEY</Link>
                <Link href={`/client/ivf-clinic?caseId=${item.id}`} className="text-blue-600 underline">ivf clinic</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
