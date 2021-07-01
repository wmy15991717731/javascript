/*
 * @Author: your name
 * @Date: 2021-06-30 20:50:10
 * @LastEditTime: 2021-07-01 11:27:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \js_fun\src\index.tsx
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect,
    withRouter
} from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import './index.css';
import reportWebVitals from './reportWebVitals';
import routes from './routes';

interface IProps extends RouteComponentProps<{}> {

}

class MainRouterBase extends React.PureComponent<IProps, {}> {
    render() {
        return(
            <Switch>
                {
                    routes.map(route => <Route
                    path={route.path}
                    exact={route.exact}
                    key={route.name}
                    component={route.component as React.ComponentType<any>} />)
                }
                <Redirect to="" />
            </Switch>
        )
    }
}

const MainRouter = withRouter(MainRouterBase);

ReactDOM.render(
    <Router>
        <div>
            <MainRouter />
        </div>
    </Router>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
