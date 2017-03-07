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

export const PopupActionTypes = keymirror({
    OPEN_POPUP: null,
    CLOSE_POPUP: null,
    SELECT_POPUP: null
});

export function openPopup(popupId, positionY, positionX, content, title = "Popup") {
    return {
        type: PopupActionTypes.OPEN_POPUP,
        popupId,
        positionY,
        positionX,
        title,
        content
    }
}

export function closePopup(popupId) {
    return {
        type: PopupActionTypes.CLOSE_POPUP,
        popupId
    }
}

export function selectPopup(popupId) {
    return {
        type: PopupActionTypes.SELECT_POPUP,
        popupId
    }
}