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
import "./CallInfo.scss";
import {Tabs, Tab} from "../Tabs/Tabs";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import request from "superagent";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CallMessagesInfo from "../CallMessagesInfo/CallMessagesInfo";
import FileSaver from "file-saver";
import DateTimeFormat from "../DateTimeFormat/DateTimeFormat";
import Alert from "../Alert/Alert";
import {requestError} from "../../actions/errorActions";
import CallFlow from "../CallFlow/CallFlow";

export default class CallInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            infoShow: 'details'
        }
    }

    openCallFlow() {
        this.setState({infoShow: 'flow'});
    }

    openData() {
        this.setState({infoShow: 'details'});
    }

    render() {
        return (
            <div>
                {
                    this.state.infoShow === 'details' &&
                    <CallData onCallFlowClick={this.openCallFlow.bind(this)} {...this.props}/>
                }
                {
                    this.state.infoShow === 'flow' &&
                    <CallFlow onDetailsClick={this.openData.bind(this)} {...this.props}/>
                }
            </div>
        )

    }
}
CallInfo.propTypes = {
    data: React.PropTypes.object.isRequired,
    caller: React.PropTypes.string.isRequired,
    callee: React.PropTypes.string.isRequired,
    start_time: React.PropTypes.string.isRequired
};


@connect(
    null,
    dispatch => (bindActionCreators({
        requestError
    }, dispatch))
)
class CallData extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingStatus: false,
            callStatus: null,
            error: null
        }
    }

    componentDidMount() {
        this.loadStatus();
    }

    onCallFlowClickHandler() {
        this.props.onCallFlowClick();
    }

    loadStatus() {
        const {requestError, data} = this.props;
        this.setState({
            loading: true,
            callStatus: null,
            error: null
        });
        request
            .post("/api/session/details")
            .send(data)
            .end((err, response) => {

                this.setState({loading: false});
                if (err) {
                    this.setState({error: `Error ${response.statusCode}: ${err.message}`});
                    requestError(
                        response.statusCode,
                        err,
                        response
                    );
                    return
                }
                this.setState({
                    callStatus: response.body
                })
            })
    }

    exportToPCAP() {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', "/api/session/pcap", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = 'blob';
        var fname = `Tapir-${this.props.data.call_ids.join('-')}.pcap`;
        xhr.onload = function (e) {
            if (this.status == 200) {
                var blob = this.response;
                FileSaver.saveAs(blob, fname, true);
            }
        };

        xhr.send(JSON.stringify(this.props.data));
    }

    render() {

        const {loading, callStatus, error} = this.state;
        const {data, callee, caller, start_time}= this.props;
        const callStatusClass = ({
                'Failed': 'text-danger',
                'Answered': 'text-success',
                'Canceled': 'text-warning'
            })[callStatus && callStatus.state] || '';
        return (
            <div>
                <LoadingSpinner showSpinner={loading}>
                    {
                        error &&
                        <Alert alertType="error">
                            {error}
                        </Alert>
                    }
                    {
                        callStatus ?
                            <div>
                                <div>
                                    <div className="call-general-info">
                                        <div className="call-info-text">
                                            <div>
                                                <b className="highlight-text">{caller} > {callee}</b>
                                            </div>
                                            <div>
                                                <span className={ callStatusClass }>{ callStatus.state }</span>
                                            </div>
                                            <div>
                                                Start time: <DateTimeFormat timestamp={start_time}/>
                                            </div>
                                            <div>
                                                Call time: {callStatus.call_time} sec
                                            </div>
                                        </div>

                                        <div className="call-info-tools">
                                            <button className="btn btn-success"
                                                    onClick={this.onCallFlowClickHandler.bind(this)}>Call Flow
                                            </button>
                                            <button className="btn btn-success" onClick={this.exportToPCAP.bind(this)}>
                                                Export to PCAP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="call-details gray-bg">
                                        <Tabs>
                                            <Tab title="Legs">
                                                <CallDetails callDetails={callStatus}/>
                                            </Tab>
                                            <Tab title="Messages">
                                                <div className="multiline-content">
                                                    <CallMessagesInfo data={data}/>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                No data loaded
                            </div>
                    }
                </LoadingSpinner>
            </div>
        )
    }
}
CallData.propTypes = {
    onCallFlowClick: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    caller: React.PropTypes.string.isRequired,
    callee: React.PropTypes.string.isRequired
};

@connect(
    null,
    dispatch => (bindActionCreators({
        requestError
    }, dispatch))
)
class CallDetails extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {callDetails} = this.props;
        return (
            <div>
                {
                    callDetails.legs ?
                        <div className="multiline-content">
                            {
                                callDetails.legs.map(leg => (
                                    <div key={leg.dst_host + ":" + leg.src_host} style={{marginBottom: 10}}>
                                        <b className="highlight-text">{leg.src_host} > {leg.dst_host}</b>
                                        <div style={{paddingLeft: 10}}>
                                            <div>
                                                Last response Code: {leg.last_response}
                                            </div>
                                            <div>
                                                Call ID: {leg.call_id}
                                            </div>
                                            <div>
                                                From tag: {leg.from_tag}
                                            </div>
                                            <div>
                                                To tag: {leg.to_tag}
                                            </div>
                                            <div>
                                                From URI: {leg.from_uri}
                                            </div>
                                            <div>
                                                To URI: {leg.to_uri}
                                            </div>
                                            <div>
                                                Request URI: {leg.r_uri}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :
                        <div>
                            No data loaded
                        </div>
                }
            </div>
        )
    }
}
CallDetails.propTypes = {
    callDetails: React.PropTypes.object.isRequired
};
