import http from '@/api';
import type {
  Mixin,
  IActivityEdit, IActivityInfo, IActivityType, IParticipants,
  IComment, ICommentParam, IConfigActivityParams,
} from '@/@types';
// import { omSort } from '@/common/util';

// 文档页面取得基本信息
// Array.from(document.getElementsByClassName('opblock-summary'))
//   .map(item => item.innerText.replace(/\n/g, ' ').toLowerCase())
//   .map(item => {
//     const = item.split(' ');
//     return `http.${arr[0]}('${arr[1]}').catch(() => ({})); // ${arr[2]} ${arr[3]}`
//   })

/** 活动列表 */
export function apiGetActivities(params): Promise<{ results: IActivityInfo[] }> {
  return http.get('/api/v1/activities/', { params }).catch(() => ({ results: [] }));
}
/** 活动列表 - 活动名统计 */
export function apiGetListActivityName(): Promise<{ results: IActivityInfo[] }> {
  return http.get('/api/v1/activities/list_activity_name/').catch(() => ({ results: [] }));
}
/** 冲突列表 - 获取所有活动之间的时间冲突和人员冲突 */
export function apiGetListActivityConflict(params): Promise<{
  results: Mixin<{ activity_id: string }, IParticipants>[]
}> {
  return http.get('/api/v1/activities/list_activity_conflict/', { params }).catch(() => ({ results: [] }));
}
/** 获取某个用户参与的所有活动 */
export function apiGetListUserActivity(params: {
  user: string; start_time: string; end_time: string
}): Promise<{ results: IActivityInfo[] }> {
  return http.post('/api/v1/activities/list_user_activity/', params).catch(() => ({ results: [] }));
}
/** 创建活动 */
export function apiCreateActivity(params: IActivityEdit): Promise<IActivityInfo> {
  return http.post('/api/v1/activities/', params).catch(() => ({}));
}
/** 编辑活动 */
export function apiEditActivity(params: Mixin<IActivityEdit, { id: string }>): Promise<IActivityInfo> {
  return http.put(`/api/v1/activities/${params.id}/`, params).catch(() => ({}));
}
/** 删除活动 */
export function apiDeleteActivity(activityId: string): Promise<IActivityInfo> {
  return http.delete(`/api/v1/activities/${activityId}/`).catch(() => ({}));
}
/** 修改活动状态 */
export function apiUpdateActivityStatus({ id, ...other }): Promise<IActivityInfo> {
  return http.post(`/api/v1/activities/${id}/update_activity_status/`, { ...other }).catch(() => ({}));
}
/** 点亮活动星星 */
export function apiUpdateActivityStar({ id, is_starred }: { id: string, is_starred: boolean }): Promise<IActivityInfo> {
  return http.post(`/api/v1/activities/${id}/update_activity_star/`, { is_starred }).catch(() => false);
}
/** 检查参会人员时间冲突 */
export function apiCheckTimeConflict(params: {
  activity_id?: string
  meeting_room?: string
  required_participants: string[]
  optional_participants: string[]
  activity_start_time?: string
  activity_end_time?: string
}): Promise<{ required_participants: string[]; optional_participants: string[]; meeting_tag: 0|1 }> {
  return http.post('/api/v1/activities/check_time_conflict/', params).catch(() => ({}));
}


// 评论
/** 活动评论列表 */
export function apiGetCommentList(params: ICommentParam): Promise<{ results: IComment[] }> {
  return http.get('/api/v1/comments/', { params }).catch(() => ({ results: [] }));
}
/** 新建评论 */
export function apiCreateComment(params: IComment): Promise<IComment> {
  return http.post('/api/v1/comments/', params).catch(() => ({}));
}
/** 编辑评论 */
export function apiUpdateComment({ activity_id, content }: ICommentParam): Promise<IComment> {
  return http.put(`/api/v1/comments/${activity_id}/`, { content }).catch(() => ({}));
}
/** 删除评论 */
export function apiDeleteComment(activity_id: string): Promise<IComment> {
  return http.delete(`/api/v1/comments/${activity_id}/`).catch(() => ({}));
}
/** 修改结论 */
export function apiUpdateConclusion({ id, conclusion }) {
  return http.post(`/api/v1/activities/${id}/update_conclusion/`, { conclusion }).catch(() => ({}));
}

// 全局配置
/** 活动管理 - 获取 */
export async function apiGetConfigActivity(): Promise<IConfigActivityParams> {
  let { results } = await http.get('/api/v1/configs/').catch(() => ({ results: [] }));
  results = results.map(({ default_required_participants = [], ...item }) => ({
    ...item,
    default_required_participants,
    // required_role: default_required_participants.filter(key => !!ROLE_GROUP.find(role => role.value === key)),
    // required_user: default_required_participants.filter(key => !ROLE_GROUP.find(role => role.value === key)),
  }));
  // omSort(results, 'activity_name');
  return results;
}
export function createConfigActivity(params): Promise<IActivityType> {
  return http.post('/api/v1/configs/', params).catch(() => null);
}
export function editConfigActivity(id: string, params): Promise<IActivityType> {
  return http.put(`/api/v1/configs/${id}/`, params).catch(() => null);
}
export function deleteConfigActivity(id: string): Promise<IActivityType> {
  return http.delete(`/api/v1/configs/${id}/`).catch(() => null);
}
export function toggleConfigActivity(id: string, params: { is_disabled: boolean }): Promise<IActivityType> {
  return http.post(`/api/v1/configs/${id}/disable/`, params).catch(() => null);
}

/** 活动管理 - 更新 */
export function apiUpdateConfigActivity(params: IConfigActivityParams): Promise<IConfigActivityParams> {
  return http.post('/api/v1/configs/update_configs/', params).catch(() => ({}));
}
