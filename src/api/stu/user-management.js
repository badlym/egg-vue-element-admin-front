import request from '@/utils/request'

export const getList = query => request({
  url: '/api/user',
  params: query,
  method: 'get'

})
export const create = data => request({
  url: '/api/user',
  method: 'post',
  data
})
export function getUserById(id) {
  return request({
    url: '/api/user/' + id

  })
}
export function del(id) {
  return request({
    url: '/api/user/' + id,
    method: 'delete'
  })
}
export function update(data) {
  return request({
    url: '/api/user/' + data.id,
    data,
    method: 'put'

  })
}
export function removes(data) {
  return request({
    url: '/api/user/remove',
    method: 'delete',
    data
  })
}
export function getRole() {
  return request({
    url: '/api/role/getrole'

  })
}
export function getStudentCourse(query) {
  return request({
    url: '/api/student/getStudentCourse',
    params: query
  })
}
