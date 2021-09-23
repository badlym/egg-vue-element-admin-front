<template>
  <el-dialog
    v-el-drag-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    @close="handleClose('form')"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      class="demo-form-inline"
      label-width="120px"
    >
      <el-form-item prop="data_scope" label="权限范围">
        <el-select v-model="form.data_scope" placeholder="请选择数据权限">
          <el-option
            v-for="item in dataScopeList"
            :key="item.data_key"
            :label="item.data_value"
            :value="item.data_key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="form.data_scope === '2'" label="数据权限">
        <el-tree
          ref="tree"
          :data="departments"
          show-checkbox
          default-expand-all
          node-key="id"
          empty-text="加载中，请稍后"
          :props="defaultProps"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getDataScope } from '@/api/stu/dict'
import { getById, updateByDept } from '@/api/stu/role-management'
import { departments } from '@/api/stu/dept-management'
export default {
  name: 'RoleDataScope',
  components: {
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departments: [],
      form: {
        data_scope: '',
        deptIds: []
      },
      dataScopeList: [],
      dictList: [],
      rules: {
        // //
        data_scope: [
          { message: '请选择数据权限', required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  async  created() {
    await this.getDataScopeList()
    await this.getDepartments()
  },
  methods: {
    async  getDepartments() {
      const res = await departments()
      this.departments = res.data.list
    },
    async  getDataScopeList() {
      const res = await getDataScope({
        data_type: 'data_scope'
      })
      this.dataScopeList = res.data
    },
    async dialogOpen() {
      const res = await getById(this.data.id)
      this.form = res.data
      /*   if (this.role.permIds.length) {
        this.$refs.tree.setCheckedKeys(this.role.permIds);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }*/
      const ids = this.form.deptIds
      if (ids.length) {
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.form.data_scope === '2') {
            this.form.deptIds = this.$refs.deptTree.getCheckedKeys()
          }
          await updateByDept(this.form)
          this.beforeClose()
          this.resetForm(formName)
        } else {
          this.$message.error('error submit!')
          return false
        }
      })
    },
    async handleClose(formName) {
      this.resetForm(formName)
    },
    beforeClose() {
      this.$emit('update:dialogVisible', false)
    },
    resetForm(formName) {
      this.$refs.tree.setCheckedKeys([])
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped></style>
