(function() {
'use strict';

    angular
        .module('awt-client')
        .controller('EventController', EventController);

    EventController.inject = ['$stateParams', '$log', '_', 'eventService', 'dashboardService', 'commentService', '$localStorage', 'userService', '$timeout'];
    function EventController($stateParams, $log, _, eventService, dashboardService, commentService, $localStorage, userService, $timeout) {
        var eventVm = this;

        /** index of active tab */
        eventVm.activeTab = 0;
        /** active Event object */
        eventVm.event = {};
        /** application on which Event is attached */
        eventVm.app = {};
        /** comments on which reply is available */
        eventVm.availableReplies = [];
        /** text value of the comment attached directly to Event */
        eventVm.newCommentText = "";
        /** active user - for commenting purpose */
        eventVm.activeUser = {};
        /** all events that belong to the same fragment as active Event */
        eventVm.fragmentEvents = [];
        /** prepared date for chart display */
        eventVm.timespan = [];
        /** total number of events that belong to same fragment */
        eventVm.eventFragmentCount = 0;

        /** public methods */
        eventVm.getEvent = getEvent;
        eventVm.createCommentOnComment = createCommentOnComment;
        eventVm.createCommentOnEvent = createCommentOnEvent;
        eventVm.showFragmentTimespan = showFragmentTimespan;

        activate();

        function activate() {
            eventVm.getEvent($stateParams.eventId);
            userService.getUser($localStorage.user)
                .then(function(response) {
                    eventVm.activeUser = response.data;
                })
                .catch(function(error) {
                    $log.warn(error);
                });
            initChart();
        };

        /**
         * Retireves Event
         * 
         * @param {string} eventId  ID of the event
         */
        function getEvent(eventId) {
            eventService.getEvent(eventId)
                .then(function(response) {
                    eventVm.event = response.data;
                    getApp();
                    _.forEach(eventVm.event.comments, function(value) {
                        eventVm.availableReplies[value._id] = '';
                    });
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };

        /**
         * Retrieves Application on which Event is attached.
         */
        function getApp() {
            dashboardService.getApp(eventVm.event.applicationId)
                .then(function(response) {
                    eventVm.app = response.data;
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };

        /**
         * Creates subcomment.
         * 
         * @param {string} parentId ID of the parent comment
         */
        function createCommentOnComment(parentId) {
            var newComment = {
                "text": eventVm.availableReplies[parentId],
                "createdAt": _.now(),
                "signedBy": eventVm.activeUser._id
            };
            if (eventVm.availableReplies[parentId] != '') {
                commentService.createCommentOnComment(parentId, newComment)
                    .then(function(response) {
                        eventVm.availableReplies[parentId] = "";
                        activate();
                    })
                    .catch(function(error) {
                        $log.warn(error);
                    });
            } else {
                // erase enter
                eventVm.availableReplies[parentId] = '';
            };
        };


        /**
         * Creates comment on the event.
         */
        function createCommentOnEvent() {
            var newComment = {
                "text": eventVm.newCommentText,
                "createdAt": _.now(),
                "signedBy": eventVm.activeUser._id
            };
            if (eventVm.newCommentText != '') {
                commentService.createCommentOnEvent(eventVm.event._id, newComment)
                    .then(function(response) {
                        eventVm.newCommentText = "";
                        activate();
                    })
                    .catch(function(error) {
                        $log.warn(error);
                    });
            } else {
                // erase enter
                eventVm.newCommentText = '';
            };
        };

        /**
         * Checks if chart is initialized, if not initializes it.
         */
        function initChart() {
            if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined')) {
                // load for first time if needed
                google.charts.load("current", {packages:["calendar", 'corechart']});
                // set a callback to run when the Google Visualization API is loaded.
                google.charts.setOnLoadCallback(eventVm.showFragmentTimespan);
            } else {
                // redraw on every call
                angular.element(document).ready(function () {
                    eventVm.showFragmentTimespan();
                });
            };
        };

        /**
         * Gathers Events by Fragment and prepares for chart displaying.s
         */
        function showFragmentTimespan() {
            eventService.getEventsByFragment(eventVm.event.applicationId, eventVm.event.fragment)
                .then(function(response) {
                    eventVm.fragmentEvents = response.data;
                    var timespanData = [];
                    _.forEach(eventVm.fragmentEvents, function(value) {
                        var d = new Date(value.time);
                        var just_day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                        var timestamp_key = just_day.getTime();
                        if (timespanData[timestamp_key] == null) {
                            timespanData[timestamp_key] = 1;
                        } else {
                            var newValue = timespanData[timestamp_key] + 1;
                            timespanData[timestamp_key] = newValue;
                        };
                    });
                    eventVm.timespan = timespanData;
                    drawChart();
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };

        /**
         * Draws Google Calendar chart.
         */
        function drawChart() {
            var data = new google.visualization.DataTable();
            data.addColumn('date', 'Date');
            data.addColumn('number', 'Number of events');
            var rows = [];
            eventVm.eventFragmentCount = 0;
            for (var key in eventVm.timespan) {
                rows.push([{v:new Date(parseInt(key))}, eventVm.timespan[key]]);
                eventVm.eventFragmentCount = eventVm.eventFragmentCount + eventVm.timespan[key];
            }

            eventVm.message = 'Total number of Events in this Fragment: ' + eventVm.eventFragmentCountFragEvents;

            data.addRows(rows);
            var options = {
                title: 'Fragment: ' + eventVm.event.fragment,
                height: 400,
                width: 800
            };
            
            // prevent drawing chart when its container is not rendered
            if (eventVm.activeTab == 2) {
                var chart = new google.visualization.Calendar(document.getElementById('chart_div'));
                chart.draw(data, options);
            };
        };
        
    }
})();