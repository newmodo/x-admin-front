/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const adminRouter = {
  path: '/project',
  component: Layout,
  redirect: '/project/list',
  name: '项目管理',
  meta: {
    title: '项目管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'create',
      component: () => import('@/views/project/create'),
      name: '创建项目管理',
      meta: { title: '创建项目管理', icon: 'edit' }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/project/edit'),
      name: '编辑项目',
      meta: { title: '编辑项目', noCache: true, activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'publish/:id(\\d+)',
      component: () => import('@/views/project/publish'),
      name: '代码发布',
      meta: { title: '代码发布', noCache: true, activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'publish_log/:id(\\d+)',
      component: () => import('@/views/project/log_list'),
      name: '发布历史',
      meta: { title: '发布历史', noCache: true, activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'list',
      component: () => import('@/views/project/list'),
      name: '项目列表',
      meta: { title: '项目列表', icon: 'list' }
    }
  ]
}

export default adminRouter
