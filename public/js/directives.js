angular.module('myApp.directives', [])
   .directive('onTap', function () {
     return function (scope, element, attrs) {
       return $(element).hammer({
         prevent_default: false,
         drag_vertical: false
       })
         .bind("tap", function (ev) {
           return scope.$apply(attrs['onTap']);
         });
     };
   })
    .directive('onTapRelease', function () {
       return function (scope, element, attrs) {
         return $(element).hammer({
           prevent_default: false,
           drag_vertical: false
         })
         .bind("release", function (ev) {
           return scope.$apply(attrs['onTapRelease']);
         });
      };