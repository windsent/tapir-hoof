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
import "awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css";
import "./SearchBar.scss";
import DateTimeRangeInput from "../DateTimeRangeInput/DateTimeRangeInput";
import NumberInput from "../NumberInput/NumberInput";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {makeSearch} from "../../actions/searchActions";
import {browserHistory} from "react-router";
import moment from "moment";


@connect(
    state => ({
        query: state.get('search').get("query")
    }),
    dispatch => (bindActionCreators({
        makeSearch
    }, dispatch))
)
export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        const {fromTime, toTime, isCallsOnly} = this.props.query;

        this.state = {
            fromTime: fromTime ? fromTime : moment(toTime).subtract(1, 'hour').toDate().setSeconds(0, 0),
            toTime: toTime ? toTime : moment().toDate().setSeconds(0, 0),
            isCallsOnly

        }
    }

    _onDateRangeChange(fromTime, toTime) {
        this.setState({fromTime, toTime})
    }

    doSearch(e) {
        e.preventDefault();

        const {fromTime, toTime} = this.state;

        const fromUser = $("#input-search-from-user").val();
        const toUser = $("#input-search-to-user").val();
        const isCallsOnly = $('#calls-only-checkbox')[0].checked;

        browserHistory.push('/search');

        this.props.makeSearch({
            fromTime,
            toTime,
            fromUser,
            toUser,
            isCallsOnly
        });
    }

    render() {

        const {fromTime, toTime} = this.state;

        return (
            <div className="box box-success search-bar">
                <div className="box-body search-inline-form">
                    <form className="form-inline" role="form">
                        <div className="form-group">
                            <DateTimeRangeInput onChange={this._onDateRangeChange.bind(this)}
                                                startTime={fromTime}
                                                endTime={toTime}
                                                placeholder="Date range"
                                                id="search-from-datetime"/>
                        </div>
                        <div className="form-group">
                            <NumberInput id="input-search-from-user" placeholder="Caller"/>
                        </div>
                        <div className="form-group">
                            <NumberInput id="input-search-to-user" placeholder="Callee"/>
                        </div>

                        <div className="form-checkbox">
                            <div className="checkbox abc-checkbox">
                                <input type="checkbox" id="calls-only-checkbox" defaultChecked="true"/>
                                <label htmlFor="calls-only-checkbox">Calls only</label>
                            </div>
                        </div>

                        <div className="form-submit" style={{flex: 0}}>
                            <button type="submit" onClick={this.doSearch.bind(this)} className="btn btn-success">Go!
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

