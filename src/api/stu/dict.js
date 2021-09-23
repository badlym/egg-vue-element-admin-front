import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/dict',
    params: query
  })
}
export function create(data) {
  return request({
    url: '/api/dict',
    data,
    method: 'post'
  })
}
export function update(data) {
  return request({
    url: '/api/dict/' + data.id,
    method: 'put',
    data
  })
}
export function del(id) {
  return request({
    url: '/api/dict/' + id,
    method: 'delete'
  })
}
export function remove(data) {
  return request({
    url: '/api/dict/remove',
    method: 'delete',
    data
  })
}
export function getById(id) {
  return request({
    url: '/api/dict/' + id
  })
}
export function getDataScope(query) {
  return request({
    url: '/api/dict/getDict',
    params: query
  })
}
