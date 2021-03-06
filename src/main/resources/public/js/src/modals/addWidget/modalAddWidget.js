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

define(function (require) {
    'use strict';

    var Epoxy = require('backbone-epoxy');
    var ModalView = require('modals/_modalView');
    var Util = require('util');
    var $ = require('jquery');
    var _ = require('underscore');
    var WidgetService = require('newWidgets/WidgetService');
    var SelectWidgetView = require('modals/addWidget/SelectWidgetView');
    var ConfigureWidgetView = require('modals/addWidget/ConfigureWidgetView');
    var SaveWidgetView = require('modals/addWidget/SaveWidgetView');
    var PreviewWidgetView = require('newWidgets/PreviewWidgetView');
    var DashboardCollection = require('dashboard/DashboardCollection');
    var Service = require('coreService');
    var Urls = require('dataUrlResolver');
    var App = require('app');

    var config = App.getInstance();


    var ModalAddWidget = ModalView.extend({
        template: 'tpl-modal-add-widget',
        className: 'modal-add-widget',

        events: {
            'click [data-js-previous-first-step]': 'onClickFirstStep',
            'click [data-js-next-second-step]': 'onClickSecondStep',
            'click [data-js-next-last-step]': 'onClickLastStep',
            'click [data-js-previous-second-step]': 'onClickSecondStep',
            'click [data-js-add-widget]': 'onClickAddWidget',
            'click [data-js-close]': 'onClickClose'
        },
        bindings: {
            '[data-js-widget-type]': 'text: gadgetName',
            '[data-js-widget-description]': 'html: gadgetDescription',
            '[data-js-next-second-step]': 'attr: {disabled: any(not(gadget), disableNavigate)}',
            '[data-js-next-last-step]': 'attr: {disabled: any(not(gadgetIsFilterFill), disableNavigate)}',
            '[data-js-previous-first-step]': 'attr: {disabled:  disableNavigate}',
            '[data-js-add-widget]': 'attr: {disabled: any(not(name),disableNavigate)}'
        },

        initialize: function (options) {
            if (!options.model) { return; }
            this.model.set({ owner: config.userModel.get('name') });
            this.dashboardModel = options.dashboardModel;
            this.isNoDashboard = options.isNoDashboard;
            options.filter_id && this.model.set('filter_id', options.filter_id);
            this.curWidget = WidgetService.getWidgetConfig(this.model.get('gadget'));
            this.viewModel = new (Epoxy.Model.extend({
                defaults: { step: 1, disableNavigate: false }
            }))();
            this.render();
            this.selectWidgetView = new SelectWidgetView({ model: this.model });
            $('[data-js-step-1]', this.$el).html(this.selectWidgetView.$el);
            this.configureWidgetView = new ConfigureWidgetView({ model: this.model });
            $('[data-js-step-2]', this.$el).html(this.configureWidgetView.$el);
            this.saveWidget = new SaveWidgetView({
                model: this.model,
                dashboardModel: this.dashboardModel,
                isNoDashboard: this.isNoDashboard
            });
            $('[data-js-step-3]', this.$el).html(this.saveWidget.$el);
            this.listenTo(this.viewModel, 'change:step', this.setState);
            this.listenTo(this.configureWidgetView, 'disable:navigation', this.onChangeDisableNavigation);
            this.listenTo(this.saveWidget, 'disable:navigation', this.onChangeDisableNavigation);
            this.listenTo(this.saveWidget, 'change::dashboard', this.onChangeDashboard);
            this.setState();
            this.listenTo(
                this.model,
                'change:gadget change:widgetOptions change:content_fields change:filter_id change:itemsCount',
                _.debounce(this.onChangePreview, 10)
            );
        },
        onClickClose: function () {
            config.trackingDispatcher.trackEventNumber(290);
        },
        onChangePreview: function (model) {
            this.curWidget = WidgetService.getWidgetConfig(model.get('gadget'));
            this.previewWidgetView && this.previewWidgetView.destroy();
            this.previewWidgetView = new PreviewWidgetView({
                model: this.model,
                filterModel: this.configureWidgetView.getSelectedFilterModel()
            });
            $('[data-js-widget-preview]', this.$el).html(this.previewWidgetView.$el);
        },
        render: function () {
            this.$el.html(Util.templates(this.template, {}));
        },
        onChangeDisableNavigation: function (state) {
            this.viewModel.set({ disableNavigate: state });
        },
        setState: function () {
            $('[data-js-step-1-title], [data-js-step-2-title], [data-js-step-3-title]', this.$el).removeClass('active visited');
            $('[data-js-step-1], [data-js-step-2], [data-js-step-3]', this.$el).removeClass('active');
            $('[data-js-next-second-step], [data-js-previous-first-step],[data-js-next-last-step], [data-js-previous-second-step],[data-js-add-widget]', this.$el).addClass('hide');
            switch (this.viewModel.get('step')) {
            case 1:
                $('[data-js-step-1-title], [data-js-step-1]', this.$el).addClass('active');
                $('[data-js-next-second-step]', this.$el).removeClass('hide');
                break;
            case 2:
                $('[data-js-step-1-title]', this.$el).addClass('visited');
                $('[data-js-step-2-title], [data-js-step-2]', this.$el).addClass('active');
                $('[data-js-previous-first-step],[data-js-next-last-step]', this.$el).removeClass('hide');
                this.configureWidgetView.activate();
                break;
            case 3:
                $('[data-js-step-1-title], [data-js-step-2-title]', this.$el).addClass('visited');
                $('[data-js-step-3-title], [data-js-step-3]', this.$el).addClass('active');
                $('[data-js-previous-second-step],[data-js-add-widget]', this.$el).removeClass('hide');
                this.saveWidget.activate();
                break;
            default:
                break;
            }
        },
        onClickFirstStep: function () {
            config.trackingDispatcher.trackEventNumber(301);
            this.viewModel.set('step', 1);
        },
        onClickSecondStep: function () {
            config.trackingDispatcher.trackEventNumber(292);
            this.viewModel.set('step', 2);
        },
        onClickLastStep: function () {
            if (this.configureWidgetView.validate()) {
                this.viewModel.set('step', 3);
            }
        },
        onChangeDashboard: function (model) {
            this.dashboardModel = model;
        },
        onKeySuccess: function () {
            switch (this.viewModel.get('step')) {
            case 1:
                $('[data-js-next-second-step]:not(.hide)', this.$el).focus().trigger('click');
                break;
            case 2:
                if (($('[data-js-next-last-step]:not(.hide)', this.$el).length)) {
                    $('[data-js-next-last-step]:not(.hide)', this.$el).focus().trigger('click');
                }
                break;
            case 3:
                $('[data-js-add-widget]:not(.hide)', this.$el).focus().trigger('click');
                break;
            default:
                break;
            }
        },
        checkNewDashboard: function () {
            var async = $.Deferred();
            var collection;
            if (this.dashboardModel.get('id') !== 'temp') {
                async.resolve();
            } else {
                collection = new DashboardCollection({ startId: 0 });
                collection.ready.resolve();
                collection.add(this.dashboardModel);
                this.listenToOnce(this.dashboardModel, 'change:id', function () { async.resolve(); });
            }
            return async;
        },
        onClickAddWidget: function () {
            var self = this;
            var contentParameters = {};
            var data = {};
            if (this.saveWidget.validate()) {
                config.trackingDispatcher.trackEventNumber(314);
                this.$el.addClass('load');
                if (!_.contains(['unique_bug_table', 'activity_stream', 'launches_table'], this.model.get('gadget'))) {
                    contentParameters.metadata_fields = ['name', 'number', 'start_time'];
                }
                if (this.model.get('gadget') === 'most_failed_test_cases') {
                    contentParameters.metadata_fields = ['name', 'start_time'];
                }
                contentParameters.type = this.curWidget.widget_type;
                contentParameters.gadget = this.model.get('gadget');
                contentParameters.itemsCount = this.model.get('itemsCount');
                if (this.model.getContentFields().length) {
                    contentParameters.content_fields = this.model.getContentFields();
                }
                contentParameters.widgetOptions = this.model.getWidgetOptions();
                data = {
                    filter_id: this.model.get('filter_id'),
                    name: this.model.get('name').trim(),
                    share: this.model.get('share'),
                    content_parameters: contentParameters
                };
                if (this.model.get('description')) {
                    data.description = this.model.get('description');
                }
                this.checkNewDashboard().done(function () {
                    Service.saveWidget(data)
                        .done(function (responce) {
                            self.model.set({ id: responce.id });
                            self.dashboardModel.addWidget(self.model).done(function () {
                                if (self.isNoDashboard) {
                                    config.router.navigate(Urls.redirectToDashboard(self.dashboardModel.get('id')), { trigger: true });
                                }
                            });
                            self.successClose(responce.id);
                        })
                        .fail(function (error) {
                            Util.ajaxFailMessenger(error, 'widgetSave');
                        });
                });
            }
        },
        onDestroy: function () {
            this.selectWidgetView && this.selectWidgetView.destroy();
            this.configureWidgetView && this.configureWidgetView.destroy();
            this.saveWidget && this.saveWidget.destroy();
        }

    });

    return ModalAddWidget;
});
