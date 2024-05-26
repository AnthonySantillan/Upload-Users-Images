import { Component } from '@angular/core';
import {Cliente} from "../../models/cliente";
import {ClienteService} from "../../services/cliente.service";
import Swal from "sweetalert2";
import {tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ModalService} from "../../services/modal.service";


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes: Cliente[];
  clienteSeleccionado: Cliente;
  paginador: any;
  urlEndpoint:string = 'http://localhost:8080/api/uploads/img';
  urlEndpointNot:string = 'http://localhost:8080/images';

  constructor(
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService
  ) {
  }
  ngOnInit(){
    this.activateRoute.paramMap.subscribe( params => {
      let page = +params.get('page');
      if (!page){
        page = 0;
      }
      this.clienteService.getClients(page)
        .pipe(
          tap(response => {
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre)
            })
          })
        )
        .subscribe(response => {
          this.clientes = response.content as Cliente[],
            this.paginador = response;
        });
    });

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes =  this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id)
        {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro de querer eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response =>{
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito `,
              'success'
            )
          }
        )

      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
