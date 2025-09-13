import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import type { Application, ApplicationStatus } from '@/types/applications'

// 获取意向父母申请列表
export async function getParentsApplications(
  limit: number = 10,
  offset: number = 0,
  status?: ApplicationStatus
) {
  const hasuraClient = getHasuraClient()
  
  const query = `
    query GetParentsApplications($limit: Int!, $offset: Int!, $status: String) {
      applications(
        where: {
          application_type: { _eq: "intended_parent" }
          ${status ? `status: { _eq: $status }` : ''}
        }
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        application_type
        status
        application_data
        created_at
        updated_at
      }
    }
  `

  const result = await hasuraClient.execute({
    query,
    variables: { limit, offset, status }
  })

  return result?.applications || []
}

// 获取代孕者申请列表
export async function getSurrogatesApplications(
  limit: number = 10,
  offset: number = 0,
  status?: ApplicationStatus
) {
  const hasuraClient = getHasuraClient()
  
  const query = `
    query GetSurrogatesApplications($limit: Int!, $offset: Int!, $status: String) {
      applications(
        where: {
          application_type: { _eq: "surrogate_mother" }
          ${status ? `status: { _eq: $status }` : ''}
        }
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        application_type
        status
        application_data
        created_at
        updated_at
      }
    }
  `

  const result = await hasuraClient.execute({
    query,
    variables: { limit, offset, status }
  })

  return result?.applications || []
}

// 更新申请状态
export async function updateApplicationStatus(
  id: number,
  status: ApplicationStatus
) {
  const hasuraClient = getHasuraClient()
  
  const mutation = `
    mutation UpdateApplicationStatus($id: bigint!, $status: String!) {
      update_applications_by_pk(
        pk_columns: { id: $id }
        _set: { status: $status, updated_at: "now()" }
      ) {
        id
        status
        updated_at
      }
    }
  `

  const result = await hasuraClient.execute({
    query: mutation,
    variables: { id, status }
  })

  return result?.update_applications_by_pk
}

// 获取申请详情
export async function getApplicationById(id: number) {
  const hasuraClient = getHasuraClient()
  
  const query = `
    query GetApplicationById($id: bigint!) {
      applications_by_pk(id: $id) {
        id
        application_type
        status
        application_data
        created_at
        updated_at
      }
    }
  `

  const result = await hasuraClient.execute({
    query,
    variables: { id }
  })

  return result?.applications_by_pk
}

// 搜索申请
export async function searchApplications(
  applicationType: 'intended_parent' | 'surrogate_mother',
  searchTerm: string,
  status?: ApplicationStatus,
  limit: number = 10,
  offset: number = 0
) {
  const hasuraClient = getHasuraClient()
  
  const query = `
    query SearchApplications(
      $applicationType: String!
      $searchTerm: String!
      $status: String
      $limit: Int!
      $offset: Int!
    ) {
      applications(
        where: {
          application_type: { _eq: $applicationType }
          ${status ? `status: { _eq: $status }` : ''}
          _or: [
            { application_data: { _ilike: $searchTerm } }
          ]
        }
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        application_type
        status
        application_data
        created_at
        updated_at
      }
    }
  `

  const result = await hasuraClient.execute({
    query,
    variables: { 
      applicationType, 
      searchTerm: `%${searchTerm}%`, 
      status, 
      limit, 
      offset 
    }
  })

  return result?.applications || []
}
