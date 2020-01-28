function onPhotoDataSuccess(imageData) {
        // Uncomment to view the base64-encoded image data
        // console.log(imageData);

        // Get image handle
        //
        //var smallImage = document.getElementById('smallImage');

        // Unhide image elements
        //
        //smallImage.style.display = 'block';

        // Show the captured photo
        // The inline CSS rules are used to resize the image
        //
        //smallImage.src = "data:image/jpeg;base64," + imageData;
        DevExpress.ui.notify("Photo OK", "success", 1000);
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
        var options = new FileUploadOptions();
		console.log("onPhotoURISuccess")
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = {};
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;

        var ft = new FileTransfer();
        ft.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
				console.log("upload foto in corso " + progressEvent.loaded / progressEvent.total)
   				viewModel.msgLoadPanel("Upload foto in corso..." + progressEvent.loaded / progressEvent.total)



            } else {


            }
        };
        viewModel.loadPanelVisible(true);
		console.log("upload foto")
        ft.upload(imageURI, encodeURI("http://rmdtmsoft.it/test/upload//upload_file.php"), onWinUpload, onFailUpload, options);
    }
    function onWinUpload(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        viewModel.loadPanelVisible(false);
        DevExpress.ui.notify("File upload completed", "success", 2000);
    }

    function onFailUpload(error) {
        //alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
        loadPanelVisible(false);
        DevExpress.ui.notify("File upload error:" + error.code, "error", 3000);
    }

    function onFailPhoto(message) {
        DevExpress.ui.notify(message, "error", 3000);
    }
    function onWinPhoto() {

    }

    function getPhoto(source) {
        // Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFailPhoto, {quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: source, correctOrientation: true});
    }
    // A button will call this function
    //
    function capturePhoto() {
        // Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoURISuccess, onFailPhoto, {quality: 50,
            destinationType: destinationType.FILE_URI, correctOrientation: true});
    }

    function  uploadFoto() {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        //capturePhoto();
        getPhoto(pictureSource.PHOTOLIBRARY);
    }