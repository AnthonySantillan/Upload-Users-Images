import { Injectable } from '@angular/core';

import {Cliente} from "../models/cliente";
import {map, Observable, catchError, throwError, tap} from "rxjs";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from "@angular/common/http";
import Swal from 'sweetalert2'
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndpoint:string = 'http://localhost:8080/api/clientes';
  private httpHeader = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient, private router: Router) { }


  getClients(page: number): Observable<any>{
    return  this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      tap((response:any) => {
        (response.content as Cliente[]).forEach( response => {
            console.log(response.nombre);
          }
        )
      }),
      map((response: any) =>{
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            return cliente;
          });
          return response;
        }
      )
    );
  }

  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndpoint, cliente,{headers: this.httpHeader}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        if (e.status == 400){
          return throwError(e);
        }

        Swal.fire({
          title: e.error.mensaje,
          text:  e.error.error,
          icon: "error"
        });
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return  this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        Swal.fire({
          title: "Error al editar",
          text:  e.error.mensaje,
          icon: "error"
        });
        return throwError(e);
      })
    );
  }
  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente,{headers: this.httpHeader} ).pipe(
      catchError(e => {
        if (e.status == 400){
          return throwError(e);
        }
        Swal.fire({
          title: e.error.mensaje,
          text:  e.error.error,
          icon: "error"
        });
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return  this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`, {headers: this.httpHeader} ).pipe(
      catchError(e => {
        Swal.fire({
          title: e.error.mensaje,
          text:  e.error.error,
          icon: "error"
        });
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<any>>{
    let formData = new FormData();
    formData.append("archivo" , archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndpoint}/upload`, formData,
    { reportProgress: true }
    );

    return this.http.request(req);
  }
 }

