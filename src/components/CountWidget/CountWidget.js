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
import "./CountWidget.scss";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Alert from "../Alert/Alert";

export default function CountWidget(props) {

    return (
        <div className="box box-success">
            <div className="box-header with-border">
                {   props.value && !props.isLoading ?
                    <span className="label label-success pull-right">{props.titleMark}</span>
                    :
                    <span className="label label-default pull-right">n/a</span>
                }
                <h5 className="box-title">{props.title}</h5>
            </div>
            <div className="box-body">
                <LoadingSpinner showSpinner={props.isLoading}>
                    {
                        props.errorMessage ?
                            <Alert alertType="error">
                                {props.errorMessage}
                            </Alert>
                            :
                            <div>
                                <h1 className="no-margins">{props.value ? props.value : 'n/a'}</h1>
                                {
                                    props.value && props.value != 0 &&
                                    <div
                                        className={props.isWarn ? "pull-right stat-percent font-bold text-danger" : "pull-right stat-percent font-bold text-success"}>
                                        <span style={{marginRight: 3}}>{props.statValue}</span>
                                        <i className={
                                            props.statSign > 0 ? "fa fa-level-up" :
                                                props.statSign < 0 ? "fa fa-level-down" : '' }/>
                                    </div>
                                }
                                {
                                    props.valueDescription &&
                                    <small>{props.valueDescription}</small>
                                }
                            </div>

                    }
                </LoadingSpinner>

            </div>
        </div>
    )
}
CountWidget.propTypes = {
    title: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    valueDescription: React.PropTypes.string,
    titleMark: React.PropTypes.string,
    statValue: React.PropTypes.string,
    isLoading: React.PropTypes.bool,
    isWarn: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    statSign: React.PropTypes.number
};