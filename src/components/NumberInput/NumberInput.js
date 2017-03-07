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
import IconInputWrapper from "../IconInputWrapper/IconInputWrapper";
export default class NumberInput extends React.Component {

    constructor(props) {
        super(props);
        this.inputRef = null;
    }

    _onChange(e) {
        this.props.onInputChange && this.props.onInputChange(e.target.value);
    }

    render() {

        const input = (
            <input ref={ ref => {
                this.inputRef = ref;
            }}
                   className="form-control"
                   type="text"
                   value={this.props.value}
                   onChange={this._onChange.bind(this)}
                   {...this.props}
            />
        );
        return this.props.noIcon ?
            input :
            <IconInputWrapper iconClass="glyphicon glyphicon-phone-alt">
                {input}
            </IconInputWrapper>
    }

}
NumberInput.propTypes = {
    onInputChange: React.PropTypes.func,
    noIcon: React.PropTypes.bool
};
