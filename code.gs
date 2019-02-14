function onOpen(){ 


var ui = DocumentApp.getUi();
  ui.createMenu('Latex')
       .addItem('formule -> image', 'formuleToImage')
      .addSeparator()
       .addItem('image -> formule', 'imageToFormule')
      .addSeparator()
      .addItem('ajout formule', 'addFormule')
      .addSeparator()

      .addToUi();

}
function formuleToImage(){
    var doc = DocumentApp.getActiveDocument();
  var body = DocumentApp.getActiveDocument().getBody();
  var regex = "[\$]{2}(.)*[\$]{2}"
    var cursor = DocumentApp.getActiveDocument().getCursor();
  var size = 40;
  var foundElement = body.findText(regex);

  while (foundElement != null) {
    // Get the text object from the element
    var foundText = foundElement.getElement().asText();
    
    var value = foundText.getText();
    value = value.replace(/\$/gi,"")
    // Where in the element is the found text?
   /* var start = foundElement.getStartOffset();
    var end = foundElement.getEndOffsetInclusive();

    // Set Bold
    foundText.setBold(start, end, true);
  
   // Change the background color to yellow
    foundText.setBackgroundColor(start, end, "#FCFC00"); */
    
    var resp = UrlFetchApp.fetch("http://latex.bauduin.org/?latex="+encodeURIComponent(value));

    //var resp = UrlFetchApp.fetch("http://latex.bauduin.org/?latex=%5Csqrt%7Ba%5E2%2Bb%5E2%7D%5Cleft(x-1%5Cright)%5Cleft(x%2B3%5Cright)%0A");
     var image = resp.getBlob();
    var body = doc.getBody();
    var oImg = foundElement.getElement().getParent().asParagraph();
    oImg.clear();
    oImg = oImg.appendInlineImage(image);
   
    var ratio = oImg.getHeight() / size;
    oImg.setHeight(size);
    oImg.setWidth((oImg.getWidth() / ratio));
    oImg.setLinkUrl("latex-"+value);
    // Find the next match
    foundElement = body.findText(regex, foundElement);
   }
}


function imageToFormule(){
  var body = DocumentApp.getActiveDocument().getBody();
  
  // Remove all images in the document body.
  var imgs = body.getImages();
  for (var i = 0; i < imgs.length; i++) {
    var url = imgs[i].getLinkUrl();
    url = url.replace(/http\:\/\//gi,"");
    if(url.slice(0,6)=="latex-"){
      url = url.replace(/latex\-/gi,"");
      var cursor = DocumentApp.getActiveDocument().getCursor();
      imgs[i].getParent().asParagraph().appendText("$$"+url+"$$").setBold(true).setItalic(true).setFontSize(16);
    //cursor.insertText(url);
      imgs[i].removeFromParent();
    }
  }
  
}
function addFormule(){

  var cursor = DocumentApp.getActiveDocument().getCursor();
  if (cursor) {
    // Attempt to insert text at the cursor position. If the insertion returns null, the cursor's
    // containing element doesn't allow insertions, so show the user an error message.
    var element = cursor.insertText('$$ \sqrt{a^2 + b^2} $$');
  }

}
