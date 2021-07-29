import request from '@/utils/request'

export function permissions() {
  return request({
    url: '/api/permission',
    method: 'get'
  })
}

export function permissionsByRole(data) {
  return request({
    url: `/rest/permission/allByRole/${data}`,
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/api/permission',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: `/api/permission/` + data.id,
    method: 'put',
    data
  })
}
export function deletePermission(data) {
  return request({
    url: `/api/permission/remove`,
    method: 'delete',
    data
  })
}
