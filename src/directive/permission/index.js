import permission from './permission'

const install = function (app) {
  app.directive('permission', permission)
}

export default {
  install
}
