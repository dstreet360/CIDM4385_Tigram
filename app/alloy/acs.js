function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	Cloud = require("ti.cloud");
	Cloud.debug = !0;
	config.Cloud = Cloud;
}

function Sync(method, model, options) {
	var object_name = model.config.adapter.collection_name;

	//determine which sync method to call based on the
	//collection type in the model
	if (object_name === "photos") {
		processACSPhotos(model, method, options);
	} else if (object_name === "users") {
		processACSUsers(model, method, options);
	} else if (object_name === "reviews") {
		processACSComments(model, method, opts);
	} else if (object_name === "friends"){
		processACSFriends(model, method, opts);
	}
}

/**
 * this is a separate handler for when the object being processed
 * is an ACS Photo
 */
function processACSPhotos(model, method, options) {
	switch (method) {
	case "create":
		// include attributes into the params for ACS
		Cloud.Photos.create(model.toJSON(), function(e) {
			if (e.success) {

				// save the meta data with object
				model.meta = e.meta;

				// return the individual photo object found
				options.success(e.photos[0]);

				// trigger fetch for UI updates
				model.trigger("fetch");
			} else {
				Ti.API.error("Photos.create " + e.message);
				options.error(e.error && e.message || e);
			}
		});
		break;
	case "read":
		model.id && (options.data.photo_id = model.id);

		var method = model.id ? Cloud.Photos.show : Cloud.Photos.query;

		method((options.data || {}), function(e) {
			if (e.success) {
				model.meta = e.meta;
				if (e.photos.length === 1) {
					options.success(e.photos[0]);
				} else {
					options.success(e.photos);
				}
				model.trigger("fetch");
				return;
			} else {
				Ti.API.error("Cloud.Photos.query " + e.message);
				options.error(e.error && e.message || e);
			}
		});
		break;
	case "update":
	case "delete":
		alert("Not Implemented Yet");
		break;
	}
}