import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  rut_empleado: string = '33333333'; // aquí puedes obtener el rut desde algún input o variable de tu componente

  constructor(private http: HttpClient) {}

  addConsumo(id_tipo_consumo: number) {
    const consumo = {
      id_tipo_consumo: id_tipo_consumo,
      precio: 0, // aquí puedes asignar el precio si lo obtienes desde algún input o variable de tu componente
    };
    const data = {
      rut_empleado: this.rut_empleado,
      consumo: consumo,
    };
    this.http.post('http://localhost:3000/api/v1/consumos/registrarConsumo', data)
      .subscribe(
        (response: any) => {
          console.log(response);
          alert("Se ha registrado el consumo correctamente")
        },
        (error) => {
          console.error(error);
          alert("NO SE PUDO registrar el consumo correctamente")        }
      );
  }
}
