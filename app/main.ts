import 'angular';
import 'angular-animate';
import 'angular-messages';
import 'angular-ui-router';
import 'angular-material';
import './templates';
import 'checklist-model';
import 'Reklino/angular-resizable';
import 'angular-local-storage';

//Controllers
import { HomepageController } from './components/homepage/homepageController';
import { SignUpController } from './components/signUp/signUpController';
import { LoginController } from "./components/login/loginController";
import { ProfileController } from "./components/profile/profileController";
import { ActivateController } from "./components/activate/activateController";

//Services
import { UserService }  from "./services/userService";
import { ProgressIndicatorService } from "./services/progressIndicatorService";
import { MealService } from './services/mealService';

//Directives
import { UserInfoPanel } from "./components/userInfoPanel/userInfoPanel";
import { UpdateProfile } from "./components/updateProfile/updateProfile";


import applicationConfig from './applicationConfig';
import runBlock from './runBlock';

var app: ng.IModule = angular.module('app', ['ngMaterial', 'ui.router', 'templates', 'ngAnimate', 'checklist-model', 'angularResizable', 'LocalStorageModule']);

app.config(applicationConfig);
app.run(runBlock);

//Controllers
app.controller('HomepageController', HomepageController);
app.controller('SignUpController', SignUpController);
app.controller('LoginController', LoginController);
app.controller('ProfileController', ProfileController);
app.controller('ActivateController', ActivateController);

//Services
app.service('progressIndicatorService', ProgressIndicatorService);
app.service('userService', UserService);
app.service('mealService', MealService);

//Directives
app.directive('userInfoPanel', UserInfoPanel);
app.directive('updateProfile', UpdateProfile);