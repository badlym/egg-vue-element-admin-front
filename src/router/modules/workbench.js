import Layout from '@/layout/index'
export default {
  path: '/workbench',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  meta: {
    title: '工作台',
    icon: 'icon-yijicaidan',
    roles: ['admin', 'teacher', 'student'] // you can set roles in root nav
  },
  children: [
    {
      path: 'course-management',
      component: () => import('@/views/studentSysView/workbench/course-management'),
      name: 'CourseManagement',
      meta: { title: '课程管理', icon: 'icon-sanjicaidan', roles: ['admin'] }// you can set roles in root nav }
    },
    {
      path: 'student-select-course',
      component: () => import('@/views/studentSysView/workbench/student-select-course'),
      name: 'studentSelectCourse',
      meta: { title: '学生选课情况', icon: 'icon-sanjicaidan', roles: ['student', 'teacher'] }// you can set roles in root nav }
    }

  ]
}
