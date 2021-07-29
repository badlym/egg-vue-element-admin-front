import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/api/role',
    params: query
  })
}
export function create(data) {
  return request({
    url: '/api/role',
    data,
    method: 'post'
  })
}
export function update(data) {
  return request({
    url: '/api/role/' + data.id,
    method: 'put',
    data
  })
}
export function del(id) {
  return request({
    url: '/api/role/' + id,
    method: 'delete'
  })
}
export function remove(data) {
  return request({
    url: '/api/role/remove',
    method: 'delete',
    data
  })
}
export function getById(id) {
  return request({
    url: '/api/role/' + id
  })
}

