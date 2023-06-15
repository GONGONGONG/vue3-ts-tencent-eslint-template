import { Mixin } from './base';

export enum EStatus {
  backlog = '待开始',
  done = '结束',
  cancelled = '取消',
}
export type IStatus = keyof typeof EStatus;
export type IStatusText = `${EStatus}`;

export type IDateRang = [string, string];
export type IOpenType = 'view' | 'edit';

export interface IMeetingOnline {
  meeting_id: string
  meeting_code: string
  start_time: string // 时间戳
  end_time: string
  join_url: string
  subject: string // 会议主题(同活动名称)
  // enable_live: false
  // hosts: [{userid: ''}]
  // location:  string
  // meeting_type: number
  // type: number
  // settings: {mute_all: true, mute_enable_join: true, allow_unmute_self: true, mute_enable_type_join: 1}
}

export interface IMeetingOffline {
  order_id: number
  // 展示信息
  title: number
  city_name: number
  building_id: number
  building_name: string // 大厦
  floor_id: number
  floor_name: string
  room_id: number
  room_name: string
  meeting_member: string // ,分隔，格式：rtx(中文名)
  meeting_member_id: string // ,分隔
  start_time: string
  end_time:  string
  remark: string
  equipments: string // 设备信息
  // 非关键信息
  // client_id: 'meeting'
  // user_description?: string
  // is_send_weixin: number // 0 1
  // is_send_rtx: number
  // is_send_mail: number
  // is_send_sms: number
  // is_send_weixin_to_member: number
  // creator_id: string
  // creator_fullname: string // 格式：rtx(中文名)
  // creator_dept_name: string
  // creator_dept_id: string
  // pre_order_time: string
  // from_source: string // 'pc'
  // tel?: number
  // is_secret: number
  // status: number
  // need_water?: number,
  // need_desk_reset?: number,
  // need_reception?: number,
}

export interface IParticipants {
  required_participants: string[],
  optional_participants: string[],
}

// 标准格式 - 返回结果
export type IActivityInfo = Mixin<{
  id: string,
  name: string, // maxLength: 30 minLength: 1
  status: IStatus,
  pre_status: IStatus,
  conclusion: string,
  is_starred: boolean, // 星星（点赞）
  project: string,
  activity_name: string,
  activity_type: string
  activity_start_time: string,
  activity_end_time: string,
  online_meeting: null | IMeetingOffline,
  offline_meeting: null | IMeetingOffline,
  remark: null|string,
  enabled: boolean,
  created_at: string,
  updated_at: string,
  finished_at: string,
  finished_by: string,
  applicant: string,
  is_activity_owner: boolean // 是否可编辑 预定人+项目负责人+平台管理员, 如果是蓝盾的活动，蓝盾的负责人都可以改
  // is_notice_sent: boolean,
  // extra_info: {},
  // custom_address: null, // 临时的会议地址 取消线下线上时必填，仅线上时选填
}, IParticipants>;

export type IActivityRequire = 'name'|'project'|'activity_type'|'activity_start_time'|'activity_end_time'|'required_participants'|'optional_participants';

// 创建活动
export type IActivityEdit = Mixin<Pick<IActivityInfo, IActivityRequire>, {
  is_online: boolean
  online_meeting_start_time: IDateRang
  online_meeting_end_time: IDateRang
  custom_address?: string
}>;

// 格式化一些前端自定义的属性
export type IActivityRow = Mixin<IActivityInfo, {
  activityTitle: string
  projectName: string
  typeName: string
  typeColor?: string
  timeRange: string // YYYY-MM-DD HH:mm-HH:mm
  applicants: [string]
  allParticipant: string[] // 参会人员信息
  requiredParticipants: string
  optionalParticipants: string
  startTime: string
  endTime: string
  // 会议编辑
  onlineEnable: boolean
  offlineEnable: boolean
  offlineAddress: string
  meetingAddress: string
  joinUrl: string
  meetingCode: string
  statusText: IStatusText
  preStatusText: IStatusText
  remarkHtml: string
  conflictAlarm?: string
}>;


// 评论
export interface IComment {
  id: string
  activity: string // 活动id
  user: string
  avatar_url: URL
  content: string
  created_at: string // 时间
  updated_at: string
  enabled: boolean
}
export interface ICommentParam {
  activity_id: string
  content: string
}

// 全局配置
export interface IActivityType {
  id: string
  activity_name: string
  created_at: string
  updated_at: string
  default_required_participants: string[]
  default_optional_participants: string[]
  qywx_webhook_urls: string[]
  activity_type_color: string
  is_activity_type_used: boolean
  is_disabled: boolean // 停用
  enabled: boolean
  required_role?: string[],
  required_user?: string[],
}
export interface IConfigActivityParams {
  results: IActivityType[]
}
