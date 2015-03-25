$.cameraButtonClicked = function(_event) {
	alert("user clicked the camera button");
	
	var photoSource;	
	Ti.API.debug('Ti.Media.isCameraSupported ' + Ti.Media.isCameraSupported);	
	if(Titanium.Media.getIsCameraSupported()){
		photoSource = Titanium.Media.showCamera;
	} else {
		photoSource = Titanium.Media.openPhotoGallery;
	}
	
	photoSource({
		success : function(_event) {
			processImage(event.media, function(processResponse) {
				if(processResponse.success){
					var row = Alloy.createController("feedRow", processResponse.model);
					if ($.feedTable.getData().length === 0) {
						$.feedTable.setData([]);
						$.feedTable.appendRow(row.getView(), true);
					} else {
						$.feedTable.insertRowBefore(0, row.getView(), true);
					}			
				} else {
					alert('Error saving photo ' + processResponse.message);					
				}

			});
		},
		cancel : function() {
		},
		error : function(error) {
			if (error.code == Titanium.Media.NO_CAMERA) {
				alert("Please run this test on a device");
			} else {
				alert("Unexpected error" + error.code);
			}
		},
		saveToPhotoGallery : false,
		allowEditing : true,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};

function processImage(_mediaObject, _callback){
var photoObject = {
image: _mediaObject,
title: "Sample Photo " + new Date()
};
_callback(photoObject);
}

