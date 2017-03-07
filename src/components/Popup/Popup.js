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
import Draggable from "react-draggable";
import "./Popup.scss";


export default class Popup extends React.Component {

    constructor(props) {
        super(props);

        this.elId = "popup_" + props.popupId;
    }

    onCloseHandler(e) {
        e.preventDefault();
        this.props.onClose();
    }

    render() {

        const popupClasses = ['draggable-popup'];
        if (this.props.isActive) {
            popupClasses.push('active');
        }

        return (
            <Draggable
                bounds='parent'
                onMouseDown={this.props.onSelect.bind(this)}
                handle=".box-title.draggable">
                <div id={this.elId}
                     className={popupClasses.join(' ')}
                     style={{
                         top: this.props.positionY,
                         left: this.props.positionX
                     }}
                >
                    <div className="box">
                        <div className="box-header with-border ">
                            <h5 className="box-title draggable">{this.props.title || "Popup"}</h5>
                            <div className="box-tools pull-right">
                                <a href="#" className="btn-box-tool" onClick={this.onCloseHandler.bind(this)}>
                                    <i className="fa fa-times"/>
                                </a>
                            </div>
                        </div>
                        <div className="box-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </Draggable>

        )
    }
}
Popup.propTypes = {
    popupId: React.PropTypes.number,
    title: React.PropTypes.string,
    isActive: React.PropTypes.bool,
    onClose: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    positionY: React.PropTypes.number.isRequired,
    positionX: React.PropTypes.number.isRequired
};
