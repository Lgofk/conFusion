'use strict';

angular.module('confusionApp', ['ui.router', 'ngResource'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

        // route for the home page
            .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                },
                'content': {
                    templateUrl: 'views/home.html',
                    controller: 'IndexController'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                }
            }

        })

        // route for the aboutus page
        .state('app.aboutus', {
            url: 'aboutus',
            views: {
                'content@': {
                    templateUrl: 'views/aboutus.html',
                    controller: 'AboutController'
                }
            }
        })

        // route for the contactus page
        .state('app.contactus', {
            url: 'contactus',
            views: {
                'content@': {
                    templateUrl: 'views/contactus.html',
                    controller: 'ContactController'
                }
            }
        })

        // route for the menu page
        .state('app.menu', {
            url: 'menu',
            views: {
                'content@': {
                    templateUrl: 'views/menu.html',
                    controller: 'MenuController'
                }
            }
        })

        // route for the dishdetail page
        .state('app.dishdetails', {
            url: 'menu/:id',
            views: {
                'content@': {
                    templateUrl: 'views/dishdetail.html',
                    controller: 'DishDetailController'
                }
            }
        });

        $urlRouterProvider.otherwise('/');
    });
'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading...";
    $scope.dishes = menuFactory.getDishes().query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
}])

.controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

        console.log($scope.feedback);

        feedbackFactory.saveFeedback().save($scope.feedback);

        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
            console.log('incorrect');
        } else {
            $scope.invalidChannelSelection = false;
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
            console.log($scope.feedback);
        }
    };
}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function ($scope, $stateParams, menuFactory) {

    $scope.showDish = false;
    $scope.message = "Loading...";
    $scope.dish = menuFactory.getDishes().get({
            id: parseInt($stateParams.id, 10)
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
}])

.controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {
        rating: 5,
        comment: "",
        author: "",
        date: ""
    };

    $scope.submitComment = function () {

        $scope.mycomment.date = new Date().toISOString();
        console.log($scope.mycomment);

        menuFactory.getDishes().update({
            id: $scope.dish.id
        }, $scope.dish);

        $scope.commentForm.$setPristine();
        $scope.mycomment = {
            rating: 5,
            comment: "",
            author: "",
            date: ""
        };
    };
}])


.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {

    $scope.showDish = false;
    $scope.showPromotion = false;
    $scope.showLeader = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.getDishes().get({
            id: 0
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.promotion = menuFactory.getPromotion().get({
            id: 0
        })
        .$promise.then(
            function (response) {
                $scope.promotion = response;
                $scope.showPromotion = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

    $scope.leader = corporateFactory.getLeader().get({
            id: 3
        })
        .$promise.then(
            function (response) {
                $scope.leader = response;
                $scope.showLeader = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });
}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {
    $scope.showLeaders = false;
    $scope.message = "Loading...";
    $scope.leaders = corporateFactory.getLeader().query(
        function (response) {
            $scope.leaders = response;
            $scope.showLeaders = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

}]);
'use strict';

angular.module('confusionApp')

.constant("baseURL", "api/db.json")

.service('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    this.getDishes = function () {
        return $resource(baseURL + ".dishes/:id", null, {
            'update': {
                method: 'PUT'
            }
        });
    };

    this.getPromotion = function () {
        return $resource(baseURL + "promotions/:id");
    };
}])

.factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var corpfac = {};
    corpfac.getLeader = function () {
        return $resource(baseURL + "leadership/:id", null);
    };
    return corpfac;
}])

.factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    var feedbacker = {};

    feedbacker.saveFeedback = function () {
        return $resource(baseURL + "feedbacks", null);
    };
    return feedbacker;
}]);