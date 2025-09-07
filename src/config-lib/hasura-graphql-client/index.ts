import { GraphQLClient } from 'graphql-request';

// 客户端配置类型
interface HasuraClientConfig {
  endpoint: string;
  adminSecret?: string;
  token?: string;
}

// 查询参数类型
interface QueryArgs {
  where?: any;
  order_by?: any;
  limit?: number;
  offset?: number;
}

// 数据查询选项类型
interface DatasOptions<T> {
  table: string;
  args?: QueryArgs;
  datas_fields: (keyof T)[];
}

// GraphQL客户端单例
let client: GraphQLClient | null = null;

// 初始化Hasura客户端
export function initializeHasuraClient(config: HasuraClientConfig) {
  const headers: Record<string, string> = {};
  
  if (config.adminSecret) {
    headers['x-hasura-admin-secret'] = config.adminSecret;
  }
  
  if (config.token) {
    headers['Authorization'] = `Bearer ${config.token}`;
  }

  client = new GraphQLClient(config.endpoint, {
    headers,
  });
}

// 获取Hasura客户端实例
export function getHasuraClient() {
  if (!client) {
    // 如果客户端未初始化，使用默认配置初始化
    initializeHasuraClient({
      endpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_API || 'http://localhost:8080/v1/graphql',
      adminSecret: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    });
  }
  return {
    // 通用查询数据方法
    async datas<T>({ table, args = {}, datas_fields }: DatasOptions<T>): Promise<T[]> {
      const fields = datas_fields.join('\n');
      const query = `
        query get_${table}(
          $where: ${table}_bool_exp,
          $order_by: ${table}_order_by,
          $limit: Int,
          $offset: Int
        ) {
          ${table}(
            where: $where,
            order_by: $order_by,
            limit: $limit,
            offset: $offset
          ) {
            ${fields}
          }
        }
      `;

      try {
  const response = await client!.request<any>(query, args);
  return response[table];
      } catch (error) {
        console.error('Hasura query error:', error);
        throw error;
      }
    },

    // 其他方法可以根据需要添加...
  };
}
