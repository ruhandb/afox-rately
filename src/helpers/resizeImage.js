var resizeImage = (file, maxWidth, maxHeight, mimeString) => {
  return new Promise((resolve) => {
    // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader

    mimeString = mimeString ? mimeString : "image/webp";

    reader.onload = (e) => {
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.getContext("2d").drawImage(img, 0, 0);

        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
          
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        var dataURI = canvas.toDataURL(mimeString);

        var byteString;
        if (dataURI.split(",")[0].indexOf("base64") >= 0)
          byteString = atob(dataURI.split(",")[1]);
        else byteString = unescape(dataURI.split(",")[1]);

        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        resolve({
          blob: new Blob([ia], { type: mimeString }),
          dataURI: dataURI,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export { resizeImage };
