import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/projects',
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

export function fetchVersion(id) {
  return request({
    url: '/projects/version/' + id,
    method: 'get'
  })
}

export function publishVersion(data) {
  return request({
    url: '/vsersion/',
    method: 'put',
    data
  })
}

export function fetchLogList(query) {
  return request({
    url: '/versions',
    method: 'get',
    params: query
  })
}
