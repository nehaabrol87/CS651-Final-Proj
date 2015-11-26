import 'angular';
import 'angular-animate';
import 'angular-ui-router';
import 'angular-material';
import './templates';
import 'checklist-model';
import 'Reklino/angular-resizable';
import 'angular-local-storage';

import { LoginController } from './components/login/loginController';

import applicationConfig from './application-config';

var app: ng.IModule = angular.module('app', ['ngMaterial', 'ui.router', 'templates', 'ngAnimate', 'checklist-model', 'angularResizable', 'LocalStorageModule']);

app.config(applicationConfig);
app.controller('LoginController', LoginController);
