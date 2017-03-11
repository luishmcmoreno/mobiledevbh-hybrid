import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { NavController, LoadingController, AlertController, ActionSheetController, NavParams } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { HTTP } from 'ionic-native';

/*
  Generated class for the Main page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {

  public name: string;
  public username: string;
  public urlPicture: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController
  ) {}

  private checkinFail(): void {
    let alert = this.alertCtrl.create({
      buttons: ['Ok'],
      message: 'Falha ao realizar o checkin',
      title: 'Desculpe'
    });
    alert.present();
    
  }

  private checkinSuccess(): void {
    let alert = this.alertCtrl.create({
      buttons: ['Ok'],
      message: 'Checkin realizado com successo',
      title: 'Obrigado, ' + this.name
    });
    alert.present();
    
  }

  public checkin(): void {
    console.log(this.name, this.username);
    let errors = '';
    if (!this.name || !this.name.length) {
      errors += '<li text-left>Por favor, preencha o nome</li>';
    }

    if (!this.username || !this.username.length) {
      errors += '<li text-left>Por favor, preencha o usuário do seu twitter</li>';
    }
    if (!this.urlPicture || !this.urlPicture.length) {
      errors += '<li text-left>Por favor, adicione sua picture</li>';
    }
    if (errors.length > 0) {
      let alert = this.alertCtrl.create({
        title: 'Por favor, confira os erros abaixo',
        message: '<ul text-left> ' + errors + '</ul>',
        buttons: ['Ok'],
        cssClass: 'alignleft'
      });
      alert.present();
    } else {
      let loading = this.loadingCtrl.create({
        content: 'Enviando tweet'
      });
      loading.present();
      this.http.post('http://piloto31-sandbox.pluritech.com.br/api/mobile-dev/twitter-post', {
          experience: 'mobile-dev-bh',
          event: 'untappd-checkin',
          data: {
            first_name: this.name,
            twitter: this.username,  
            'image-uri': this.urlPicture
          },
      }).subscribe((success) => {
        console.log(success);
        this.checkinSuccess();
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
        console.error(err);
        this.checkinFail();
      });
    }
  }

  private _failTakePicture() {
    let alert = this.alertCtrl.create({
      title: 'Desculpe',
      message: 'Não conseguimos capturar a sua foto'
    });
    alert.present();
  }

  private _takePicture(sourceType: number): void {
    Camera.getPicture({
      sourceType: sourceType,
      destinationType:  Camera.DestinationType.DATA_URL
    }).then((pic) => {
      let loading = this.loadingCtrl.create({
        content: 'Aguarde... Transformando imagem...'
      });
      loading.present();
      this.http.post('http://piloto31-sandbox.pluritech.com.br/api/mobile-dev/register-picture', {
        picture: pic
      }).map((res) => res.json()).subscribe((urlPic: any) => {
        this.urlPicture = urlPic.urlPicture;
        console.log(this.urlPicture, urlPic);
        loading.dismiss();
      }, (err) => {
        console.error(err);
        this._failTakePicture();
        loading.dismiss();
      });
    }, (err) => {
      console.error(err);
      this._failTakePicture();      
    });
  }

  private takeFromCamera(): void {
    console.log('take from camera');
    this._takePicture(Camera.PictureSourceType.CAMERA);
  }

  private takeFromGallery(): void {
    console.log('take from gallery');
    this._takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
  }

  public takePicture(): void {
    let action = this.actionSheetCtrl.create({
      title: 'Selecione sua preferência',
      buttons: [
        {

          text: 'Camera',
          icon: 'camera',
          role: 'camera',
          cssClass: 'camera-icon',
          handler: () => {
            this.takeFromCamera();
          }
        },
        {
          text: 'Galeria',
          icon: 'images',
          cssClass: 'gallery-icon',
          role: 'gallery',
          handler: () => {
            this.takeFromGallery();
          }
        }
      ]
    });
    action.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}
