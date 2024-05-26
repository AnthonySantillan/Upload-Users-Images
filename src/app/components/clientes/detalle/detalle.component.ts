import {Component, Input, OnInit} from '@angular/core';
import {Cliente} from "../../../models/cliente";
import {ClienteService} from "../../../services/cliente.service";
import Swal from "sweetalert2";
import {HttpEventType} from "@angular/common/http";
import {ModalService} from "../../../services/modal.service";

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit{

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  urlEndpoint:string = 'http://localhost:8080/api/uploads/img';

  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService
  ) {
  }

  ngOnInit(): void {

  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0 )
    {
      Swal.fire({
        title: "Error seleccionar imagen!",
        text:  "El archivo debe ser del tipo imagen",
        icon:  "error"
      });
      this.fotoSeleccionada = null;
    }
    console.log(this.fotoSeleccionada);
  }

  subirFoto() {
    if (!this.fotoSeleccionada)
    {
      Swal.fire({
        title: "Error upload!",
        text:  "Debe seleccionar una foto",
        icon:  "error"
      });
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          //this.cliente = cliente;
          if(event.type === HttpEventType.UploadProgress)
          {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }
          else if(event.type == HttpEventType.Response)
          {
            let response:any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire({
              title: "La foto se ha subido correctamente!",
              text:  response.mensaje,
              icon: "success"
            });
          }

        }
      );
    }
  }
  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
