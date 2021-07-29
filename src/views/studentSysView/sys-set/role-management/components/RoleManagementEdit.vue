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
      <el-form-item prop="name" label="角色字段">
        <el-input v-model="form.name" placeholder="请输入角色字段" />
      </el-form-item>
      <el-form-item prop="description" label="描述">
        <el-input v-model="form.description" placeholder="请输入字段描述" />
      </el-form-item>
      <el-form-item label="权限许可">
        <el-tree
          ref="tree"
          :check-strictly="checkStrictly"
          :data="permissions"
          :props="defaultProps"
          default-expand-all
          show-checkbox
          node-key="id"
          class="permission-tree"
          @check="checkPermissionTree"
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
import { create, getById, update } from '@/api/stu/role-management'
import { permissions } from '@/api/stu/permission-management'

export default {
  name: 'RoleManagement',
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
    },
    type: {
      type: String,
      default: 'add'

    }
  },
  data() {
    return {
      permissions: [],
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      form: {
        'name': '',
        description: '',
        permIds: []
      },
      rules: {

      } // //
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      const res = await permissions()
      const result = res.data.list
      this.diGuiTree(result)
      this.permissions = result
    },
    diGuiTree(item) {
      // 递归便利树结构
      item.forEach((item) => {
        item.children === '' ||
        item.children === undefined ||
        item.children === null
          ? delete item.children
          : this.diGuiTree(item.children)
      })
    },
    // 权限树
    checkPermissionTree(currentObj, treeStatus) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentNode.key) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentNode)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentNode, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentNode.childNodes) {
          if (currentNode.childNodes.length !== 0) {
            this.uniteChildSame(currentNode, false)
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(currentNode, isSelected) {
      this.$refs.tree.setChecked(currentNode.key, isSelected)
      if (currentNode.childNodes) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          this.uniteChildSame(currentNode.childNodes[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentNode) {
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    async dialogOpen() {
      if (this.type === 'edit') {
        const res = await getById(this.data.id)
        this.form = res.data
        /*   if (this.role.permIds.length) {
          this.$refs.tree.setCheckedKeys(this.role.permIds);
        } else {
          this.$refs.tree.setCheckedKeys([]);
        }*/
        const ids = this.form.permIds
        if (ids.length) {
          this.$refs.tree.setCheckedKeys(ids)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      } else {
        this.form = this.$options.data().form
        console.log(this.form)
      }
    },
    async submitForm(formName) {
      this.form.permIds = this.$refs.tree.getCheckedKeys()
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.type === 'edit') {
            await update(this.form)
            this.$emit('update-list')
            this.$message.success('操作成功')
          } else {
            const res = await create(this.form)
            this.$emit('update-list')
            this.$message.success(res.msg)
          }
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
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped></style>
