import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/project/list',
    method: 'get',
    params: query
  })
}

export function fetchItem(id) {
  return request({
    url: '/project/' + id,
    method: 'get'
  })
}

export function addItem(data) {
  return request({
    url: '/project/',
    method: 'put',
    data
  })
}

export function updateItem(data) {
  return request({
    url: '/project/',
    method: 'post',
    data
  })
}
