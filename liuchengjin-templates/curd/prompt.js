const { notEmpty } = require('../utils.js')
module.exports = {
  description: '创建curd',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: '请输入view名称(可用/分隔),勿与之前重复,然后点击回车',
      validate: notEmpty('name')
    }
  ],
  actions: () => {
    const pathCaseName = '{{ pathCase name }}'
    const properCaseName = '{{ properCase name }}'
    const camelCaseName = '{{ camelCase name }}'
    return [
      {
        type: 'add',
        path: `src/views/studentSysView/{{name}}/index.vue`,
        templateFile: 'liuchengjin-templates/curd/index.hbs'
      },
      {
        type: 'add',
        path: `src/views/studentSysView/{{name}}/components/${properCaseName}Edit.vue`,
        templateFile: 'liuchengjin-templates/curd/edit.hbs'
      },
      // {
      //   type: 'add',
      //   path: `mock/controller/${camelCaseName}.js`,
      //   templateFile: 'node_modules/vab-templates/mock/index.hbs'
      // },
      {
        type: 'add',
        path: `src/api/stu/{{name}}.js`,
        templateFile: 'liuchengjin-templates/api/index.hbs'
      }
    ]
  }
}
