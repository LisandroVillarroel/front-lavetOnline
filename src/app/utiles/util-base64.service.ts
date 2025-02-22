import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilBase64Service {
  constructor() {}

  async getBase64ImageFromUrl(imageUrl: any) {
    let res = await fetch(imageUrl);
    let blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  async getBase64ImageDeBlob(blob: any) {
    // let res = await fetch(imageUrl);
    // let blob = await res.blob();
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  getBase64ImageFromURL_(url: any) {
    console.log('url', url);
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
}
