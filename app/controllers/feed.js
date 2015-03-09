OS_IOS && $.cameraButton.addEventListener("click",function(_event) {
	$.cameraButtonClicked(_event);
});

//handlers
$.cameraButtonClicked = function(_event) {
	alert("User clicked the camera button");
	
	var photoSource = Titanium.Media.getIsCameraSupported() ? Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;
	
	photoSource({
		success : function(event) {
			processImage(event.media, function(processResponse){
				
				if(processResponse.success) {
					var row = Alloy.createController("feedRow", processResponse.model);
					
					if($.feedTable.getData().length === 0) {
						$.feedTable.setData([]);
						$.feedTable.appendRow(row.getView(), true);
					} else {
						$.feedTable.insertRowBefore(0, row.getView(), true);
					}
				}
			});
		}
	});	
};
