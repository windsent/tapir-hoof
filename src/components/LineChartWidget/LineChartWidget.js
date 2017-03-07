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
import Alert from "../Alert/Alert";
import Chart from "chart.js";

export default class LineChartWidget extends React.Component {

    constructor(props) {
        super(props);
        this.graphCanvas = null;
        this.ctx = null;
        this.lineChart = null;

    }

    componentDidMount() {
        this.ctx = this.graphCanvas.getContext('2d');
    }

    componentDidUpdate() {
        this.lineChart && this.lineChart.destroy();
        this.lineChart = new Chart.Line(this.ctx, {
            data: {
                labels: this.props.labels,
                datasets: [
                    {
                        label: "Out",
                        backgroundColor: "rgba(102, 205, 170, 0.5)",
                        borderColor: "rgba(102, 205, 170, 0.7)",
                        pointColor: "rgba(102, 205, 170, 1)",

                        pointBackgroundColor: "rgba(102, 205, 170, 1)",
                        pointHoverBorderColor: "#fff",
                        pointHoverBorderWidth: 1,
                        data: this.props.output
                    },
                    {
                        label: "In",
                        backgroundColor: "rgba(220,220,220, 0.3)",
                        borderColor: "rgba(220,220,220, 1)",
                        pointColor: "rgba(220,220,220, 1)",

                        pointBackgroundColor: "rgba(220,220,220,1)",
                        pointHoverBorderColor: "#fff",
                        pointHoverBorderWidth: 1,

                        data: this.props.input
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                tooltips: {
                    mode: 'index'
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            color: "rgba(0,0,0,0.05)"
                        },
                        ticks: {
                            beginAtZero: true
                        }

                    }],
                    xAxes: [{
                        gridLines: {
                            color: "rgba(0,0,0,0.05)"
                        }
                    }]
                }
            }
        });
    }

    render() {

        const {error, description, title} = this.props;

        return (
            <div className="box box-success">
                <div className="box-header with-border">
                    <span className="pull-right text-right">
                    {description}
                    </span>
                    <h3 className="box-title no-margins">
                        {title}
                    </h3>
                </div>

                <div className="box-body">
                    {
                        error ?
                            <Alert alertType="error">
                                {error}
                            </Alert>
                            :
                            <div className="row">
                                <div className="col-md-12">
                                    <canvas height="400px" ref={(ref) => {
                                        this.graphCanvas = ref;
                                    }}/>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )

    }
}
LineChartWidget.propTypes = {
    title: React.PropTypes.string.isRequired,
    labels: React.PropTypes.arrayOf(React.PropTypes.string),
    input: React.PropTypes.arrayOf(React.PropTypes.number),
    output: React.PropTypes.arrayOf(React.PropTypes.number),
    error: React.PropTypes.string
};
