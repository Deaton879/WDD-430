import { EventEmitter, Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    documentSelectedEvent = new EventEmitter<Document>();

    documents: Document[] = [];

    constructor() {
        this.documents = MOCKDOCUMENTS;
    }

    getDocument(id: string) {
        this.documents.forEach(document => {
            if(document.id === id){
                return document;
            }
            else { return null; }
        });
    }

    getDocuments() {
        return this.documents.slice();
    } 

}