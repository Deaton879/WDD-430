import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[], term: string): any {
    
    let fContacts: Contact[] = [];

    contacts.forEach(contact => {
      if (contact.name.toLowerCase().includes(term.toLowerCase())) {
        fContacts.push(contact);
      }
    });

    if (fContacts.length < 1) {
      return contacts;
    }
    
    return fContacts;
  }

}
