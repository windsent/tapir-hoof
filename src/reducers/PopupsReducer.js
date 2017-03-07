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
import {Map, List} from "immutable";
import {PopupActionTypes} from "../actions/popupActions";

const defaultState = Map({
    popupsList: List(),
    activePopup: null
});

export default function popups(state = defaultState, action) {
    let popupsList = state.get('popupsList');
    switch (action.type) {
        case PopupActionTypes.OPEN_POPUP: {
            const indx = popupsList.findIndex((p) => (action.popupId === p.get('popupId')));
            if (indx !== -1) {
                return state;
            }
            popupsList = popupsList.push(Map({
                popupId: action.popupId,
                positionY: action.positionY,
                positionX: action.positionX,
                title: action.title,
                content: action.content
            }));
            return state
                .set('activePopup', action.popupId)
                .set('popupsList', popupsList);
        }

        case PopupActionTypes.CLOSE_POPUP: {
            const indx = popupsList.findIndex((p) => (action.popupId === p.get('popupId')));
            if (indx === -1) {
                console.log(`Popup with id ${action.popupId} not found`);
                break;
            }
            popupsList = popupsList.delete(indx);

            const activePopup = popupsList.last() ? popupsList.last().get('popupId') : null;
            return state
                .set('popupsList', popupsList)
                .set('activePopup', activePopup);
        }
        case PopupActionTypes.SELECT_POPUP:
            return state.set('activePopup', action.popupId);

    }
    return state;

}
