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
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item v-if="form.id" label="菜单id" prop="id">
          <el-input
            v-model="form.id"
            :disabled="editFlag"
            placeholder="菜单id"
          />
        </el-form-item>
        <el-form-item prop="icon" label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selectedIcon" />
            <el-input
              slot="reference"
              v-model="form.icon"
              style="width: 450px;"
              placeholder="点击选择图标"
              clearable
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item prop="noKeepAlive" label="不缓存">
          <el-radio-group v-model="form.noKeepAlive" size="mini">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="title" label="菜单标题">
          <el-input v-model="form.title" placeholder="菜单标题" />
        </el-form-item>
        <el-form-item prop="redirect" label="面包屑点击地址">
          <el-input
            v-model="form.redirect"
            disabled
            placeholder="请输入面包屑点击地址"
          />
        </el-form-item>
        <el-form-item prop="path" label="路由地址(path)">
          <el-input
            v-model="form.path"
            placeholder="路由地址"
            style="width: 450px"
          />
        </el-form-item>
        <el-form-item prop="name" label="路由name名称">
          <el-input
            v-model="form.name"
            style="width: 178px"
            placeholder="匹配组件内Name字段"
          />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input
            v-model="form.component"
            style="width: 450px"
            placeholder="组件路径"
          />
        </el-form-item>
        <el-form-item prop="parentId" label="上级权限">
          <treeselect
            v-model="form.parentId"
            style="width: 450px"
            :options="data.list"
            :normalizer="normalizer"
            placeholder="选择上级权限"
            @select="treeSelect"
          />
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" @click="confirmPermission">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
import { create } from '@/api/stu/permission-management'

const RndNum = (n) => {
  let rnd = ''
  for (let i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10)
  }
  return rnd
}
export default {
  name: 'PermissionAddAndEdit',
  components: {
    Treeselect,
    IconSelect
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
      /*
      *     { prop: 'id', label: '菜单编号' },
        { prop: 'parentId', label: '父菜单编号' },
        { prop: 'icon', label: '菜单图标' },
        { prop: 'path', label: '路由地址' },
        { prop: 'name', label: '路由名称' },
        { prop: 'component', label: '组件地址' },
        { prop: 'hidden', label: '是否隐藏' },
        { prop: 'noKeepAlive', label: '是否缓存' },
        { prop: 'title', label: '标题' },
        { prop: 'noClosable', label: '固定' },
        { prop: 'alwaysShow', label: '显示二级路由' }
      *
      * */
      form: {
        id: RndNum(6),
        name: '', // 组件名称
        title: '', // 菜单标题
        parentId: undefined, // 父级菜单id
        path: '', // 路由地址
        noClosable: 0, // 固定标签
        component: '', // 组件路径
        icon: '',
        redirect: 'noRedirect', // 面包屑重定向地址
        noKeepAlive: 1 //  是否缓存
      },
      editFlag: false,
      rules: {}
    }
  },
  computed: {},
  methods: {
    selectedIcon(name) {
      this.form.icon = name
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    treeSelect(node, instanceId) {},
    dialogOpen() {
      this.$nextTick(() => {
        if (this.type === 'add') {
          this.form = this.$options.data().form
          // this.form.id = RndNum(6)
        } else {
          this.editFlag = true
          this.form = this.data.data
        }
        console.log(this.form, 'asdfasdfsdfsdfds')
      })
    },
    async confirmPermission() {
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          if (this.type === 'edit') {
            await this.$api.systemManagement.permissionManagement.update(
              this.form
            )
            this.$message.success('更新成功')
          } else {
            await create(this.form)
            this.$message.success('添加成功')
          }
          this.$emit('update-list')
          this.beforeClose()
        } else {
          this.$message.error('请完成表单验证')
          return false
        }
      })
    },

    beforeClose() {
      this.$emit('update:dialogVisible', false)
    },
    async handleClose(formName) {}
  }
}
</script>

<style scoped></style>
