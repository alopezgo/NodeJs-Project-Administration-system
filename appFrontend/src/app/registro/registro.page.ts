import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nfcContent: string = '';
  rut: string = '';
  dv: string = '';
  empresa: string = '';
  direccion: string = '';
  telefono: string = '';
  email: string = '';

  constructor(private http: HttpClient, private navCtrl: NavController, private nfc: NFC, private ndef: Ndef) {}

  ionViewDidEnter() {
    this.startNfcReader();
  }

  startNfcReader() {
    this.nfc.addNdefListener().subscribe(
      (event) => {
        if (event && event.tag && event.tag.ndefMessage) {
          const ndefMessage = event.tag.ndefMessage;
          const payload = ndefMessage[0].payload;
          this.nfcContent = this.decodePayload(payload).trim();
          this.parseNfcContent();
        }
      },
      (error) => {
        console.error('Error al leer la tarjeta NFC', error);
      }
    );
  }

  decodePayload(payload: any): string {
    let textEncoding = '';
    if ((payload[0] & 0x80) === 0) {
      textEncoding = 'utf-8';
    } else {
      textEncoding = 'utf-16';
    }
    const languageCodeLength = payload[0] & 0x3f;
    const text = payload.slice(languageCodeLength + 1);
    return this.bytesToString(text, textEncoding);
  }

  bytesToString(bytes: any, encoding: string): string {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(bytes);
  }

  parseNfcContent() {
    const parts = this.nfcContent.split(';');
    if (parts.length === 6) {
      const nombreCompleto = parts[0].trim();
      const rutCompleto = parts[1].trim();
      const empresa = parts[2].trim();
      const direccion = parts[3].trim();
      const telefono = parts[4].trim();
      const email = parts[5].trim();

      const rutArray = rutCompleto.split('-');
      const rut = rutArray[0].trim();
      const dv = rutArray[1].trim();

      this.rut = rut;
      this.dv = dv;
      this.empresa = empresa;
      this.direccion = direccion;
      this.telefono = telefono;
      this.email = email;
    } else {
      console.error('Contenido de tarjeta NFC no válido');
    }
  }

  addConsumo(idConsumo: number) {
    const consumo = {
      id_tipo_consumo: idConsumo,
      precio: 0
    };

    const data = {
      rut_empleado: this.rut,
      consumo: consumo,
    };

    this.http.post('http://localhost:3000/api/v1/consumos/registrarConsumo', data)
      .subscribe(
        (response: any) => {
          console.log(response);
          alert("Se ha registrado el consumo correctamente");
        },
        (error) => {
          console.error(error);
          alert("NO SE PUDO registrar el consumo correctamente");
        }
      );
  }

  goBack() {
    this.navCtrl.back();
  }
}
