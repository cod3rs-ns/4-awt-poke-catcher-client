(function() {
'use strict';

    angular
        .module('awt-client')
        .controller('EventController', EventController);

    EventController.inject = ['$stateParams', '$log', '_', 'eventService', 'dashboardService', 'commentService', '$localStorage', 'userService'];
    function EventController($stateParams, $log, _, eventService, dashboardService, commentService, $localStorage, userService) {
        var eventVm = this;

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

        /** public methods */
        eventVm.getEvent = getEvent;
        eventVm.createCommentOnComment = createCommentOnComment;
        eventVm.createCommentOnEvent = createCommentOnEvent;

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
        
    }
})();