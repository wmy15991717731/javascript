/*
 * @Author: your name
 * @Date: 2021-07-01 10:42:19
 * @LastEditTime: 2021-07-01 10:50:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \js_fun\src\routes.ts
 */
import React from 'react';

declare interface RouteItem {
    name: string;
    path: string;
    exact:boolean;
    async: boolean;
    component: React.ComponentType<any> | Function;
}
const routes: RouteItem[] = []
export default routes;