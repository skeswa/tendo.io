angular.module("mean.system").controller("setupController", ["$scope", "Global",
  function($scope, Global) {
    var loading = false;

    $(':file').change(function(){
        var file = this.files[0];
        name = file.name;
        size = file.size;
        type = file.type;
        //Your validation
    });

    $(':button').click(function(){
        loading = true;
        var formData = new FormData($('form')[0]);
        $.ajax({
            url: '/roms/upload',  //Server script to process data
            type: 'POST',
            xhr: function() {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){ // Check if upload property exists
                    //myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
                }
                return myXhr;
            },
            //Ajax events
            beforeSend: function(){},
            success: function(){loading = false;},
            error: function(){},
            // Form data
            data: formData,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
    });
  }
]);