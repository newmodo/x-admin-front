/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/list',
  name: '管理员',
  meta: {
    title: '管理员',
    icon: 'peoples'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/admin/create'),
      name: '创建管理员',
      meta: { title: '创建管理员', icon: 'edit' }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/admin/edit'),
      name: '编辑管理员',
      meta: { title: '编辑管理员', noCache: true, activeMenu: '/admin/list' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/admin/list'),
      name: '管理员列表',
      meta: { title: '管理员列表', icon: 'list' }
    }
  ]
}

export default adminRouter
