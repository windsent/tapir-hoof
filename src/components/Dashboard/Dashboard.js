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
import moment from "moment";
import CountWidget from "../CountWidget/CountWidget";
import LineChartWidget from "../LineChartWidget/LineChartWidget";
import request from "superagent";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {requestError} from "../../actions/errorActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

@connect(
    null,
    dispatch => (bindActionCreators({
        requestError
    }, dispatch))
)
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            metrics: {},
            isMetricsLoading: true,
            metricsLoadingError: null,
            calls: {},
            isCallsLoading: true,
            callsLoadingError: null
        };

        this.reloadIntervalId = null;
    }

    reloadData() {
        this.loadCalls();
        this.loadMetrics();
    }

    componentDidMount() {
        this.reloadData();
        this.reloadIntervalId = setInterval(this.reloadData.bind(this), 60 * 1000);
    }

    loadMetrics() {
        const {requestError} = this.props;
        request
            .get('/api/dashboard/metrics')
            .end((err, response) => {
                this.setState({isMetricsLoading: false});
                if (err) {
                    requestError(
                        response.statusCode,
                        err,
                        response
                    );
                    this.setState({metricsLoadingError: `Error ${response.statusCode}: ${err.message}`});
                    return;
                }

                this.setState({metrics: _.keyBy(response.body, "name")});
            })
    }

    componentWillUnmount() {
        clearInterval(this.reloadIntervalId);
    }

    loadCalls() {
        const {requestError} = this.props;
        request
            .post('/api/dashboard/throughput')
            .send({
                millis: [
                    moment().subtract(3, 'hours').valueOf(),
                    new Date().getTime()
                ]
            })
            .end((err, response) => {
                this.setState({isCallsLoading: false});

                if (err) {
                    requestError(
                        response.statusCode,
                        err,
                        response
                    );
                    this.setState({callsLoadingError: `Error ${response.statusCode}: ${err.message}`});
                    return;
                }

                const calls = {
                    in: [],
                    out: [],
                    timestamp: []
                };

                (response.body || []).forEach(d => {
                    calls.in.push(d.incoming);
                    calls.out.push(d.outgoing);
                    calls.timestamp.push(d.millis);
                });

                this.setState({calls});
            })
    }

    render() {

        const {isMetricsLoading, metricsLoadingError, isCallsLoading, callsLoadingError, metrics, calls} = this.state;

        const asr = metrics['ASR'] || {};
        const _400 = metrics['4xx'] || {};
        const _500 = metrics['5xx'] || {};
        const _600 = metrics['6xx'] || {};

        const callTimestamps = calls.timestamp || [];
        const callInputs = calls.in || [];
        const callOutput = calls.out || [];

        return (
            <div>
                <div className='row'>
                    <div className="col-md-3">
                        <CountWidget
                            isLoading={isMetricsLoading}
                            errorMessage={metricsLoadingError}
                            title="ASR"
                            titleMark={moment(asr.millis).format('YYYY-MM-DD HH:mm')}
                            value={ asr.value }
                            statValue={asr.percentage}
                            statSign={asr.sign}
                            valueDescription="Total @last 5 min"
                            isWarn={asr.warning > 0}
                        />
                    </div>
                    <div className="col-md-3">
                        <CountWidget
                            isLoading={isMetricsLoading}
                            errorMessage={metricsLoadingError}
                            title="4xx"
                            titleMark={moment(_400.millis).format('YYYY-MM-DD HH:mm')}
                            value={_400.value}
                            statValue={_400.percentage}
                            statSign={_400.sign}
                            valueDescription="Total @last 5 min"
                            isWarn={_400.warning > 0}
                        />
                    </div>
                    <div className="col-md-3">
                        <CountWidget
                            isLoading={isMetricsLoading}
                            errorMessage={metricsLoadingError}
                            title="5xx"
                            titleMark={moment(_500.millis).format('YYYY-MM-DD HH:mm')}
                            value={_500.value}
                            statValue={_500.percentage}
                            statSign={_500.sign}
                            valueDescription="Total @last 5 min"
                            isWarn={_500.warning > 0}
                        />
                    </div>
                    <div className="col-md-3">
                        <CountWidget
                            isLoading={isMetricsLoading}
                            errorMessage={metricsLoadingError}
                            title="6xx"
                            titleMark={moment(_600.millis).format('YYYY-MM-DD HH:mm')}
                            value={_600.value}
                            statValue={_600.percentage}
                            statSign={_600.sign}
                            valueDescription="Total @last 5 min"
                            isWarn={_600.warning > 0}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <LoadingSpinner showSpinner={isCallsLoading}>
                            <LineChartWidget
                                title="SIP traffic flow through Core per second"
                                input={callInputs}
                                output={callOutput}
                                error={callsLoadingError}
                                labels={callTimestamps.map(t => moment(t).format("HH:mm"))}
                            />
                        </LoadingSpinner>
                    </div>
                </div>
            </div>
        )
    }
}
