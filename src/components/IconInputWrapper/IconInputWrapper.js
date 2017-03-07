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
require('./IconInputWrapper.scss');
export default function IconInputWrapper(props) {
    return (
        <div className="left-icon-wrap">
            <i className={props.iconClass}/>
            {props.children}
        </div>
    )
}
IconInputWrapper.propTypes = {
    iconClass: React.PropTypes.string.isRequired
};
