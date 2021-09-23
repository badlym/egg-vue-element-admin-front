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
      <!--      <el-form-item prop="number" label="课程编号">-->
      <!--        <el-input v-model="form.number" disabled placeholder="请输入课程编号" />-->
      <!--      </el-form-item>-->
      <el-form-item prop="name" label="课程名称">
        <el-input v-model="form.name" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { create, getById, update } from '@/api/stu/course-management'
export default {
  name: 'CourseManagement',
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

      form: {

        name: ''
      },
      rules: {
        // //
        name: [
          { message: '课程名称不能为空', required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  methods: {

    async dialogOpen() {
      if (this.type === 'edit') {
        const res = await getById(this.data.id)
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
