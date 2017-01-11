(function() {
    'use strict';

    angular
        .module('awt-client')
        .service('commentsService', commentsService);

    commentsService.$inject = ['$http', 'CONFIG'];

    function commentsService($http, CONFIG) {
        var service = {
          getComment: getComment,
          createCommentOnComment: createCommentOnComment,
          createCommentOnEvent: createCommentOnEvent
        };

        return service;

        /**
         * Retreives single Event from the server.
         * 
         * @param {string} commentId     ID of the Event
         * @returns response
         */
        function getComment(commentId) {
            return $http.get(CONFIG.SERVICE_URL + '/comments/' + commentId)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-retrieve-event';
                });
        };


        /**
         * Creates subcomment.
         * 
         * @param {string}  parentId        ID of parent comment
         * @param {Comment} newComment      comment to be created
         * @returns response
         */
        function createCommentOnComment(parentId, newComment) {
            return $http.post(CONFIG.SERVICE_URL + '/comments/' + parentId, newComment)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-create-comment';
                });            
        };
        
        
        /**
         * Creates new comment on Event
         * 
         * @param {string}  eventId     ID of the Event
         * @param {Comment} newComment  comment to be created
         * @returns response
         */
        function createCommentOnEvent(eventId, newComment) {
            return $http.post(CONFIG.SERVICE_URL + '/comments/event/' + eventId, newComment)
                .then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    throw 'cannot-create-comment';
                });  
        };
    }
})();