import * as commonAtions from './common'

// 方式一  import Service
// export default {
//   ...commonAtions,
// }

// 方式二 import { fetchUserInfo } 
module.exports = {
  ...commonAtions,
}
