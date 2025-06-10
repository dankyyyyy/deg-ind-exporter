var doc = app.activeDocument;
var exportFolder = Folder.selectDialog("Select a folder to save PDFs");

if (doc && exportFolder) {
	//Removing the file extension
	var docNameWithoutExtension = doc.name.replace(/\.[^\.]+$/, '');
	
	// Language options
    var langOptions = ["EN", "FR", "DE", "ES"];
	
	// Language suffix dialog window
    var dialog = new Window("dialog", "Select Export Language");
    dialog.orientation = "column";
    dialog.alignChildren = "center";

    var langCode = null;
	
	for (var i = 0; i < langOptions.length; i++) {
        (function (code) {
            var btn = dialog.add("button", undefined, code);
            btn.onClick = function () {
                langCode = code;
                dialog.close();
            };
        })(langOptions[i]);
    }

    dialog.show();

    if (!langCode) {
        alert("No language selected. Export cancelled.");
	} else {
		//Name is the name which will be added as a suffix.
		//Preset is the name of the desired preset in InDesign.
		//They can be changed independently of one another.
		var presets = [
			{ name: "lowres", preset: "lowres" },
			{ name: "medres", preset: "medres" },
			{ name: "print", preset: "print" }
		];

		for (var i = 0; i < presets.length; i++) {
			var pdfPreset = app.pdfExportPresets.itemByName(presets[i].preset);
			if (pdfPreset.isValid) {
				var filePath = new File(exportFolder + "/" + docNameWithoutExtension + "_" + langCode.toUpperCase() + "_" + presets[i].name.toLowerCase() + ".pdf");
				doc.exportFile(ExportFormat.PDF_TYPE, filePath, false, pdfPreset);
			} else {
				alert("Preset not found: " + presets[i].preset);
			}
		}
		alert("PDF export process finished. Please verify the export.");
	}
} else {
    alert("No document open or no folder selected.");
}
