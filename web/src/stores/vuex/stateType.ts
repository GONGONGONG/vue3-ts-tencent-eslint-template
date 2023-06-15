import type { RouteRecordRaw } from 'vue-router';
import { IActivityType } from '@/@types';
// import { IActivityType, IProject } from '@/@types';

export interface IRootState {
  userName: string;
  userType: string;
  navList: RouteRecordRaw[];
  windowHeight: number;
}

export interface IHomeSate {
  activityType: IActivityType[];
  activityTypeMap: { [key: string]: string };
  activityTypeColorMap: { [key: string]: string };
  // projects: IProject[];
  projects: string[];
  projectNameMap: { [key: string]: string };
  roleGroup: string[];
}

export interface IActivityState {
  [key: string]: T;
}
