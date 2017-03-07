/*
 *    Copyright 2017 SIP3.IO CORP.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
/**
 * Created by kernel72.
 */
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/scss/font-awesome.scss";
import "admin-lte/dist/css/AdminLTE.min.css";
import "admin-lte/dist/css/skins/skin-green-light.min.css";
import "./components/Layout/Layout.scss";
import ReactDom from "react-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import SearchResults from "./components/SearchResults/SearchResults";
import {Provider} from "react-redux";
import {Router, Route, IndexRoute, browserHistory} from "react-router";
import store from "./Store";

function App() {
    return (
        <Router history={browserHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Dashboard}/>
                <Route path="/search" component={SearchResults}/>
            </Route>
        </Router>
    )
}

ReactDom.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('tapir-app')
);

