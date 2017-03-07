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
require('./SearchResults.scss');

require('datatables.net-bs');
require('datatables.net-bs/css/dataTables.bootstrap.css');
require('datatables.net-buttons');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.colVis.js');
require('datatables.net-buttons/js/buttons.print.js');
require('datatables.net-buttons/js/buttons.flash.js');
require('datatables.net-buttons-bs');
require('datatables.net-buttons-bs/css/buttons.bootstrap.css');
require('datatables.net-responsive-bs');
require('datatables.net-select');
require('datatables.net-select-bs/css/select.bootstrap.css');

import "bootstrap/dist/js/bootstrap";
import moment from "moment";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {openPopup} from "../../actions/popupActions";
import {makeSearch} from "../../actions/searchActions";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CallInfo from "../CallInfo/CallInfo";
import Alert from "../Alert/Alert";


@connect(
    state => ({
        search: state.get('search').toJS()
    }),
    null
)
export default class SearchResults extends React.Component {

    constructor(props) {
        super(props);
        this.searchTable = null;

    }

    render() {

        const {isFetching, searchResult, query} = this.props.search;
        const results = searchResult;

        return (
            <div className="box box-success">
                <div className="box-header with-border">
                    <h5 className="box-title">Search Results</h5>
                </div>
                <div className="box-body">
                    <div className="search-results">
                        <LoadingSpinner showSpinner={isFetching}>
                            <ResultsTable />
                            {
                                results && results.length &&
                                <div>
                                    <div className="search-results-total">
                                        Showing {results.length} entries
                                    </div>

                                    {
                                        results.length >= query.queryLimit &&
                                        <MoreResultsButton />
                                    }
                                </div>

                            }
                        </LoadingSpinner>
                    </div>
                </div>
            </div>
        )
    }
}

@connect(
    state => ({
        query: state.get('search').get('query').toJS()
    }),
    dispatch => bindActionCreators({
        makeSearch
    }, dispatch)
)
class MoreResultsButton extends React.Component {
    addLimit() {
        const {makeSearch, query} = this.props;
        query.queryLimit += 200;
        makeSearch(query);
    }

    render() {
        return (
            <button id="more-results-button" className="btn btn-link" onClick={this.addLimit.bind(this)}>More
                results</button>
        )
    }
}

@connect(
    state => ({
        searchResult: state.get('search').get('searchResult').toJS(),
        query: state.get('search').get('query').toJS(),
        searchError: state.get('search').get('error')
    }),
    dispatch => (bindActionCreators({
        openPopup
    }, dispatch))
)
class ResultsTable extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = null;
    }

    componentDidMount() {

        const dropdownTempate = _.template(
            "<div class='dropdown'>" +
            "   <button class='btn btn-link btn-xs phone-search-result' id='<%- phoneId %>' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>" +
            "       <%- number %> " +
            "   </button>" +
            "   <ul class='dropdown-menu' aria-labelledby='<%- phoneId %>'>" +
            "       <li><a href='#' class='add-to-search' data-number='<%- number %>' data-search-field='from'>Search from</a></li>" +
            "       <li><a href='#' class='add-to-search' data-number='<%- number %>' data-search-field='to'>Search to</a></li>" +
            "   </ul>" +
            "</div>"
        );

        const {searchResult} = this.props;

        let columns = [{
            data: 'millis',
            render: (data, type, row) => {
                return moment(data).format('YYYY-MM-DD HH:mm:ss.SS');
            },
        }, {
            data: 'method',
            className: "method"
        }, {
            data: 'caller',
            render: (data, type, row, rowData) => {
                return dropdownTempate({number: data, phoneId: `phone${rowData.row}${rowData.col}`});
            }
        }, {
            data: 'callee',
            render: (data, type, row, rowData) => {
                return dropdownTempate({number: data, phoneId: `phone${rowData.row}${rowData.col}`});
            }
        }];

        const colSize = 12 / columns.length;
        columns = columns.map((col) => {
            col.className = col.className ?
                col.className + ` col-md-${colSize}` : `col-md-${colSize}`;
            return col;
        });


        this.searchTable = $(this.tableRef).DataTable({
            dom: '<"html5buttons"B>lTfgpit',
            // pageLength: 50,
            // lengthChange: true,
            processing: true,
            info: false,
            deferRender: true,
            select: {
                style: 'single',
                className: 'selected-row',
                info: false
            },
            fnDrawCallback: (settings) => {
                //this.forceUpdate();
            },
            // scrollY:        '100vh',
            // scrollCollapse: true,
            paging: false,
            data: searchResult,
            columns: columns,
            createdRow: (row, data, index) => {
                $(row).find("a[data-search-field='to']").click(function (e) {
                    e.preventDefault();
                    $("#input-search-to-user").val($(this).data('number'));

                });

                $(row).find("a[data-search-field='from']").click(function (e) {
                    e.preventDefault();
                    $("#input-search-from-user").val($(this).data('number'));
                })
            },
            buttons: [
                {extend: 'copy', className: "btn-sm"},
                {extend: 'csv', className: "btn-sm"},
                //{extend: 'excel', 'title': 'Tapir'},
                //{extend: 'pdf', title: 'Tapir.pdf'},
                {
                    extend: 'print',
                    className: "btn-sm",
                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');

                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                    }
                }
            ]
        }).on('click', 'tbody td.method', (e) => {

            const selectedRow = $(e.target);
            const data = this.searchTable.row(selectedRow).data();

            const {fromTime, toTime} = this.props.query;
            this.props.openPopup(
                this.searchTable.row(selectedRow)[0][0],
                selectedRow.offset().top - 200,
                selectedRow.offset().left + 50,
                <CallInfo
                    data={{
                        call_ids: data.call_ids,
                        millis: [fromTime, toTime],
                        call: data.method === 'INVITE'
                    }}
                    caller={data.caller}
                    callee={data.callee}
                    start_time={data.millis}
                />,
                "Call Info"
            );
        })
    }

    render() {
        const {searchError} = this.props;
        return (
            <div className="table-responsive">
                {
                    searchError ?
                        <Alert alertType="error">
                            {searchError}
                        </Alert>
                        :

                        <table ref={ref => {
                            this.tableRef = ref
                        }} className="table table-striped table-hover search-table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Caller</th>
                                <th>Callee</th>
                            </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                }
            </div>
        );
    }
}
ResultsTable.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.object)
};