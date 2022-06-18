import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class DocumentService {

    documentSelectedEvent = new EventEmitter<Document>();
    // documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();

    documents: Document[] = [];
    maxDocumentId: number;

    constructor(private http: HttpClient) {
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

    getDocuments(): Document[] {
        //return this.documents.slice();
        this.http
            .get(
                'https://dkecms-default-rtdb.firebaseio.com/documents.json'
            )
            .subscribe({
                next: (documents: Document[]) => {
                    this.documents = documents;
                    this.maxDocumentId = this.getMaxId();
                    this.documents.sort();
                    this.documentListChangedEvent.next([...this.documents]);
                },
                error: (e) => console.log(e.message),
            });
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
        this.storeDocuments();
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

        this.storeDocuments();
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
        this.storeDocuments();
    }

    storeDocuments() {
        let documents = JSON.stringify(this.documents);
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        this.http
            .put(
                'https://dkecms-default-rtdb.firebaseio.com/documents.json',
                documents,
                httpOption
            )
            .subscribe( () => {
                this.documentListChangedEvent.next([...this.documents]);
            })
    }
}