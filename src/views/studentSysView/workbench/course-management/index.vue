<template>

  <div class="app-container">
    <el-form ref="form" inline :model="form" label-width="80px">
      <el-form-item label="课程名" prop="name">
        <el-input v-model="form.name" placeholder="请输入课程名"></el-input>
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
      <el-table-column show-overflow-tooltip align="center" label="课程名" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="课程编号" prop="number"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="
              handleEdit (scope.row)"
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="form.current"
      :limit.sync="form.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { del, getList, remove } from '@/api/stu/course-management'
import Edit from './components/CourseManagementEdit'
export default {
  name: 'CourseManagement',
  components: {
    Edit
  },
  data() {
    return {
      delbuttonFlag: true,
      multipleSelectionIds: [],
      form: {
        current: 1,
        limit: 10,
        name: ''

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
  created() {
    this.getList()
  },
  methods: {
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
    },
    handleSelectionChange(val) {
      this.multipleSelectionIds = val.map(item => {
        return item.id
      })
      this.delbuttonFlag = !val.length
    },
    add() {
      this.editData.dialogVisible = true
    },
    async getList() {
      const res = await getList(this.form)
      this.list = res.data.list
      this.total = res.data.total
    },
    handleEdit(row) {
      this.editData = {
        dialogVisible: true,
        data: { ...row },
        type: 'edit',
        title: '编辑'
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
