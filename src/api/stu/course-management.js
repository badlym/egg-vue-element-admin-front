import request from '@/utils/request'
export function getList(query) {
  return request({
    url: '/api/course',
    params: query
  })
}
export function create(data) {
  return request({
    url: '/api/course',
    data,
    method: 'post'
  })
}
export function update(data) {
  return request({
    url: '/api/course/' + data.id,
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/course/' + id,
    method: 'delete'
  })
}

/**
 *
 * @param {Object}  data
 * @return {AxiosPromise}
 */
export function remove(data) {
  return request({
    url: '/api/course/remove',
    method: 'delete',
    data
  })
}

/**
 *
 * @param id
 * @return {AxiosPromise}
 */
export function getById(id) {
  return request({
    url: '/api/course/' + id
  })
}

