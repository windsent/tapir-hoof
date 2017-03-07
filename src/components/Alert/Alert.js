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
const ALERT_CLASSES = {
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
    success: 'alert-success'
};

export default class Alert extends React.Component {

    render() {
        const alertClasses = ['alert', ALERT_CLASSES[this.props.alertType]];
        if (this.props.dismissible) {
            alertClasses.push('alert-dismissible"')
        }

        return (
            <div className={alertClasses.join(' ')} role="alert">
                {
                    this.props.dismissible &&
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                }
                {this.props.children}
            </div>
        )
    }
}
Alert.propTypes = {
    dismissible: React.PropTypes.bool,
    alertType: React.PropTypes.oneOf(Object.keys(ALERT_CLASSES))
};
Alert.defaultProps = {
    alertType: 'info',
    dismissible: false
};