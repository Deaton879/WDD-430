import { EventEmitter, Injectable } from "@angular/core";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();

    documents: Document[] = [];

    constructor() {
        this.documents = MOCKDOCUMENTS;
    }

    getDocument(id: string) {
        // this.documents.forEach(document => {
        //     if(document.id === id){
        //         return document;
        //     }
        //     else { return null; }
        // });
        return this.documents.find((document) => document.id == id);
    }

    getDocuments() {
        return this.documents.slice();
    } 

    deleteDocument(document: Document) {
        if (!document) {
           return;
        }
        const pos = this.documents.indexOf(document);
        if (pos < 0) {
           return;
        }
        this.documents.splice(pos, 1);
        this.documentChangedEvent.emit(this.documents.slice());
    }
}