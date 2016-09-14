/*
 * Copyright 2016 EPAM Systems
 * 
 * 
 * This file is part of EPAM Report Portal.
 * https://github.com/epam/ReportPortal
 * 
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */ 
'use strict';

define(function(require, exports, module) {
    var _LandingSection = require('landing/_LandingSection')

    var LandingSectionDistributionView = _LandingSection.extend({
        id: 'distributionOfFails',
        className: 'b-common clearfix',
        tpl: 'tpl-landing-section-distribution',

        changeScroll: function(scrollTop, scrollBlock){
            if(scrollBlock > 400){
                this.showAndAnimateElements($('.js-commonel', this.$el));
                return true;
            }
        }
    });

    return LandingSectionDistributionView;
});