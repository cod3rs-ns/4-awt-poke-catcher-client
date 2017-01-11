(function() {
'use strict';

    angular
        .module('awt-client')
        .controller('EventController', EventController);

    EventController.inject = ['$stateParams', '$log', '_', 'eventsService', 'dashboardService', 'commentsService'];
    function EventController($stateParams, $log, _, eventsService, dashboardService, commentsService) {
        var eventVm = this;
        eventVm.event = {};
        eventVm.app = {};
        eventVm.availableReplies = [];
        eventVm.newCommentText = "";

        eventVm.getEvent = getEvent;
        eventVm.createCommentOnComment = createCommentOnComment;
        eventVm.createCommentOnEvent = createCommentOnEvent;

        activate();

        ////////////////

        function activate() {
            eventVm.getEvent($stateParams.eventId);
        };

        function getEvent(eventId) {
            eventsService.getEvent(eventId)
                .then(function(response) {
                    eventVm.event = response.data;
                    getApp();
                    _.forEach(eventVm.event.comments, function(value) {
                        eventVm.availableReplies[value._id] = '';
                    });
                    console.log(eventVm.availableReplies);
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };

        function getApp() {
            dashboardService.getApp(eventVm.event.applicationId)
                .then(function(response) {
                    eventVm.app = response.data; 
                    console.log(eventVm.app);
                })
                .catch(function(error) {
                    $log.warn(error);
                });
        };

        function createCommentOnComment(parentId) {
            var newComment = {
                "text": eventVm.availableReplies[parentId],
                "createdAt": _.now(),
                "signedBy": "587665f6315be810041fe8c9"
            };
            if (eventVm.availableReplies[parentId] != '') {
                commentsService.createCommentOnComment(parentId, newComment)
                    .then(function(response) {
                        console.log(response.data);
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

        function createCommentOnEvent() {
            var newComment = {
                "text": eventVm.newCommentText,
                "createdAt": _.now(),
                "signedBy": "587665f6315be810041fe8c9"
            };
            if (eventVm.newCommentText != '') {
                commentsService.createCommentOnEvent(eventVm.event._id, newComment)
                    .then(function(response) {
                        console.log(response.data);
                        eventVm.newCommentText = "";
                        activate();
                    })
                    .catch(function(error) {
                        $log.warn(error);
                    });
            } else {
                // erase enter
                eventVm.newCommentText = '';
            }
        };
        
    }
})();