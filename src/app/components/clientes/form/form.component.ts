import { Component } from '@angular/core';
import {Cliente} from "../../../models/cliente";
import {ClienteService} from "../../../services/cliente.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  public cliente: Cliente = new Cliente();
  public title: string = "Crear Cliente";
  public errors: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activateRouter: ActivatedRoute) {
  }

  ngOnInit() {
    this.cargarCliente()
  }

  cargarCliente(): void{
    this.activateRouter.params.subscribe(params =>{
      let id = params['id']
      if (id)
      {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }
  create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado con exito`, 'success' )
      },
      err => {
        this.errors = err.error.errors as string[];
      }
    )
  }

  update(): void{
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success' )
      },
      err => {
        this.errors = err.error.errors as string[];
      }
    )
  }
}
