import request from '@request'
// import request from '../core/utils/request'

export function wxlogin(query: any) {
  return request({
    url: '/refuseClass/api/v1/wxlogin',
    options: {
      method: 'POST',
      data: query
    },
    api: 'nurseTrainApi'
  });
}
//根据标签获取垃圾类型
export function queryRefuseClassByTag(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuselib/queryRefuseClassByTag',
    options: {
      method: 'GET',
      data: query
    },
    api: 'www_form_urlencoded_nurseTrainApi'
  });
}
//保存垃圾
export function saveRefuseClass(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuselib/saveRefuseClass',
    options: {
      method: 'POST',
      data: query
    },
    api: 'nurseTrainApi'
  });
}
//新增日志
export function saveLog(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuselog/save',
    options: {
      method: 'POST',
      data: query
    },
    api: 'nurseTrainApi'
  });
}
//编辑资料
export function updateUserById(query: any) {
  return request({
    url: '/refuseClass/api/v1/user/updateUserById',
    options: {
      method: 'POST',
      data: query
    },
    api: 'nurseTrainApi'
  });
}

//查询贡献度
export function statisticsLogById(query: any) {
  return request({
    url: '/refuseClass/api/v1/user/statisticsLogById',
    options: {
      method: 'GET',
      data: query
    },
    api: 'www_form_urlencoded_nurseTrainApi'
  });
}

//日志列表
export function getList(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuselog/list',
    options: {
      method: 'POST',
      data: query
    },
    api: 'nurseTrainApi'
  });
}
//垃圾指南
export function queryRefuseClassByType(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuselib/queryRefuseClassByType',
    options: {
      method: 'GET',
      data: query
    },
    api: 'www_form_urlencoded_nurseTrainApi'
  });
}
//查询垃圾分类
export function getTypelist(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuseclass/list',
    options: {
      method: 'GET',
      data: query
    },
    api: 'www_form_urlencoded_nurseTrainApi'
  });
}
//查询个人信息
export function getUserById(query: any) {
  return request({
    url: '/refuseClass/api/v1/user/getUserById',
    options: {
      method: 'GET',
      data: query
    },
    api: 'www_form_urlencoded_nurseTrainApi'
  });
}
//根据垃圾类型查询垃圾标签（分页）
export function queryRefuseClassPageByType(query: any) {
  return request({
    url: '/refuseClass/api/v1/refuselib/queryRefuseClassPageByType',
    options: {
      method: 'POST',
      data: query
    },
    api: 'nurseTrainApi'
  });
}




