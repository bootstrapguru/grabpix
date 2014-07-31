/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function sayHello(){
    alert("hello from ExtendScript");
}

var openDocument = function(path) {
  app.open(new File(path));
 //  	var docRef = app.documents.add(new File(path));
	// var myLayer = docRef.artLayers.add();
 

  app.load(new File(path)); //load it into documents
   backFile= app.activeDocument; //prepare your image layer as active document
   //backFile.resizeImage(width,height); //resize image into given size i.e 640x480
   backFile.selection.selectAll();
   backFile.selection.copy(); //copy image into clipboard

   backFile.close(SaveOptions.DONOTSAVECHANGES); //close image without saving changes
   vijay= app.activeDocument;
   vijay.paste(); //paste selection into your vijayument
   vijay.layers[0].name = "BackgroundImage"; //set your layer's name


}

