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
import { ProfileController } from "./components/profile/profileController";
import { ProgressIndicatorService } from "./services/progressIndicatorService";
import { UserInfoPanel } from "./components/userInfoPanel/userInfoPanel";


import applicationConfig from './applicationConfig';
import runBlock from './runBlock';

var app: ng.IModule = angular.module('app', ['ngMaterial', 'ui.router', 'templates', 'ngAnimate', 'checklist-model', 'angularResizable', 'LocalStorageModule']);

app.config(applicationConfig);
app.run(runBlock);
app.controller('HomepageController', HomepageController);
app.controller('SignUpController', SignUpController);
app.service('progressIndicatorService', ProgressIndicatorService);
app.service('successErrorService', SuccessErrorService);
app.controller('SuccessErrorController', SuccessErrorController);
app.controller('LoginController', LoginController);
app.controller('ProfileController', ProfileController);
app.directive('userInfoPanel', UserInfoPanel);