const viewGenerator = require('./liuchengjin-templates/view/prompt')
const curdGenerator = require('./liuchengjin-templates/curd/prompt')
const componentGenerator = require('./liuchengjin-templates/component/prompt')
const mockGenerator = require('./liuchengjin-templates/mock/prompt')
const vuexGenerator = require('./liuchengjin-templates/vuex/prompt')
module.exports = (plop) => {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('curd', curdGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('mock&api', mockGenerator)
  plop.setGenerator('vuex', vuexGenerator)
}
