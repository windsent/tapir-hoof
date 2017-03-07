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
import {Map, fromJS} from "immutable";
import {SearchActionTypes} from "../actions/searchActions";

const defaultState = Map({
    query: Map({
        fromUser: null,
        toUser: null,
        fromTime: null,
        toTime: null,
        isCallsOnly: true,
        queryLimit: 200
    }),
    isFetching: false,
    searchResult: Map(),
    error: null
});

export default function search(state = defaultState, action) {

    switch (action.type) {
        case SearchActionTypes.SEARCH_REQUEST:
            const query = state.get('query').merge(fromJS(action.query));
            return state
                .set('isFetching', true)
                .set('query', query)
                .set('error', null)
                .set('searchResult', Map());

        case SearchActionTypes.SEARCH_COMPLETE:
            return state
                .set('isFetching', false)
                .set('searchResult', fromJS(action.searchResult));

        case SearchActionTypes.SEARCH_ERROR:
            return state
                .set('isFetching', false)
                .set('error', fromJS(action.error));
        default:
            return state
    }

}
