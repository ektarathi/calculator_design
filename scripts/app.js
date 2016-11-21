'use strict'

var app = angular.module('Calculo', []);

app.controller('appCtrl', function($scope) {
    // calculator state
  $scope.displayValue = 0;                    //current value displayed on calculator screen
  $scope.valueA = 0;                          //first (left) value that will be used for computation
  $scope.valueB = 0;                          //second (right) value that will be used for computation
  $scope.selectedOperation = null;            //last operation selected by user
  $scope.clearValue = true;                   //should value displayed on screen be cleared after new digit pressed?


  //constants
  $scope.equalSignKey = {label: "="};

  $scope.digitKeys = [
    {label: "AC", value: 'AC'}, {label: "CE", value: 'CE'}, {},
    {label: "1", value: 1}, {label: "2", value: 2}, {label: "3", value: 3},
    {label: "4", value: 4}, {label: "5", value: 5}, {label: "6", value: 6},
    {label: "7", value: 7}, {label: "8", value: 8}, {label: "9", value: 9},
    {label: "0", value: 0}, {label: ".", value: '.'}
  ];

  $scope.operationKeys = [
    {label: "/", operation: function (a, b) {return a / b}},
    {label: "*", operation: function (a, b) {return a * b}},
    {label: "+", operation: function (a, b) {return a + b}},
    {label: "-", operation: function (a, b) {return a - b}}
  ];


  // actions
  /**
   * When digit is clicked, it should be added to displayed value or replace displayed value.
   * Also new displayed value should be treated as second operation value.
   * @param digit what digit was clicked
   */
  $scope.digitClicked = function (digit) {

    if ($scope.clearValue) {
      $scope.displayValue = digit;
      $scope.displayValue = $scope.displayValue.toString();
      $scope.checkDotValue($scope.displayValue);
      $scope.clearValue = false;
    } else {
      if(digit == 'AC') {
        $scope.displayValue = '';
      } else if ( digit == 'CE') {
        $scope.displayValue = $scope.displayValue;
      } else {
        $scope.checkDotValue($scope.displayValue);
        $scope.displayValue = $scope.displayValue + digit;
      }
    }
    console.log('first loop dot value', $scope.displayValue);
    if( digit ==  'AC') {
      $scope.displayValue = '';
    } else if (digit == 'CE') {      
      if($scope.valueA != 0) {
        $scope.displayValue = $scope.valueA.toString();
        $scope.displayValue = $scope.displayValue.substring(0, $scope.displayValue.length-1);
        $scope.valueA = 0;
      } else {
        $scope.displayValue = $scope.displayValue.substring(0, $scope.displayValue.length-1);
      }
    } else {
      $scope.valueB = $scope.displayValue;
    }
  };

  /**
   * Checking if period is entered more than once
   */

  $scope.checkDotValue = function(value) {
    $scope.displayValue = $scope.displayValue.replace(/[^0-9\.]/g,'');
    if($scope.displayValue.split('.').length > 2) {
      $scope.displayValue = $scope.displayValue.replace(/\.+$/,"");
      console.log('replace first loop value', $scope.displayValue);
     }
  }
  
  /**
   * When operation key is clicked operation should be remembered,
   * displayed value should be treated as first and second number to perform operation on
   * and next pushed digit should replace the displayed value
   * @param operation which operation was clicked
   */
  $scope.operationClicked = function (operation) {
    $scope.selectedOperation = operation;
    $scope.valueA = $scope.displayValue;
    $scope.valueB = $scope.displayValue;
    $scope.clearValue = true;
  };

  /**
   * Computes the result based on remembered operation and two values and displays the result.
   * Also next pushed digit should replace the displayed value
   * and current result should be treated as first value for next operation.
   */
  $scope.compute = function () {
    if($scope.selectedOperation!=null) {
      $scope.displayValue = ($scope.selectedOperation(parseFloat($scope.valueA), parseFloat($scope.valueB))).toFixed(2);
      $scope.clearValue = true;
      $scope.valueA = $scope.displayValue;
    }
  }
});