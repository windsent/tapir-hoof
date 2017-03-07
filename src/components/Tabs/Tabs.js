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
import "./Tabs.scss";

export class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTabIndx: 0
        };
    }

    setActiveTab(tabIndx) {
        this.setState({currentTabIndx: tabIndx});
    }

    render() {

        const {currentTabIndx} = this.state;

        const currentTabContent = this.props.children[currentTabIndx].props.children;

        return (
            <div className="tabs-container">
                <div className="nav-tabs-custom">
                    <ul className="nav nav-tabs">
                        {
                            this.props.children.map((tab, indx) => (
                                <Tab title={tab.props.title}
                                     key={indx}
                                     isActive={indx === currentTabIndx}
                                     disabled={tab.props.disabled}
                                     onClick={this.setActiveTab.bind(this, indx)}
                                />
                            ))
                        }
                    </ul>
                    <div className="tab-pane active">
                        <div className="panel-body">
                            {currentTabContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class Tab extends React.Component {

    _handleClick(isEnabled) {
        return e => {
            e.preventDefault();
            if (isEnabled) {
                this.props.onClick();
            }
        }

    }

    render() {
        const linkClass = this.props.disabled ? 'tab-disabled' : 'tab-enabled';
        return (
            <li className={[linkClass, this.props.isActive ? 'active' : null].join(' ')}>
                <a href="#" onClick={this._handleClick(!this.props.disabled).bind(this)}>{this.props.title}</a>
            </li>
        )

    }
}
Tab.propTypes = {
    title: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    isActive: React.PropTypes.bool,
    disabled: React.PropTypes.bool
};
