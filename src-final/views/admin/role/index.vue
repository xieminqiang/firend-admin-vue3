<template>
  <div class="app-container">
    <p class="page-title">角色列表</p>
    <div class="filter-container">
      <el-button type="primary" plain class="filter-item" @click="addRole()"
        >添加角色
      </el-button>
    </div>
    <el-table
      v-loading="table_loading"
      element-loading-text="加载中..."
      border
      :data="list"
    >
      <el-table-column label="ID" prop="id" align="center" width="60px" />
      <el-table-column align="center" label="角色名" prop="name" />
      <el-table-column align="center" label="所属上级" prop="parent_name" />
      <el-table-column align="center" width="170px" label="操作">
        <template v-slot="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
            >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDel(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogTableVisible" :title="dialogTableitile">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="所属上级" prop="pid">
          <el-cascader
            v-model="formData.pid"
            style="width: 100%"
            clearable
            placeholder="无"
            :options="roleOptions"
            :show-all-levels="false"
            :props="roleProps"
          />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="设置权限" prop="auth">
          <el-tree
            ref="tree"
            :data="authOptions"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="authProps"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div>
          <el-button @click="close()">取消</el-button>
          <el-button type="primary" @click="handelConfirm()">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <div class="page-container">
      <el-pagination
        background
        v-model:current-page="params.page"
        :page-sizes="page_sizes"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getList, del, authTree, add, getDetail, edit } from '@/api/role'
import { getRoleTree } from '@/api/role'
import { pageMixin } from '@/utils/mixin'
import { removeEmptyChildren } from '@/utils/index'
const formData = {
  id: 0,
  pid: 0,
  name: '',
  auth: [],
}

export default {
  name: 'Role',
  mixins: [pageMixin],
  data() {
    return {
      dialogTableVisible: false,
      dialogTableitile: '',
      isAdd: true,
      formData: {
        id: 0,
        pid: 0,
        name: '',
        auth: '',
      },
      rules: {
        name: { required: true, trigger: 'blur', message: '请输入角色名' },
      },
      roleOptions: [],
      roleProps: {
        value: 'id',
        label: 'name',
        expandTrigger: 'hover',
        checkStrictly: true,
        emitPath: false,
      },
      authOptions: [],
      authProps: {
        label: 'name',
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      try {
        const res = await authTree()
        let data = res.data || []
        data = removeEmptyChildren(data)
        this.authOptions = data
      } catch (error) {
        console.error('初始化权限树失败:', error)
        this.authOptions = []
        this.$message.error('获取权限数据失败')
      }
    },
    // 添加角色
    async addRole() {
      try {
        const res = await getRoleTree()
        let data = res.data || []
        data = removeEmptyChildren(data)

        this.dialogTableVisible = true
        this.dialogTableitile = '添加角色'
        this.roleOptions = data
        this.isAdd = true

        // 重置表单数据
        Object.assign(this.formData, formData)

        await this.$nextTick()
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
        }
      } catch (error) {
        console.error('添加角色时出错:', error)
        this.$message.error('获取角色数据失败，请稍后重试')
      }
    },
    // 编辑角色
    async handleEdit(info) {
      try {
        // 获取角色树数据
        const roleTreeRes = await getRoleTree(info.id)
        let data = roleTreeRes.data || []
        data = removeEmptyChildren(data)

        // 获取角色详情数据
        const roleDetailRes = await getDetail(info.id)
        const role = roleDetailRes.data || {}

        console.log('Role data:', role)

        // 设置对话框数据
        this.dialogTableVisible = true
        this.dialogTableitile = '编辑角色'
        this.formData = {
          id: role.id || 0,
          pid: role.pid || 0,
          name: role.name || '',
          auth: role.auth || '',
        }
        this.roleOptions = data
        this.isAdd = false

        // 等待 DOM 更新
        await this.$nextTick()

        // 设置选中的权限节点
        if (this.$refs.tree && role.base_auth) {
          this.$refs.tree.setCheckedKeys(role.base_auth)
        } else if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
        }
      } catch (error) {
        console.error('编辑角色时出错:', error)
        this.$message.error('获取角色信息失败，请稍后重试')
      }
    },
    // 删除角色
    async handleDel(index, info) {
      try {
        await this.$confirm('删除角色不可恢复', '警告')
        const res = await del(info.id)
        this.$message.success(res.msg || '删除成功')
        this.list.splice(index, 1)
      } catch (error) {
        if (error === 'cancel') {
          // 用户取消删除，不显示错误消息
          return
        }
        console.error('删除角色时出错:', error)
        this.$message.error('删除失败，请稍后重试')
      }
    },
    // 获取数据
    async _getData() {
      const res = await getList(this.params)
      this.list = res.data.data
      this.total = res.data.total
      this.pageSize = res.data.per_page
      this.page = res.data.current_page
      this.table_loading = false
    },
    // 关闭弹窗
    close() {
      this.dialogTableVisible = false
    },
    // 提交
    async handelConfirm() {
      try {
        await this.$refs.elForm.validate()

        let auth = []
        if (this.$refs.tree) {
          auth = this.$refs.tree
            .getCheckedKeys()
            .concat(this.$refs.tree.getHalfCheckedKeys())
        }
        this.formData.auth = auth.join(',')

        let res
        if (this.isAdd) {
          res = await add(this.formData)
        } else {
          res = await edit(this.formData.id, this.formData)
        }

        this.$message.success(res.msg || '操作成功')
        this.dialogTableVisible = false
        this._getData()
      } catch (error) {
        console.error('提交时出错:', error)
        if (error.message) {
          this.$message.error(error.message)
        } else {
          this.$message.error('操作失败，请稍后重试')
        }
      }
    },
  },
}
</script>
