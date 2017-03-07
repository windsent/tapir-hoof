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
import "./Layout.scss";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import Popup from "../Popup/Popup";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {selectPopup, closePopup} from "../../actions/popupActions";
import {version} from "../../../package.json";

@connect(
    (state) => ({
        popups: state.get('popups').toJS()
    }),
    (dispatch) => (bindActionCreators({
        selectPopup,
        closePopup
    }, dispatch))
)
export default class Layout extends React.Component {

    componentDidMount() {
        $(document).on('keydown', (e) => {
            const {popups, closePopup} = this.props;
            if (!popups.popupsList || !(popups.popupsList && popups.popupsList.length)) return;
            if (e.keyCode !== 27) return;

            closePopup(popups.activePopup)
        });
    }

    render() {

        const {popupsList, activePopup} = this.props.popups;

        return (
            <div className="layout">
                <header className="main-header">
                    <NavBar/>
                </header>
                <div className="main-content">
                    <div className="container">
                        <div className="row">
                            <SearchBar/>
                        </div>
                        <div className="row">
                            { this.props.children }
                        </div>
                        <div className="row">
                            <footer>
                                <div className="pull-right hidden-xs">
                                    <small><b>Version:</b> {version}</small>
                                </div>
                                <small><strong>Copyright © 2017 <a href="http://sip3.io/">SIP3.IO CORP</a>.</strong> All
                                    rights reserved.
                                </small>
                            </footer>
                        </div>
                    </div>
                </div>
                {
                    popupsList.map((p, i) => (
                        <Popup key={p.popupId}
                               popupId={p.popupId}
                               isActive={p.popupId === activePopup}
                               onClose={this.props.closePopup.bind(this, p.popupId)}
                               onSelect={this.props.selectPopup.bind(this, p.popupId)}
                               positionY={p.positionY}
                               positionX={p.positionX}
                               title={p.title}
                        >
                            {p.content}
                        </Popup>
                    ))
                }
            </div>
        )
    }
}