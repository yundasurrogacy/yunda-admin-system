// 申请表相关类型定义
// 基于 GraphQL schema 中的 applications 表结构

import type { IntendedParentApplicationData } from './intended_parent'
import type { SurrogateMotherApplicationData } from './surrogate_mother'

// 申请表完整记录（对应 applications 表）
export interface Application {
  id: number
  created_at: string
  updated_at: string
  application_type: ApplicationType
  status: ApplicationStatus
  application_data: ApplicationData
}

// 申请类型枚举
export type ApplicationType = 'intended_parent' | 'surrogate_mother'

// 申请状态枚举
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

// 申请数据联合类型
export type ApplicationData = IntendedParentApplicationData | SurrogateMotherApplicationData

// 申请表创建输入
export interface CreateApplicationInput {
  application_type: ApplicationType
  application_data: ApplicationData
  status?: ApplicationStatus
}