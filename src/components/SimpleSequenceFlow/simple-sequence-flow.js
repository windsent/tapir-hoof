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
function SimpleSequenceFlow(elementQuery, inputData) {

    const participants = inputData.participants;
    const links = inputData.links;
    const beforeText = inputData.beforeLinksText;
    const afterText = inputData.afterLinksText;

    const _participantWidth = 150;
    const _participantHeaderHeight = 20;

    const _participantsOffset = (beforeText || afterText) ? 5 : 0;

    function getSVGWidth(participantsCount) {
        const _minWidth = 800;
        if (participantsCount * _participantWidth + _participantsOffset < _minWidth) return _minWidth;
        return participantsCount * _participantWidth + 140 + _participantsOffset;
    }


    const _linkHeight = 40;

    function getSVGHeight(linksCount) {
        return linksCount * _linkHeight + _participantHeaderHeight + _linkHeight;

    }

    const width = getSVGWidth(participants.length);
    const height = getSVGHeight(links.length);

    var svg = d3.select(elementQuery)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('defs')
        .append('marker')
        .attr('id', 'link-arrow')
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('refX', 9)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .attr('markerUnits', 'strokeWidth')
        .append('path')
        .attr('d', 'M0,0 L0,6 L9,3 z')
        .attr('class', 'marker-arrow');

    svg.append('rect')
        .style('fill', 'white')
        .attr('width', width)
        .attr('height', height);

    /* Draw participants */
    const _drawAreaWidth = width - _participantWidth - _participantsOffset;
    const _participantDrawStep = Math.ceil(_drawAreaWidth / (participants.length - 1));
    const _participantMiddle = _participantWidth / 2;

    const _participantsLegs = participants.map(function (p, i) {
        return {key: p.key, xCoord: i * _participantDrawStep + _participantMiddle + _participantsOffset}
    });

    if (beforeText) {
        svg.append('g')
            .attr('transform', 'translate(0, ' + (_participantHeaderHeight + 20) + ')')
            .append('text')
            .text(beforeText)
            .attr('class', 'pre-post-text')
    }


    // Draw Participants
    const _gParticipants = svg.selectAll('g.participant')
        .data(_participantsLegs)
        .enter()
        .append('g')
        .attr('class', 'participant')
        .attr('transform', function (d, i) {
            var moveX = d.xCoord - _participantMiddle;
            return 'translate(' + moveX + ',0)';
        });

    _gParticipants.append('text')
        .attr('class', 'participant-text')
        .text(function (d) {
            return d.key
        })
        .attr('x', _participantMiddle)
        .attr('y', _participantHeaderHeight - 5)
        .attr('text-anchor', 'middle');

    _gParticipants.append('line')
        .attr("class", "underline")
        .attr('x1', 0)
        .attr('y1', _participantHeaderHeight)
        .attr('x2', _participantWidth)
        .attr('y2', _participantHeaderHeight);


    _gParticipants.append('line')
        .attr("class", "leg")
        .attr('x1', _participantMiddle)
        .attr('y1', _participantHeaderHeight)
        .attr('x2', _participantMiddle)
        .attr('y2', '100%');


    const _pIndexedLegs = {};
    _participantsLegs.forEach(function (leg) {
        _pIndexedLegs[leg['key']] = leg;
    });

    const _linksData = links.map(function (l, i) {
        return {
            x1: _pIndexedLegs[l.from].xCoord,
            x2: _pIndexedLegs[l.to].xCoord,
            y: i * _linkHeight + _participantHeaderHeight + _linkHeight,
            text: l.text,
            textAlign: l.textAlign || 'center',
            leftLabel: l.leftLabel,
            textOnClick: l.textOnClick
        }
    });


    _linksData.forEach(function (d) {

        var _linkGroup = svg.append('g')
            .attr('class', 'link');

        //lines
        _linkGroup.append('line')
            .attr('class', 'link-wrap-line')
            .attr('x1', d.x1)
            .attr('y1', d.y)
            .attr('x2', d.x2)
            .attr('y2', d.y)
            .attr('stroke', 'white')
            .attr('stroke-width', '10');

        _linkGroup.append('line')
            .attr('class', 'link-line')
            .attr('x1', d.x1)
            .attr('y1', d.y)
            .attr('x2', d.x2)
            .attr('y2', d.y)
            .attr('marker-end', 'url(#link-arrow)');

        // main text
        if (d.text) {
            const mainLabel = _linkGroup.append('g')
                .attr('class', 'link');

            var rect = mainLabel.append('rect')
                .style('fill', 'white');

            var text = mainLabel.append('text')
                .text(d.text)
                .attr('dy', '1em')
                .attr('class', 'link-text');

            if (d.textOnClick) {
                text.on('click', function () {
                    d.textOnClick(d3.event);
                })
                    .on('mouseenter', function () {
                        d3.select(this).attr('class', 'link-text link-text-hover')
                    })
                    .on('mouseleave', function () {
                        d3.select(this).attr('class', 'link-text')
                    })
            }

            var textSize = text.node().getBBox();

            var rectSize = rect.attr('width', textSize.width)
                .attr('height', textSize.height)
                .node()
                .getBBox();

            var _translateCoords = [null, d.y - rectSize.height - 5];
            switch (d.textAlign) {
                case 'left':
                    var minCoord = d.x1 < d.x2 ? d.x1 : d.x2;
                    _translateCoords[0] = minCoord + 10;
                    break;
                case 'right':
                    var maxCoord = d.x2 > d.x1 ? d.x2 : d.x1;
                    _translateCoords[0] = maxCoord - rectSize.width - 10;
                    break;
                case 'center':
                default:
                    _translateCoords[0] = (d.x1 + d.x2) / 2 - rectSize.width / 2;
            }
            mainLabel.attr('transform', 'translate(' + _translateCoords.join(',') + ')')
        }

        if (d.leftLabel) {
            const leftLabel = _linkGroup.append('g')
                .attr('class', 'left-link-label');

            var labelText = leftLabel.append('text')
                .attr('class', 'left-link-label-text')
                .text(d.leftLabel);

            var labelSize = labelText.node().getBBox();
            // FIXME: remove duplication
            var leftCoord = d.x1 < d.x2 ? d.x1 : d.x2;

            leftLabel.attr('transform', 'translate(' + [leftCoord - labelSize.width - 5, d.y] + ')')
        }

    });

    if (afterText) {
        svg.append('g')
            .attr('transform', 'translate(0, ' + ( height - 20 ) + ')')
            .append('text')
            .text(afterText)
            .attr('class', 'pre-post-text')
    }
}
module.exports = SimpleSequenceFlow;












