import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: query
  })
}

export function fetchAdmin(id) {
  return request({
    url: '/admin/' + id,
    method: 'get'
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function addAdmin(data) {
  return request({
    url: '/admin/',
    method: 'put',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/',
    method: 'post',
    data
  })
}
