// 用户角色接口
export interface UserRole {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

// 用户接口
export interface User {
  id: number
  user_name: string
  tel: string
  real_name: string
  email?: string
  avatar?: string
  status: number // 1: 正常, 0: 停封
  roles: UserRole[]
  created_at: string
  updated_at: string
}

// 用户列表响应接口
export interface UserListResponse {
  data: User[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}

// 用户搜索参数接口
export interface UserSearchParams {
  page: number
  pageSize: number
  name?: string
  status?: number
  role_id?: number
}

// 分页参数接口
export interface PaginationParams {
  current: number
  size: number
  total: number
}

// 加载状态接口
export interface LoadingState {
  table: boolean
  search: boolean
  add: boolean
  edit: boolean
  delete: boolean
}

// API响应基础接口
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 用户表单接口
export interface UserForm {
  user_name: string
  tel: string
  real_name: string
  email?: string
  password?: string
  status: number
  role_ids: number[]
}

// 用户创建/更新参数
export interface UserCreateParams extends UserForm {}
export interface UserUpdateParams extends Partial<UserForm> {
  id: number
} 