import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController, NavParams } from 'ionic-angular';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
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
    this.checkinSuccess();
  }

  private takeFromCamera(): void {
    console.log('take from camera');
  }

  private takeFromGallery(): void {
    console.log('take from gallery');
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
          handler: this.takeFromCamera
        },
        {
          text: 'Galeria',
          icon: 'images',
          cssClass: 'gallery-icon',
          role: 'gallery',
          handler: this.takeFromCamera
        }
      ]
    });
    action.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}
