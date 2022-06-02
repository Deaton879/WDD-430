import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    documentSelectedEvent = new EventEmitter<Document>();
    // documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();

    documents: Document[] = [];
    maxDocumentId: number;

    constructor() {
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId();
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
        this.documentListChangedEvent.next(this.documents.slice());
    }

    getMaxId() {

        let maxId = 0;

        this.documents.forEach(document => {
            let currentId = +document.id;
            if (currentId > maxId) {
                maxId = currentId;
            }
        });

        return maxId;
    }

    addDocument(newDocument: Document) {
        if (!newDocument) {
            return;
        }

        this.maxDocumentId++;
        newDocument.id = this.maxDocumentId.toString();
        this.documents.push(newDocument);
        let documentListClone = this.documents.slice();

        this.documentListChangedEvent.next(documentListClone);
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        if (!originalDocument || !newDocument) {
            return;
        }

        let pos = this.documents.indexOf(originalDocument);

        if (pos < 0) {
            return;
        }

        newDocument.id = originalDocument.id;
        this.documents[pos] = newDocument;
        let documentListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentListClone);
    }

}