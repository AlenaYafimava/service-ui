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

define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Backbone = require('backbone');
    var Epoxy = require('backbone-epoxy');
    var Components = require('components');
    var Util = require('util');
    var Storage = require('storageService');
    var Moment = require('moment');
    var App = require('app');
    var UserModel = require('model/UserModel');
    var SingletonRegistryInfoModel = require('model/SingletonRegistryInfoModel');

    require('equalHeightRows');

    var config = App.getInstance();

    var usedComponents = [
        {
            name: 'Spring Framework',
            license: 'Apache License v2.0',
            link: 'http://projects.spring.io/spring-framework/'
        },
        {
            name: 'Mongo DB. Server',
            license: 'GNU AGPL v3.0',
            link: 'http://www.mongodb.org/about/licensing/'
        },
        {
            name: 'Logback',
            license: 'GNU LGPL v2.1 and Eclipse Public License v1.0',
            link: 'http://logback.qos.ch/'
        },
        {
            name: 'Log4J',
            license: 'Apache License v2.0',
            link: 'http://logging.apache.org/log4j/2.x/'
        },
        {
            name: 'SLF4J',
            license: 'MIT License',
            link: 'http://www.slf4j.org/'
        },
        {
            name: 'Apache Commons IO',
            license: 'Apache License v2.0',
            link: 'http://commons.apache.org/proper/commons-io/'
        },
        {
            name: 'JsonPath',
            license: 'Apache License v2.0',
            link: 'https://code.google.com/p/json-path/'
        },
        {
            name: 'Oracle Java and javax extensions',
            license: 'Oracle Binary Code License',
            link: 'http://www.oracle.com/technetwork/java/index.html'
        },
        {
            name: 'Jackson JSON processor',
            license: 'GNU LGPL v2.1 and Eclipse Public License v1.0',
            link: 'http://jackson.codehaus.org/'
        },
        {
            name: 'Guava google',
            license: 'Apache License v2.0',
            link: 'https://code.google.com/p/guava-libraries/'
        },
        {
            name: 'Apache HTTP components',
            license: 'Apache License v2.0',
            link: 'http://hc.apache.org/'
        },
        {
            name: 'Findbugs jsr305',
            license: 'GNU LGPL v2.1 and Eclipse Public License v1.0',
            link: 'http://findbugs.sourceforge.net/'
        },
        {
            name: 'Google Guice',
            license: 'Apache License v2.0',
            link: 'https://code.google.com/p/google-guice/'
        },
        {
            name: 'Google mockwebserver',
            license: 'Apache License v2.0',
            link: 'https://code.google.com/p/mockwebserver/'
        },
        {
            name: 'org.aspectj aspectjrt aspectjweaver',
            license: 'Eclipse Public License - v 1.0',
            link: 'https://eclipse.org/aspectj/'
        },
        {
            name: 'jira-rest-java-client',
            license: 'Apache License v2.0',
            link: 'https://marketplace.atlassian.com/plugins/com.atlassian.jira.jira-rest-java-client'
        },
        {
            name: 'MongoDB java driver',
            license: 'Apache License v2.0',
            link: 'https://github.com/mongodb/mongo-java-driver'
        },
        {
            name: 'Apache Commons FileUpload',
            license: 'Apache License v2.0',
            link: 'http://commons.apache.org/proper/commons-fileupload/'
        },
        {
            name: 'Apache Commons lang3',
            license: 'Apache License v2.0',
            link: 'http://commons.apache.org/proper/commons-lang/'
        },
        {
            name: 'org.apache.tikatika-core',
            license: 'Apache License v2.0',
            link: 'http://tika.apache.org/'
        },
        {
            name: 'Thumbnailator',
            license: 'MIT License',
            link: 'https://code.google.com/p/thumbnailator/'
        },
        {
            name: 'Swagger UI',
            license: 'Apache License v2.0',
            link: 'https://github.com/wordnik/swagger-core'
        },
        {
            name: 'hamcrest',
            license: 'BSD 3',
            link: 'https://code.google.com/p/hamcrest'
        },
        {
            name: 'com.foursquare fongo',
            license: 'Apache License v2.0',
            link: 'https://github.com/fakemongo/fongo'
        },
        {
            name: 'Apache Velocity',
            license: 'Apache License v2.0',
            link: 'http://velocity.apache.org/'
        },
        {
            name: 'org.testng',
            license: 'Apache License v2.0',
            link: 'http://testng.org'
        },
        {
            name: 'jbehave-core',
            license: 'BSD License',
            link: 'https://github.com/jbehave/jbehave-core'
        },
        {
            name: 'jQuery',
            license: 'MIT License',
            link: 'https://jquery.org/'
        },
        {
            name: 'jQuery Cookie',
            license: 'MIT License',
            link: 'https://github.com/carhartl/jquery-cookie'
        },
        {
            name: 'jQuery LazyLoad',
            license: 'MIT License',
            link: 'http://www.appelsiini.net/projects/lazyload'
        },
        {
            name: 'Low Dash',
            license: 'MIT License',
            link: 'http://lodash.com'
        },
        {
            name: 'Underscore',
            license: 'MIT License',
            link: 'http://underscorejs.org/'
        },
        {
            name: 'Moment JS',
            license: 'MIT License',
            link: 'http://momentjs.com/'
        },
        {
            name: 'nProgress',
            license: 'BSD License',
            link: 'http://ricostacruz.com/nprogress/'
        },
        {
            name: 'RequireJS',
            license: 'BSD license',
            link: 'http://github.com/jrburke/requirejs'
        },
        {
            name: 'Bootstrap',
            license: 'MIT License',
            link: 'http://getbootstrap.com/'
        },
        {
            name: 'Bootstrap colorpicker',
            license: 'Apache License v2.0',
            link: 'https://github.com/mjolnic/bootstrap-colorpicker'
        },
        {
            name: 'Material icons',
            license: 'Creative Commons Attribution 4.0 International License (CC-BY 4.0)',
            link: 'https://design.google.com/icons/'
        },
        {
            name: 'Base64 encoder JS',
            license: 'Creative Commons Attribution-2.0',
            link: 'http://www.webtoolkit.info/'
        },
        {
            name: 'BackBoneJS',
            license: 'MIT License',
            link: 'http://backbonejs.org'
        },
        {
            name: 'DateRangePicker',
            license: 'Apache License v2.0',
            link: 'http://www.daterangepicker.com/'
        },
        {
            name: 'ElasticColumns',
            license: 'MIT License',
            link: 'https://github.com/johansatge/elastic-columns'
        },
        {
            name: 'HighlightJS',
            license: 'BSD License',
            link: 'https://highlightjs.org/'
        },
        {
            name: 'Jasmine JS',
            license: 'MIT License',
            link: 'http://jasmine.github.io/2.0/introduction.html'
        },
        {
            name: 'Gridstack.js',
            license: 'MIT License',
            link: 'https://github.com/troolee/gridstack.js'
        },
        {
            name: 'ReportNG',
            license: 'Apache License v2.0',
            link: 'http://reportng.uncommons.org/'
        },
        {
            name: 'Outdated Browser',
            license: 'MIT License',
            link: 'http://outdatedbrowser.com/'
        },
        {
            name: 'Modernizr',
            license: 'MIT License',
            link: 'https://modernizr.com/'
        },
    ];

    var BaseHideableView = Backbone.Epoxy.View.extend({
        destroy: function () {
            this.undelegateEvents();
            this.$el.empty().hide();
            this.unbind();
            delete this.$el;
            delete this.el;
        }
    });

    var MainView = Backbone.View.extend({
        initialize: function (options) {
            this.$el = options.el;
            this.contextName = options.contextName;
            this.$header = null;
            this.$body = null;
            this.canDebug = Util.isAdmin() || !Util.isCustomer();
        },

        render: function () {
            this.$el.empty();
            this.createNavigation();
            this.createMainContainer();
            this.$header = $('#contentHeader', this.$el);
            this.$body = $('#dynamic-content', this.$el);
        },

        update: function (options) {
            this.sideView.update(options);
            this.headerView.update(options);
        },

        createNavigation: function () {
            this.sideView = new SideBar({
                projectUrl: config.project.projectId,
                currentPage: this.contextName,
                canDebug: this.canDebug
            }).render();
            this.footerView = new Footer().render();
            this.headerView = new Header({
                user: config.userModel.toJSON(),
                project: config.project,
                currentPage: this.contextName,
                canDebug: this.canDebug
            }).render();
        },

        createMainContainer: function () {
            this.main = new Container({
                container: this.$el
            });
            this.main.render();
        },

        destroy: function () {
            if (this.main) {
                this.main.destroy();
            }
            this.undelegateEvents();
            this.$el.removeData().unbind();
            this.$el.off().empty();
            this.removeStatics();
        },

        removeStatics: function () {
            this.sideView.destroy();
            this.sideView = null;
            this.footerView.destroy();
            this.footerView = null;
            this.headerView.destroy();
            this.headerView = null;
        }
    });

    var Header = BaseHideableView.extend({
        el: "#topHeader",

        tpl: 'tpl-main-top-header',

        initialize: function (options) {
            // this.user = options.user;
            this.project = options.project;
            this.canDebug = options.canDebug;
            this.currentPage = options.currentPage;
            this.userModel = new UserModel();
        },

        update: function (options) {
            this.clearMemSetState();
            $("#" + options.contextName, this.$el).addClass('active');
            $('[data-id="'+ options.contextName +'"]', this.$el).addClass('active');
        },

        render: function () {
            var ddEl= $("#projectSelector", this.$el);
            var self = this;
            var userAttributes = this.userModel.toJSON();
            this.$el.html(Util.templates(this.tpl, {
                project: this.project,
                currentPage: this.currentPage,
                projects: _.keys(this.userModel.get('projects')).sort(),
                user: userAttributes,
                isAdmin: Util.isAdmin(userAttributes),
                canDebug: this.canDebug,
                util: Util,
            })).show();
            this.contentProjects = $('.user-projects', this.$el);
            this.scrollerProjects = Util.setupBaronScroll(this.contentProjects);
            this.blockHeightProjects = this.scrollerProjects.parent('.baron__root');
            $("#projectSelector", self.$el).on('shown.bs.dropdown', function () {
                var height = self.contentProjects.height();
                if (height > 280) {
                    height = 280;
                    self.blockHeightProjects.addClass('_scrollbar');
                }
                self.blockHeightProjects.height(height)
                    .width(self.contentProjects.width())
                    .addClass('open');
                self.scrollerProjects.addClass('open');

                var currentProject = $('#project-' + self.project.projectId);
                if (currentProject.length) {
                    self.scrollerProjects.scrollTop(currentProject.position().top - 40);
                }
            });
            $("#projectSelector", self.$el)
                .on('hide.bs.dropdown', function () {
                    self.scrollerProjects.removeClass('open');
                    self.blockHeightProjects.removeClass('open').height(0);
                }
            );
            return this;
        },

        events: {
            'click .user-projects a': 'changeProject',
            'click #userNavigator a': 'trackClick',
            'click .mem-set': 'updateMemSet',
            'click #logout': 'onClickLogout',
            'click [data-js-toogle-menu]': 'onClickMenuOpen',
        },

        onClickLogout: function (e) {
            e.preventDefault();
            this.userModel.logout();
        },

        trackClick: function (e) {
            var $link = $(e.currentTarget);
            if ($link.hasClass('user-id')) {
                config.trackingDispatcher.profilePage();
            } else if ($link.hasClass('admin-section')) {
                config.trackingDispatcher.adminPage();
            }
        },

        updateMemSet: function (e) {
            e.preventDefault();
            var $link = $(e.currentTarget);
            var $linkContainer = $link.parent();
            var linkText = $linkContainer.text().trim();

            if ( (linkText != 'Profile') && ($linkContainer.hasClass('active')) ) {
                return;
            }
            $linkContainer.addClass('active');
            config.router.navigate($link.attr('href'), {trigger: true});
        },

        clearMemSetState: function () {
            $('.rp-header-nav > .active', this.$el).removeClass('active');
        },

        openTopMenuItem: function (e) {
            e.preventDefault();

            var $el = $(e.currentTarget);
            config.router.navigate($el.attr('href'), {trigger: true});
        },

        changeProject: function (e) {
            e.preventDefault();
            var $el = $(e.currentTarget);
            var project = $el.attr('data-href');
            if ($el.parent().hasClass('active')) {
                return;
            }
            config.userModel.updateDefaultProject(project);
            config.userModel.set('bts', null);
            config.trackingDispatcher.projectChanged(project);
            config.router.navigate($el.attr('data-href'), {trigger: true});
        },
        onClickMenuOpen: function() {
            $('body').toggleClass('menu-open');
        }
    });

    var SideBar = BaseHideableView.extend({
        el: "#pageSidebar",

        tpl: 'tpl-main-side-bar',

        events: {
            'click .main-menu a': 'closeMenu',
            'click [data-js-sidebar-close]': 'closeMenu'
        },

        initialize: function (options) {
            this.projectUrl = options.projectUrl;
            this.currentPage = options.currentPage;
            this.canDebug = options.canDebug;
        },

        render: function () {
            var param = {
                projectUrl: this.projectUrl,
                userLogin: Storage.getDebugUser() || config.userModel.get('name'),
                canDebug: this.canDebug,
                isAdmin: Util.isAdmin(config.userModel.toJSON()),
                lastActive: this.getLastActive()
            };

            this.$el.html(Util.templates(this.tpl, param)).show();
            $("#" + this.currentPage, this.$el).addClass("active");

            // Util.setupScrollTracker();
            return this;
        },

        getLastActive: function () {
            var lastActive = '';
            var pref = config.preferences;
            var activeUrl = pref.active;

            if (activeUrl && activeUrl.indexOf('\/') > -1) {
                var last = _.last(activeUrl.split('/'));
                var params = _.last(last.split('?'));
                var arrParams = params.split('&');
                var tab = _.find(arrParams, function(t){ return t.indexOf('tab.id=') >=0 });
                var id = tab ? _.last(tab.split('=')) : null;
                lastActive = _.contains(pref.filters, id) ? activeUrl : '';
            }

            return lastActive;
        },

        update: function (options) {
            this.clearActives();
            $("#" + options.contextName, this.$el).addClass('active');
            this.updateUrlsProject(options.projectId);
        },

        updateUrlsProject: function (projectId) {
            _.forEach($(".main-menu a", this.$el), function (link) {
                var $link = $(link);
                var urlArray = $link.attr('href').split('/');
                urlArray[0] = "#" + projectId;
                $link.attr('href', urlArray.join("/"));
            });
        },
        closeMenu: function() {
            $('body').removeClass('menu-open');
        },

        clearActives: function () {
            $(".active", this.$el).removeClass('active');
        }
    });

    var Container = Backbone.View.extend({
        initialize: function (options) {
            this.$container = options.container;
        },

        tpl: 'tpl-container',

        events: {
            'click #btt': 'scrollTop'
        },

        scrollTop: function () {
            $('body,html').animate({
                scrollTop: 0
            }, 100);
            return false;
        },

        render: function () {
            this.$container.append(this.$el.html(Util.templates(this.tpl)));
        },

        destroy: function () {
            this.undelegateEvents();
            this.remove();
        }
    });

    var Footer = BaseHideableView.extend({
        el: "#pageFooter",

        tpl: 'tpl-footer',

        initialize: function () {
            this.viewModel = new SingletonRegistryInfoModel();
        },

        events: {
            'click [data-ja-used-components]': 'onClickUsedComponents'
        },

        onClickUsedComponents: function (e) {
            e.preventDefault();
            Util.getDialog({
                name: 'tpl-used-components-modal',
                data: {
                    usedComponents: usedComponents
                }
            })
            .modal('show');
        },

        render: function () {
            var self = this;

            this.$el.html(Util.templates(this.tpl, {moment: Moment, util: Util})).show();
            this.viewModel.ready
                .done(function() {
                    $('#buildVersion', self.$el).text(self.viewModel.get('uiBuildVersion'));
                });
            Util.setupBaronScroll($('#ComponentsModal .modal-dialog', this.$el));
            return this;
        }
    });

    var NotFoundPage = Backbone.View.extend({
        tpl: 'tpl-404',

        initialize: function (options) {
            this.$el = options.container;
        },

        render: function () {
            this.$el.html(Util.templates(this.tpl, {
                url: config.userModel.getDefaultProjectHash()
            }));
            config.userModel.set({lastInsideHash: config.userModel.getDefaultProjectHash()});
            return this;
        },

        destroy: function () {
            this.undelegateEvents();
            this.$el.empty();
        }
    });

    return {
        MainView: MainView,
        Header: Header,
        SideBar: SideBar,
        Container: Container,
        Footer: Footer,
        NotFoundPage: NotFoundPage
    };
});
