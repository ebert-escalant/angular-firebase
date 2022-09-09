import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: AngularFirestore) {

  }
  getAll() : Observable<any>{
    return this.firestore.collection('users',ref => ref.orderBy('created_at','asc')).snapshotChanges();
  }
  store(user : any) : Promise<any>{
    return this.firestore.collection('users').add(user);
  }
  getUser(id:string) : Observable<any>{
    return this.firestore.collection('users').doc(id).snapshotChanges();
  }
  update(id:string,user : any) : Promise<any>{
    return this.firestore.collection('users').doc(id).update(user);
    
  }
  destroy(id:string) : Promise<any>{
    return this.firestore.collection('users').doc(id).delete();
  }
}
