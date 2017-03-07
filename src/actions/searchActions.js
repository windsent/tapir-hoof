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
import keymirror from "keymirror";
import request from "superagent";
import {requestError} from "../actions/errorActions";

export const SearchActionTypes = keymirror({
    SEARCH_REQUEST: null,
    SEARCH_COMPLETE: null,
    SEARCH_ERROR: null
});

export function makeSearch(query) {
    return dispatch => {

        let {
            fromTime,
            toTime,
            fromUser,
            toUser,
            isCallsOnly,
            queryLimit
        } = query;

        dispatch({
            type: SearchActionTypes.SEARCH_REQUEST,
            query
        });

        fromTime = fromTime ? fromTime : null;
        toTime = toTime ? toTime : null;

        return request
            .post('/api/session/search')
            .send({
                millis: [fromTime, toTime],
                caller: fromUser,
                callee: toUser,
                call: isCallsOnly,
                limit: queryLimit
            })
            .end((err, response) => {
                if (err) {

                    dispatch(requestError(
                        response.statusCode,
                        err,
                        response
                    ));
                    return dispatch({
                        type: SearchActionTypes.SEARCH_ERROR,
                        error: `Error ${response.statusCode}: ${err.message}`
                    })
                }

                const searchResult = response.body ? response.body : [];
                console.log("Seach complete");
                console.log(`Found ${ searchResult.length } elements`);

                return dispatch({
                    type: SearchActionTypes.SEARCH_COMPLETE,
                    searchResult
                });
            })

    }
}