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
      <el-table-column show-overflow-tooltip align="center" label="用户名" prop="username"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="姓名" prop="name"></el-table-column>
      <el-table-column
        label="角色名称"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.role.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="角色描述"
        show-overflow-tooltip
        align="center"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.role.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
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
    <UserAdd
      :dialog-visible.sync="UserAdd.dialogVisible"
      :title="UserAdd.title"
      :data="UserAdd.data"
      :type="UserAdd.type"
      @update-list="getList()"
    ></UserAdd>
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
import { del, getList, removes } from '@/api/stu/user-management'
import UserAdd from '@/views/studentSysView/sys-set/user-management/components/UserAdd'
export default {
  name: 'Usermanagement',
  components: {
    UserAdd
  },
  data() {
    return {
      delbuttonFlag: true,
      multipleSelectionIds: [],

      form: {
        current: 1,
        limit: 10,
        username: ''

      },
      UserAdd: {
        dialogVisible: false,
        data: {},
        title: '新增用户',
        type: 'add'
      },
      total: 0,
      listLoading: false,
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
      const res = await removes(
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
      this.UserAdd.dialogVisible = true
    },
    async getList() {
      const res = await getList(this.form)
      this.list = res.data.list
      this.total = res.data.total
    },
    handleEdit(row) {
      this.UserAdd = {
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
