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

    getContacts(): Contact[] {
        this.http
            .get(
                'https://dkecms-default-rtdb.firebaseio.com/contacts.json'
            )
            .subscribe({
                next: (contacts: Contact[]) => {
                    this.contacts = contacts;
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
        this.contacts.splice(pos, 1);
        this.storeContacts();
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

        this.maxContactId++;
        newContact.id = this.maxContactId.toString();
        this.contacts.push(newContact);
        let contactListClone = this.contacts.slice();
        this.storeContacts();
    }

    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }

        let pos = this.contacts.indexOf(originalContact);

        if (pos < 0) {
            return;
        }

        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        let contactListClone = this.contacts.slice();
        this.storeContacts();
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
                'https://dkecms-default-rtdb.firebaseio.com/contacts.json',
                contacts,
                httpOption
            )
            .subscribe( () => {
                this.contactChangedEvent.next([...this.contacts]);
            })
    }
}