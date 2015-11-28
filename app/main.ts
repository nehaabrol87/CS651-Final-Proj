import 'angular';
import 'angular-animate';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-material';
import './templates';
import 'checklist-model';
import 'Reklino/angular-resizable';
import 'angular-local-storage';

import { HomepageController } from './components/homepage/homepageController';
import { SignUpController } from './components/signUp/signUpController';
import { SuccessErrorService } from './services/successErrorService';
import { SuccessErrorController } from './components/successError/successErrorController';
import { LoginController } from "./components/login/loginController";
import { ProgressIndicatorService } from "./services/progressIndicatorService";


import applicationConfig from './applicationConfig';
import runBlock from './runBlock';

var app: ng.IModule = angular.module('app', ['ngMaterial', 'ui.router', 'templates', 'ngAnimate', 'checklist-model', 'angularResizable', 'LocalStorageModule']);

app.config(applicationConfig);
app.controller('HomepageController', HomepageController);
app.controller('SignUpController', SignUpController);
app.service('progressIndicatorService', ProgressIndicatorService);
app.service('successErrorService', SuccessErrorService);
app.controller('SuccessErrorController', SuccessErrorController);
app.controller('LoginController', LoginController);