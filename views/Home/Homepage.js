var SurveyApp = angular.module('SurveyApp', ['ngRoute']);

SurveyApp.config(['$routeProvider', function($routeProvider){

$routeProvider
    .when('/', {
        templateUrl : 'Home/Homepage.html'        
    })
    .when('/Login', {
        templateUrl : 'Login/Login.html',
        controller : 'LoginCtrl'
    })
    .when('/Logout', {
        templateUrl : 'Home/Homepage.html',
         controller : 'LoginCtrl'
    })
    .when('/questions', {
        templateUrl : 'Questions/questions_Page.html',
        controller : 'QuestionCtrl'
    })
    .otherwise({
        redirectTo : '/'
       
    })
}]);

SurveyApp.controller('HomeCtrl', function($scope){
    $scope.showLogin = true;
    $scope.showLogout = function(){
        console.log('login function................');
        $scope.showLogin = !$scope.showLogin;
        console.log($scope.showLogin);
    }
});

SurveyApp.controller('LoginCtrl', function($scope, $rootScope, $location, $http){
   
   // $scope.validationMsg = 'Enter valid user code',
    $scope.searchRole = function(usercode){
       //search for the user code is avilable in DB or not
       console.log(usercode);
       //code for getting the record details with userCode
       //here DB url you need to mention
     
       console.log('LoginCtrl..........');
        if(usercode<6 && usercode!=0){
             $http({
                    method: 'GET',
                    url: 'http://localhost:3000/users',
                    params: {userid:usercode}
                }).then(function (response) {
                    $rootScope.questions = response.data.data;
                    $rootScope.questions[0].active = true;
                    $location.path('/questions');
                });
        }else{
            $scope.validationMsg = "Enter valid user code";
        }
               
    };

});

SurveyApp.controller('QuestionCtrl', function($scope, $rootScope, $http){
    console.log('******$rootScope.questions*********'+$rootScope.questions.length);
    console.log('QuestionCtrl..........');
     $scope.disp =true;
        $scope.ClickOnYes = function(id,ans){
             //store the data with this details in DB
             if(id < $rootScope.questions.length-1){
                 $rootScope.questions[id+1].active = true;
             } else {
                $scope.disp = !$scope.disp;
                 console.log('questions over');
             }
                 $rootScope.questions[id].active = false;
                 $http({
                     method: 'POST',
                     url: 'http://localhost:3000/users',
                     data: { userid: $rootScope.questions[id].userid, questionid: $rootScope.questions[id].questionid, answer: ans },
                 })
                     .success(function (data) {
                             console.log('success');
                         if (data.errors) {
                             // Showing errors.
                             $scope.erroruserid = data.errors.userid;
                             $scope.errorquestionid = data.errors.questionid;
                            
                         } else {
                             $scope.message = data.message;
                         }
                     });
        }
})
