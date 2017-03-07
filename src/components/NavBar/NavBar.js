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
import "./NavBar.scss";
import {Link} from "react-router";

export default class NavBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-static-top" role="navigation">
                <div className="navbar-header">
                    <button aria-controls="navbar" aria-expanded="false" data-target="#navbar" data-toggle="collapse"
                            className="navbar-toggle collapsed" type="button">
                        <i className="fa fa-reorder"/>
                    </button>
                    <Link to="/" className="navbar-brand">Tapir</Link>
                </div>
                <div className="navbar-collapse collapse" id="navbar">
                    <ul className="nav navbar-nav">
                        <li>
                            <Link activeClassName="active" to="/" onlyActiveOnIndex={true}>Dashboard</Link>
                        </li>
                        <li className="">
                            <Link activeClassName="active" to="/search">SIP Search</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

