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
import "bootstrap-daterangepicker/daterangepicker.js";
import "bootstrap-daterangepicker/daterangepicker.css";
import "./DateTimeRangeInput.scss";
import moment from "moment";
import IconInputWrapper from "../IconInputWrapper/IconInputWrapper";

export default class DateTimeRangeInput extends React.Component {
    constructor(props) {
        super(props);

        this.inputRef = null;
    }

    componentDidMount() {
        console.log('Mounting daterangepicker');

        const {startTime, endTime} = this.props;

        $(this.inputRef).daterangepicker({
            "showDropdowns": true,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerIncrement": 5,
            "autoApply": true,
            applyClass: 'btn-success',
            cancelClass: 'btn-default',
            autoUpdateInput: true,
            startDate: moment(startTime),
            endDate: moment(endTime),
            ranges: {
                "Last 15 min": [
                    moment().subtract(15, 'minute'),
                    moment()
                ],
                "Last 30 min": [
                    moment().subtract(30, 'minute'),
                    moment()
                ],
                "Last hour": [
                    moment().subtract(1, 'hour'),
                    moment()
                ],
                "Last 2 hours": [
                    moment().subtract(2, 'hour'),
                    moment()
                ],
                "Last 3 hours": [
                    moment().subtract(3, 'hour'),
                    moment()
                ],
                "Last 6 hours": [
                    moment().subtract(6, 'hour'),
                    moment()
                ],
                "Last day": [
                    moment().subtract(1, 'day'),
                    moment()
                ]
            },
            locale: {
                "format": 'DD/MM/YYYY HH:mm'
            }
        }, (start, end, label) => {
            this.props.onChange(
                start.toDate().setSeconds(0, 0),
                end.toDate().setSeconds(0, 0))
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY HH:mm') + ' - ' + picker.endDate.format('DD/MM/YYYY HH:mm'));
        }).on('cancel.daterangepicker', function () {
            $(this).val('');
        });
    }


    render() {
        return (
            <IconInputWrapper iconClass="glyphicon glyphicon-calendar">
                <input ref={(ref) => {
                    this.inputRef = ref;
                }} type="text" {...this.props} className="form-control"/>
            </IconInputWrapper>
        )
    }
}
DateTimeRangeInput.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    startTime: React.PropTypes.number.isRequired,
    endTime: React.PropTypes.number.isRequired
};