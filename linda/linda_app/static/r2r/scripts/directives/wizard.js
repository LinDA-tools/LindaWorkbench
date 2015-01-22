(function() {
  'use strict';
  var app;

  app = angular.module('r2rDesignerApp');

  app.directive('wizard', function() {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'partials/wizard.html',
      controller: function($scope, $document, $timeout) {
        $scope.wizsteps = [];
        $scope.$on('changeSidetip', function(event, data) {
          return $timeout(function() {
            return $scope.sidetip.tmpl = data;
          });
        });
        this.addStep = function(step) {
          $scope.wizsteps.push(step);
          if ($scope.wizsteps.length === 1) {
            return this.goTo(step.name);
          }
        };
        this.getStep = function(name) {
          var i;
          return ((function() {
            var _i, _len, _ref, _results;
            _ref = $scope.wizsteps;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              if (i.name === name) {
                _results.push(i);
              }
            }
            return _results;
          })())[0];
        };
        this.goTo = function(name) {
          var getStep;
          getStep = this.getStep;
          return $timeout(function() {
            var step;
            step = getStep(name);
            if ((step != null) && ($scope.currentStep != null)) {
              $scope.currentStep.selected = false;
              $scope.currentStep.treated = true;
            }
            step.selected = true;
            $scope.currentStep = step;
            return $scope.sidetip.tooltip = $scope.currentStep.description;
          });
        };
        this.fnStep = function(current, fn) {
          var index, newIndex, next;
          next = this.getStep(current);
          index = $scope.wizsteps.indexOf(next);
          newIndex = fn(index);
          if (index !== -1 && newIndex >= 0 && newIndex < $scope.wizsteps.length && ($scope.wizsteps[newIndex] != null)) {
            this.goTo($scope.wizsteps[newIndex].name);
          }
          return $scope.wizsteps[newIndex].name;
        };
        this.nextStep = function(current) {
          return this.fnStep(current, function(x) {
            return ++x;
          });
        };
        this.prevStep = function(current) {
          return this.fnStep(current, function(x) {
            return --x;
          });
        };
        this.isFirst = function(name) {
          return $scope.wizsteps[0].name === name;
        };
        this.isLast = function(name) {
          return $scope.wizsteps[$scope.wizsteps.length - 1].name === name;
        };
        this.scrollTo = function(name, offs, duration) {
          var section;
          section = document.getElementById(name);
          return $document.scrollTo(0);
        };
      }
    };
  });

  app.directive('step', function() {
    return {
      restrict: 'E',
      require: '^wizard',
      scope: {
        name: '@',
        heading: '@',
        description: '@',
        sidetip: '='
      },
      transclude: true,
      templateUrl: 'partials/step.html',
      link: function(scope, element, attrs, ctrl) {
        ctrl.addStep({
          name: scope.name,
          heading: scope.heading,
          description: scope.description,
          selected: scope.selected
        });
        scope.isSelected = function() {
          return ctrl.getStep(scope.name).selected;
        };
        scope.isTreated = function() {
          return ctrl.getStep(scope.name).treated;
        };
        scope.isFirst = function() {
          return ctrl.isFirst(scope.name);
        };
        return scope.isLast = function() {
          return ctrl.isLast(scope.name);
        };
      }
    };
  });

  app.directive('next', function() {
    return {
      restrict: 'A',
      require: '^wizard',
      link: function(scope, element, attrs, ctrl) {
        return element.bind('click', function() {
          var newStep;
          scope.$emit('changeSidetip', '');
          newStep = ctrl.nextStep(scope.name);
          return ctrl.scrollTo(newStep);
        });
      }
    };
  });

  app.directive('prev', function() {
    return {
      restrict: 'A',
      require: '^wizard',
      link: function(scope, element, attrs, ctrl) {
        return element.bind('click', function() {
          var newStep;
          scope.$emit('changeSidetip', '');
          newStep = ctrl.prevStep(scope.name);
          return ctrl.scrollTo(newStep);
        });
      }
    };
  });

  app.directive('goto', function() {
    return {
      restrict: 'A',
      require: '^wizard',
      link: function(scope, element, attrs, ctrl) {
        return element.bind('click', function() {
          scope.$emit('changeSidetip', '');
          ctrl.goTo(attrs.goto);
          return ctrl.scrollTo(attrs.goto);
        });
      }
    };
  });

}).call(this);

//# sourceMappingURL=wizard.js.map
