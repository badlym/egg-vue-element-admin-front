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
      <el-form-item prop="username" label="登录名称">
        <el-input v-model="form.username" placeholder="请输入登录名称" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="avatar" label="头像">
        <transition name="el-zoom-in-center">
          <pan-thumb v-if="form.avatar" :image="form.avatar" />
        </transition>
        <transition name="el-zoom-in-center">
          <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :width="300"
            :height="300"
            no-square
            url="/api/uploadFile"
            lang-type="zh"
            :headers="{ 'Content-Type': 'multipart/form-data'}"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
        </transition>
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
          上传头像
        </el-button>
      </el-form-item>
      <el-form-item prop="phone" label="手机号">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <treeselect
          v-model="form.deptId"
          :options="departments"
          :normalizer="normalizer"
          placeholder="选择部门"
        />
      </el-form-item>
      <el-form-item prop="roleId" label="角色">

        <el-select v-model="form.roleId" filterable placeholder="请选择角色">
          <el-option
            v-for="item in rolesList"
            :key="item.value"
            :label="item.description"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { create, getUserById, update } from '@/api/stu/user-management'
import { getRole } from '@/api/stu/user-management'
import { departments } from '@/api/stu/dept-management'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'UserAdd',
  components: {
    ImageCropper,
    PanThumb,
    Treeselect
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
      imagecropperShow: false,
      imagecropperKey: 0,
      form: {
        'username': '',
        'password': '',
        name: '',
        avatar: '',
        'roleId': '',
        'phone': '',
        deptId: null
      },
      rolesList: [],
      departments: [],
      rules: {
        // //
        username: [
          { message: '用户名不能为空', required: true, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '头像不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '部门不能为空', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRole()
    this.getDepartments()
  },
  methods: {
    async  getDepartments() {
      const res = await departments()
      this.departments = res.data.list
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    async getRole() {
      const res = await getRole()
      this.rolesList = res.data
      console.log(res)
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.form.avatar = resData.url
    },
    close() {
      this.imagecropperShow = false
    },
    async dialogOpen() {
      if (this.type === 'edit') {
        const res = await getUserById(this.data.id)
        this.form = res.data
      } else {
        this.form = this.$options.data().form
        console.log(this.$options.data().form)
      }
    },
    async submitForm(formName) {
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
