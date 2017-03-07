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
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import request from "superagent";
import SimpleSequenceFlow from "../SimpleSequenceFlow/simple-sequence-flow";
import {openPopup} from "../../actions/popupActions";
import moment from "moment";
import SaveAsPNG from "save-svg-as-png";
import {requestError} from "../../actions/errorActions";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "d3";
import toId from "to-id";
import "./CallFlow.scss";
import "./CallFlowMessage.scss";
import "../SimpleSequenceFlow/simple-sequence-flow.css";

@connect(null,
    dispatch => (bindActionCreators({
        openPopup,
        requestError
    }, dispatch))
)
export default class CallFlow extends React.Component {

    constructor(props) {
        super(props);
        this.divRef = null;
        this.state = {
            isLoading: false,
            error: null
        }
    }

    componentDidMount() {

        const {requestError, data} = this.props;

        this.setState({isLoading: true});

        request
            .post('/api/session/flow')
            .send(data)
            .end((err, response) => {
                this.setState({isLoading: false});
                if (err) {
                    this.setState({error: `Error ${response.statusCode}: ${err.message}`});
                    requestError(
                        response.statusCode,
                        err,
                        response
                    );
                    return;
                }
                this.buildFlow(response.body);
            });
    }

    buildFlow(data) {

        const {openPopup} = this.props;

        var prevTimestamp = null;
        var inputData = {
            beforeLinksText: moment(data.messages[0].millis).format('HH:mm:ss.SSS'),
            afterLinksText: moment(data.messages[data.messages.length - 1].millis).format('HH:mm:ss.SSS'),
            participants: data.hosts.map(function (p) {
                return {key: p}
            }),
            links: data.messages.map(function (l, i) {

                let text = [i + 1 + '.', l.method, l.description].join(' ');

                var ret = {
                    from: l.src_host,
                    to: l.dst_host,
                    text,
                    leftLabel: prevTimestamp ? '+' + (l.millis - prevTimestamp).toString() + ' ms' : null,
                    textAlign: 'left',
                    textOnClick: function (e) {

                        const {left, top} = $(e.target).offset();

                        openPopup(
                            `message-${toId(`${l.src_host}-${l.dst_host}-${l.millis}`)}-${i}`,
                            top - 50,
                            left - 150,
                            <CallFlowMessage messageData={l}/>,
                            text
                        )
                    }
                };

                prevTimestamp = l.millis;
                return ret;
            })
        };

        SimpleSequenceFlow(this.divRef, inputData);
    }

    onDetailsClickHandler() {
        this.props.onDetailsClick()
    }

    saveAsPng() {
        SaveAsPNG.saveSvgAsPng($(this.divRef).find('svg')[0], "callflow.png");
    }

    render() {
        const {error} = this.state;
        return (
            <div className="call-flow-wrapper">

                <div className="call-flow" ref={ref => {
                    this.divRef = ref;
                }}>
                </div>
                <LoadingSpinner showSpinner={this.state.isLoading}>
                    {
                        error &&
                        <Alert alertType="error">
                            {error}
                        </Alert>
                    }
                    <div className="control-buttons">
                        <button className="btn btn-success" onClick={this.onDetailsClickHandler.bind(this)}>Details
                        </button>
                        {
                            !error &&
                            <button className="btn btn-success" onClick={this.saveAsPng.bind(this)}>Save as PNG</button>
                        }

                    </div>
                </LoadingSpinner>
            </div>
        )
    }
}
CallFlow.propTypes = {
    data: React.PropTypes.object.isRequired,
    onDetailsClick: React.PropTypes.func.isRequired
};


class CallFlowMessage extends React.Component {

    render() {

        const {messageData} = this.props;


        let payload = _.escape(messageData.payload);
        messageData.highlights.forEach(q => {
            payload = payload.replace(q, '<b class="highlight-text">' + q + '</b>');
        });
        return (
            <div className="call-flow-message">
                <div>
                    <div className="call-flow-message-header">
                        <div>{moment(messageData.timestamp).format('YYYY-MM-DD HH:mm:ss.SS')}</div>
                        <div>{messageData.src_host} > {messageData.dst_host}</div>
                    </div>
                    <div className="call-flow-message-content">
                        <div dangerouslySetInnerHTML={{
                            __html: payload
                        }}></div>
                    </div>
                </div>
            </div>
        )
    }
}
CallFlowMessage.propTypes = {
    messageData: React.PropTypes.object.isRequired
};