<template>
  <div class="app-container">
    <el-form ref="form" inline :model="form" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('form')">提交</el-button>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      style="margin: 10px"
      @click="add"
    >新僧
    </el-button>
    <el-button
      ref="delButton"
      class="filter-item"
      type="danger"
      icon="el-icon-delete"
      :disabled="delbuttonFlag"
      @click="handleSelectionDel"
    >全选/多选删除
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column show-overflow-tooltip align="center" label="角色字段" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="描述" prop="description"></el-table-column>
      <el-table-column :formatter="handleDataScopeFormatter" show-overflow-tooltip align="center" label="数据权限" prop="data_scope"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleOpenDataScope(scope.row)"
          >数据权限
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete( scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Edit
      :dialog-visible.sync="editData.dialogVisible"
      :title="editData.title"
      :data="editData.data"
      :type="editData.type"
      @update-list="getList()"
    ></Edit>
    <RoleDataScope ref="roleDataScope" :dialog-visible.sync="dataScopeData.dialogVisible" :title="dataScopeData.title" :data="dataScopeData.data"></RoleDataScope>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="form.current"
      :limit.sync="form.limit"
      @pagination="handlePaginationChange"
    />
  </div>
</template>
<script>
import { del, getList, remove } from '@/api/stu/role-management'
import Edit from './components/RoleManagementEdit'
import RoleDataScope from '@/views/studentSysView/sys-set/role-management/components/RoleDataScope'
import { getDataScope } from '@/api/stu/dict'
export default {
  name: 'RoleManagement',
  components: {
    Edit,
    RoleDataScope
  },
  data() {
    return {

      dataScopeData: {
        dialogVisible: false,
        data: {},
        title: ''
      },
      dictList: [],
      delbuttonFlag: true,
      multipleSelectionIds: [],
      form: {
        current: 1,
        limit: 10,
        username: ''
      },
      editData: {
        dialogVisible: false,
        data: {},
        title: '新增',
        type: 'add'
      },
      total: 0,
      listLoading: false,
      list: []
    }
  },
  async created() {
    await this.getDataScopeList()
    await this.getList()
  },
  methods: {
    async  getDataScopeList() {
      const res = await getDataScope({
        data_type: 'data_scope'
      })
      this.dictList = res.data
    },
    handleDataScopeFormatter(row, column, cellValue, index) {
      const dictList = this.dictList
      let val = ''
      for (let i = 0; i < dictList.length; i++) {
        if (cellValue === dictList[i].data_key) {
          val = dictList[i].data_value
          break
        }
      }
      return val
    },
    handleOpenDataScope(row) {
      this.dataScopeData = {
        dialogVisible: true,
        data: { ...row },
        title: '数据权限'
      }
    },
    handlePaginationChange({ page, limit }) {
      this.form.current = page
      this.form.limit = limit
      this.getList()
    },
    submit(formName) {
      this.getList()
    },
    async handleSelectionDel() {
      const ids = this.multipleSelectionIds.join()
      const res = await remove(
        {
          ids
        }
      )
      this.$message.success(res.msg)
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelectionIds = val.map(item => {
        return item.id
      })
      this.delbuttonFlag = !val.length
    },
    add() {
      this.editData
        .dialogVisible = true
      this.editData.data = {}
      this.editData.type = 'add'
    },
    async getList() {
      const res = await getList(this.form)
      this.list = res.data.list
      this.total = res.data.total
    },
    handleEdit(row) {
      this.editData = {
        dialogVisible: true,
        data: row,
        type: 'edit',
        title: '编辑用户'
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await del(row.id)
        await this.getList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
