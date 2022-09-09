import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  showModal:boolean = false;
  formSubmit:boolean = false;
  formUser : FormGroup;
  loading:boolean = false;
  users: any[] = [];
  id : string | null = null;
  modalTitle : string="";
  textButton:string="";

  get nameFb() { return this.formUser.controls['name']; }
	get lastnameFb() { return this.formUser.controls['lastname']; }
  get emailFb() { return this.formUser.controls['email']; }
  get genderFb() { return this.formUser.controls['gender']; }
  get ageFb() { return this.formUser.controls['age']; }

  constructor(private formBuilder: FormBuilder, private userService:UserService, private toastr: ToastrService) {
    this.formUser = this.formBuilder.group({
      name: [null, [Validators.required]],
			lastname: [null, [Validators.required]],
      email: [null, [Validators.required,Validators.email]],
			gender: [null, [Validators.required]],
      age: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getUsers()
  }
  closeModal(){
    this.formUser.reset()
    //this.genderFb.setValue("")
    this.showModal=false
    this.formSubmit = false;

  }
  createUser():void{
    this.formSubmit = true;
    this.loading = true;
    if(!this.formUser.valid) {
			this.formUser.markAllAsTouched();
      this.loading = false;
			return;
		}
    const user:any={
      name: this.nameFb.value,
      lastname: this.lastnameFb.value,
      email: this.emailFb.value,
      gender: this.genderFb.value,
      age: this.ageFb.value,
      created_at:new Date(),
      updated_at:new Date()
    }
    this.userService.store(user).then(()=>{
      this.loading=false;
      this.closeModal()
      this.toastr.success('el usuario fue creado correctamente!', 'Registro insertado!');
    }).catch( error =>{
      this.loading=false;
      console.log(error);
    })
    
  }
  newUser(){
    this.id="create"
    this.modalTitle="Crear Usuario"
    this.textButton="Crear"
    this.showModal=true
    this.formSubmit=false
  }
  deleteUser(id:string){
    Swal.fire({
      title: 'Estas seguro?',
      text: "¡No podrás revertir esto.!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.destroy(id).then( ()=>{
          this.toastr.success('El usuario fue eliminado correctamente!', 'Registro eliminado!');
        }).catch( error =>{
          console.log(error);
        });
      }
    })
  }
  getUsers(){
    this.userService.getAll().subscribe(response => {
      this.users=[];
      response.forEach((element: any) => {
        this.users.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    })
  }
  createOrUpdate(){
    
    if(this.id === "create"){
      this.createUser()
    }
    else if(this.id !== null){
      this.updateUser(this.id)
    }else{
      this.closeModal()
    }
  }
  editUser(id:string){
    this.id=id
    this.modalTitle="Editar Usuario"
    this.textButton="Actualizar"
    /* this.loading=true */
    this.userService.getUser(id).subscribe( response =>{
      this.nameFb.setValue(response.payload.data()['name']);
      this.lastnameFb.setValue(response.payload.data()['lastname']);
      this.emailFb.setValue(response.payload.data()['email']);
      this.genderFb.setValue(response.payload.data()['gender']);
      this.ageFb.setValue(response.payload.data()['age']);
      this.showModal=true
      /* this.loading=false */
    })
    
  }
  updateUser(id:string){
    this.formSubmit = true;
    this.loading = true;
    if(!this.formUser.valid) {
			this.formUser.markAllAsTouched();
      this.loading = false;
			return;
		}
    const user:any={
      name: this.nameFb.value,
      lastname: this.lastnameFb.value,
      email: this.emailFb.value,
      gender: this.genderFb.value,
      age: this.ageFb.value,
      updated_at:new Date()
    }
    this.userService.update(id,user).then(()=>{
      this.id=null
      setTimeout(() => {
        this.toastr.success('el usuario fue actualizado correctamente!', 'Registro actualizado!');
        this.closeModal()
        this.loading=false;
      }, 300);
    }).catch( error =>{
      this.loading=false;
      console.log(error);
    })
  }
}
