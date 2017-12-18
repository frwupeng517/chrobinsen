import jq from 'jquery';

import blockUI from 'block-ui';

jQuery(function($) {

    // cookie checking login
    //var u = jsRoutes.controllers.oauth.OAuthController.corsLogin("").absoluteURL(global.routeSecure);
    //var domain = u.search("http[s]?:\/\/localhost")>=0?"localhost" : u.replace(/http[s]?:\/\/.*?([^\.]+\.(com\.cn|org\.cn|net\.cn|cn))[:]?[\d]{0,9999}\/.+/, "$1");

    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        statusCode: {
            401: function(data) {
                var r = jsRoutes.controllers.oauth.OAuthController.corsLogin(window.location.href);
                window.location.href = r.absoluteURL(global.routeSecure);
            }
        }
    });

    $(document).ajaxStart(jq.blockUI).ajaxStop(jq.unblockUI);
    if ("/403" !== location.pathname) {
        $.ajax({
            type: "get",
            async: false,
            url: jsRoutes.controllers.oauth.OAuthController.check().absoluteURL(global.routeSecure),
            success: function(data) {
                //
            }
        });
    }
});