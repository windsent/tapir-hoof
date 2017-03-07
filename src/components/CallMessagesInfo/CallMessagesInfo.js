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
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import request from "superagent";
import DateTimeFormat from "../DateTimeFormat/DateTimeFormat";
import Alert from "../Alert/Alert";
import {requestError} from "../../actions/errorActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

@connect(
    null,
    dispatch => (bindActionCreators({
        requestError
    }, dispatch))
)
export default class CallMessagesInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            messages: null,
            error: null
        }

    }

    componentDidMount() {
        this.loadMessage();
    }


    loadMessage() {
        const {requestError} = this.props;
        console.log("Loading message");
        this.setState({isLoading: true});
        request
            .post("/api/session/flow")
            .send(this.props.data)
            .end((err, response) => {
                this.setState({isLoading: false});
                if (err) {
                    this.setState({error: `Error ${response.statusCode}: ${err.message}`})
                    requestError(
                        response.statusCode,
                        err,
                        response
                    );
                }

                this.setState({messages: response.body});
            })
    }


    render() {

        const {isLoading, messages, error} = this.state;

        return (
            <div>
                <LoadingSpinner showSpinner={isLoading}>
                    {
                        error &&
                        <Alert alertType="error">
                            {error}
                        </Alert>
                    }
                    {
                        messages && messages.messages.map((message, i) => (
                            <div key={i}>
                                <div>
                                    <b className="highlight-text">{i + 1}. <DateTimeFormat
                                        timestamp={message.timestamp}/></b>
                                </div>
                                <div>
                                    <b className="highlight-text">{message.src_host} > {message.dst_host}</b>
                                </div>
                                <div dangerouslySetInnerHTML={{
                                    __html: _.escape(message.payload) || ""
                                }}></div>
                            </div>
                        ))
                    }
                </LoadingSpinner>
            </div>
        )
    }
}

CallMessagesInfo.propTypes = {
    data: React.PropTypes.object.isRequired
};


