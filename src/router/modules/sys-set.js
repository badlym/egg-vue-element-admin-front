import Layout from '@/layout/index'
export default {
  path: '/sys-set',
  component: Layout,
  redirect: 'noRedirect',
  alwaysShow: true,
  meta: {
    title: '系统设置',
    icon: 'icon-yijicaidan',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'user-management',
      component: () => import('@/views/studentSysView/sys-set/user-management'),
      name: 'Usermanagement',
      meta: { title: '用户管理', icon: 'icon-sanjicaidan' }
    },
    {
      path: 'role-management',
      component: () => import('@/views/studentSysView/sys-set/role-management'),
      name: 'RoleManagement',
      meta: { title: '角色管理', icon: 'icon-sanjicaidan' }
    },
    {
      path: 'permission-management',
      component: () => import('@/views/studentSysView/sys-set/permission-management'),
      name: 'PermissionManagement',
      meta: { title: '菜单管理', icon: 'icon-sanjicaidan' }
    },
    {
      path: 'dept-management',
      component: () => import('@/views/studentSysView/sys-set/dept-management'),
      name: 'DeptManagement',
      meta: { title: '部门管理', icon: 'icon-sanjicaidan' }
    },
    {
      path: 'dict',
      component: () => import('@/views/studentSysView/sys-set/dict'),
      name: 'Dict',
      meta: { title: '数据字典', icon: 'icon-sanjicaidan' }
    }
  ]
}
