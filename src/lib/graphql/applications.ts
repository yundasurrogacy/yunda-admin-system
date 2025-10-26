

import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'
import type { Application, ApplicationStatus } from '@/types/applications'

// 获取单个准父母详情
export async function getIntendedParentById(id: number) {
  const hasuraClient = getHasuraClient()
  const query = `
    query GetIntendedParentById($id: bigint!) {
      intended_parents_by_pk(id: $id) {
        id
        created_at
        updated_at
        email
        password
        basic_information
        contact_information
        family_profile
        program_interests
        referral
      }
    }
  `
  const result = await hasuraClient.execute({
    query,
    variables: { id }
  })
  return result?.intended_parents_by_pk
}

// 获取准父母用户列表
export async function getIntendedParents(limit: number = 10, offset: number = 0) {
  const hasuraClient = getHasuraClient()
  const query = `
    query GetIntendedParents($limit: Int!, $offset: Int!) {
      intended_parents(
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        created_at
        updated_at
        email
        password
        basic_information
        contact_information
        family_profile
        program_interests
        referral
      }
    }
  `
  const result = await hasuraClient.execute({
    query,
    variables: { limit, offset }
  })
  return result?.intended_parents || []
}
// 获取单个代孕母详情
export async function getSurrogateMotherById(id: number) {
  const hasuraClient = getHasuraClient()
  const query = `
    query GetSurrogateMotherById($id: bigint!) {
      surrogate_mothers_by_pk(id: $id) {
        id
        email
        password
        contact_information
        about_you
        pregnancy_and_health
        gestational_surrogacy_interview
        upload_photos
        created_at
        updated_at
      }
    }
  `
  const result = await hasuraClient.execute({
    query,
    variables: { id }
  })
  return result?.surrogate_mothers_by_pk
}
// 获取代孕母用户列表
export async function getSurrogateMothers(
  limit: number = 10,
  offset: number = 0
) {
  const hasuraClient = getHasuraClient()
  const query = `
    query GetSurrogateMothers($limit: Int!, $offset: Int!) {
      surrogate_mothers(
        limit: $limit
        offset: $offset
        order_by: { created_at: desc }
      ) {
        id
        email
        password
        contact_information
        about_you
        pregnancy_and_health
        gestational_surrogacy_interview
        upload_photos
        created_at
        updated_at
      }
    }
  `
  const result = await hasuraClient.execute({
    query,
    variables: { limit, offset }
  })
  return result?.surrogate_mothers || []
}
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

  // 1. 更新申请状态
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

  let userInsertResult = null

  // 2. 如果通过，则插入用户表
  if (status === 'approved') {
    // 获取申请详情
    const application = await getApplicationById(id)
    if (application) {
      const { application_type, application_data } = application
      if (application_type === 'intended_parent') {
        // 按 intended_parents 表结构组装插入对象
        const {
          basic_information,
          contact_information,
          family_profile,
          program_interests,
          referral
        } = application_data || {}
        const email = contact_information?.email_address || null
        const insertData = {
          basic_information,
          contact_information,
          family_profile,
          program_interests,
          referral,
          email,
        }
        const insertMutation = `
          mutation InsertIntendedParent($data: intended_parents_insert_input!) {
            insert_intended_parents_one(object: $data) {
              id
              created_at
            }
          }
        `
        userInsertResult = await hasuraClient.execute({
          query: insertMutation,
          variables: { data: insertData }
        })
      } else if (application_type === 'surrogate_mother') {
        // 按 surrogate_mothers 表结构组装插入对象
        const {
          contact_information,
          about_you,
          pregnancy_and_health,
          gestational_surrogacy_interview,
          upload_photos
        } = application_data || {}
        const email = contact_information?.email_address || null
        const insertData = {
          contact_information,
          about_you,
          pregnancy_and_health,
          gestational_surrogacy_interview,
          upload_photos,
          email,
        }
        const insertMutation = `
          mutation InsertSurrogateMother($data: surrogate_mothers_insert_input!) {
            insert_surrogate_mothers_one(object: $data) {
              id
              created_at
            }
          }
        `
        userInsertResult = await hasuraClient.execute({
          query: insertMutation,
          variables: { data: insertData }
        })
      }
    }
  }

  return {
    updateResult: result?.update_applications_by_pk,
    userInsertResult
  }
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


// 创建新的准父母用户（直接插入 intended_parents 表）
export async function insertIntendedParent(data: {
  basic_information?: any;
  contact_information?: any;
  family_profile?: any;
  program_interests?: any;
  referral?: any;
  email?: string;
}) {
  const hasuraClient = getHasuraClient();
  const mutation = `
    mutation InsertIntendedParent($data: intended_parents_insert_input!) {
      insert_intended_parents_one(object: $data) {
        id
        created_at
      }
    }
  `;
  const result = await hasuraClient.execute({
    query: mutation,
    variables: { data }
  });
  return result?.insert_intended_parents_one;
}

// 创建新的代孕母用户（直接插入 surrogate_mothers 表）
export async function insertSurrogateMother(data: {
  contact_information?: any;
  about_you?: any;
  pregnancy_and_health?: any;
  gestational_surrogacy_interview?: any;
  upload_photos?: any;
  email?: string;
}) {
  const hasuraClient = getHasuraClient();
  const mutation = `
    mutation InsertSurrogateMother($data: surrogate_mothers_insert_input!) {
      insert_surrogate_mothers_one(object: $data) {
        id
        created_at
      }
    }
  `;
  const result = await hasuraClient.execute({
    query: mutation,
    variables: { data }
  });
  return result?.insert_surrogate_mothers_one;
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
