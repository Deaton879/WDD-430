import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Contact } from "./contact.model";
import { MOCKCONTACTS } from "./MOCKCONTACTS";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new Subject<Contact[]>();

    contacts: Contact[] = [];
    maxContactId: number;

    constructor(private http: HttpClient) {
        this.contacts = MOCKCONTACTS;
    }

    getContact(id: string) {
        return this.contacts.find((contact) => contact.id == id);      
    }

    getContacts() {
        this.http
            .get<{message: string, posts: Contact[]}>(
                'http://localhost:3000/contacts'
                //'https://dkecms-default-rtdb.firebaseio.com/contacts.json'
            )
            .subscribe({
                next: (contacts) => {
                    this.contacts = contacts.posts;
                    console.log(this.contacts)
                    this.maxContactId = this.getMaxId();
                    this.contacts.sort();
                    this.contactChangedEvent.next([...this.contacts]);
                },
                error: (e) => console.log(e.message),
            });

        return this.contacts.slice();
    }

    deleteContact(contact: Contact) {
        if (!contact) {
           return;
        }
        const pos = this.contacts.indexOf(contact);
        if (pos < 0) {
           return;
        }
        // this.contacts.splice(pos, 1);
        // this.storeContacts();

        // delete from database
        this.http.delete('http://localhost:3000/contacts/' + contact.id)
        .subscribe(
        (response: Response) => {
            this.contacts.splice(pos, 1);
            this.sortAndSend();
        }
        );
    }

    getMaxId() {

        let maxId = 0;

        this.contacts.forEach(contact => {
            let currentId = +contact.id;
            if (currentId > maxId) {
                maxId = currentId;
            }
        });

        return maxId;
    }

    addContact(newContact: Contact) {
        if (!newContact) {
            return;
        }

        // this.maxContactId++;
        // newContact.id = this.maxContactId.toString();
        // this.contacts.push(newContact);
        // let contactListClone = this.contacts.slice();
        // this.storeContacts();
        
        // make sure id of the new Contact is empty
        // newContact.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // add to database
        this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts/',
        newContact,
        { headers: headers })
        .subscribe(
            (responseData) => {
            // add new document to documents
            this.contacts.push(responseData.contact);
            this.sortAndSend();
            }
        );
    }

    sortAndSend() {
        this.contacts.sort();
        this.storeContacts();
        this.contacts = this.getContacts();
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }

        let pos = this.contacts.indexOf(originalContact);

        if (pos < 0) {
            return;
        }

        // set the id of the new Document to the id of the old Document
        newContact.id = originalContact.id;
        //newContact._id = originalContact._id;

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        // update database
        this.http.put('http://localhost:3000/contacts/' + originalContact.id,
        newContact, { headers: headers })
        .subscribe(
            (response: Response) => {
                this.contacts[pos] = newContact;
                this.sortAndSend();
            }
        );
    }

    storeContacts() {
        let contacts = JSON.stringify(this.contacts);
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        this.http
            .put(
                'http://localhost:3000/contacts/',
                // 'https://dkecms-default-rtdb.firebaseio.com/contacts.json',
                contacts,
                httpOption
            )
            .subscribe( () => {
                this.contactChangedEvent.next([...this.contacts]);
            })
    }
}