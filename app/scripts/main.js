require.config({
    baseUrl: '/scripts',
    paths: {
        'bower': '../components',
        'jquery': '../components/jquery/jquery',
        'angular': '../components/angular/angular'
    },
    shim: {
        'angular': {
            exports: 'angular'
        }
    }
});

define([
    './directives',
    './services',
    './controllers',
    './filters',
    './app'
], function() {
    angular.bootstrap(document, ['whoApp'])
});