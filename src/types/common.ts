// 基础API响应接口
export interface BaseResponse<T = any> {
  code: number
  msg: string
  data: T
  timestamp?: number
}

// 分页数据接口
export interface PageData<T = any> {
  data: T[]
  total: number
  per_page: number
  current_page: number
  last_page: number
  from: number
  to: number
}

// 分页请求参数
export interface PageParams {
  page: number
  pageSize: number
}

// 选项接口
export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

// 树形数据接口
export interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  disabled?: boolean
  [key: string]: any
}

// 表格列配置
export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | string
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any) => string
}

// 路由元信息
export interface RouteMeta {
  title: string
  icon?: string
  roles?: string[]
  keepAlive?: boolean
  hidden?: boolean
  activeMenu?: string
  breadcrumb?: boolean
}

// 菜单项接口
export interface MenuItem {
  id: string | number
  name: string
  path: string
  component?: string
  redirect?: string
  meta: RouteMeta
  children?: MenuItem[]
}

// 用户权限接口
export interface Permission {
  id: number
  name: string
  slug: string
  guard_name: string
  created_at: string
  updated_at: string
}

// 上传文件响应
export interface UploadResponse {
  url: string
  name: string
  size: number
  type: string
} 