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
    var LandingPage = require('landingPage'),
        Backbone = require('backbone');

    var instance = null;
    var LandingController = function(){
        if(instance) return instance;
        instance = this;
        _.extend(this,  Backbone.Events);
        this.landingPage = null;
        
        this.showLanding = function(){
            $('.js-wrapper, #pageFooter').addClass("hide");
            if(this.landingPage) return;
            this.landingPage = new LandingPage();
            $('#main_content').prepend(this.landingPage.$el);
            this.trigger('onRenderLanding', this.landingPage);
        };
        this.showParallax = function() {
            this.showLanding();
            this.landingPage.showParallax();
        };
        this.hideLanding = function() {
            $('.js-wrapper, #pageFooter').removeClass("hide");
            if(!this.landingPage) return;
            this.landingPage.hide();
            this.landingPage.remove();
            this.landingPage = null;
            this.trigger('onHideLanding', this);
        };
        this.showDocumentation = function(id) {
            this.showLanding();
            this.landingPage.showDocumentation(id);
        };
        this.openLogin = function(){
            if(!this.landingPage) return;
            this.landingPage.showLoginBlock();
        };
        this.isShow = function(){
            return !!this.landingPage;
        }
    };


    return LandingController;
});