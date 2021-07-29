import request from '@/utils/request'
export function departments() {
  return request({
    url: '/api/dept',
    method: 'get'
  })
}
export function addDpartment(data) {
  return request({
    url: '/api/dept',
    method: 'post',
    data
  })
}
export function updateDpartment(data) {
  return request({
    url: `/api/dept/` + data.id,
    method: 'put',
    data
  })
}
export function deleteDpartment(data) {
  return request({
    url: '/api/dept/remove',
    method: 'delete',
    data
  })
}
