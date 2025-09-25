import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'

// 获取客户经理列表
export async function getClientManagers(limit: number = 20, offset: number = 0) {
  const hasuraClient = getHasuraClient()
  const query = `
    query GetClientManagers($limit: Int!, $offset: Int!) {
      client_managers(
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        email
        password
        created_at
        updated_at
      }
    }
  `
  const result = await hasuraClient.execute({
    query,
    variables: { limit, offset }
  })
  return result?.client_managers || []
}

// 新增客户经理
export async function insertClientManager(data: {
  email: string;
  password: string;
}) {
  const hasuraClient = getHasuraClient()
  const mutation = `
    mutation InsertClientManager($data: client_managers_insert_input!) {
      insert_client_managers_one(object: $data) {
        id
        email
        password
        created_at
      }
    }
  `
  const result = await hasuraClient.execute({
    query: mutation,
    variables: { data }
  })
  return result?.insert_client_managers_one
}
