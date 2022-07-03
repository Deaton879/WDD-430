import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Document } from "./document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { stringify } from "@angular/compiler/src/util";
import { json } from "body-parser";


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

    getDocuments(){
        
        this.http
            .get<{message: string, posts: Document[]}>(
                'http://localhost:3000/documents'
                //'https://dkecms-default-rtdb.firebaseio.com/documents.json'
            )
            .subscribe({
                next: (documents) => {
                    console.log(documents.posts);
                    this.documents = documents.posts;
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
        // this.storeDocuments();
        // delete from database
        this.http.delete('http://localhost:3000/documents/' + document.id)
        .subscribe(
            (response: Response) => {
            this.documents.splice(pos, 1);
            this.sortAndSend();
            }
        );
    }

    getMaxId() {
        let maxId = 0;
        this.documents.forEach(document => {
            let currentId = +document.id;
            if(currentId > maxId) {
                maxId = currentId;
            }
        });

        return maxId;
    }

    addDocument(document: Document) {
        if (!document) {
            return;
        }

        // this.maxDocumentId++;
        // newDocument.id = this.maxDocumentId.toString();
        // this.documents.push(newDocument);
        // let documentListClone = this.documents.slice();

        // this.storeDocuments();
      
        // make sure id of the new Document is empty
        document.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // add to database
        this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents/',
        document,
        { headers: headers })
        .subscribe(
            (responseData) => {
                // add new document to documents
                this.documents.push(responseData.document);
                this.sortAndSend();
            }
        );
    }

    sortAndSend() {
        this.documents.sort();
        this.storeDocuments();
        this.documents = this.getDocuments();  
    }

    updateDocument(originalDocument: Document, newDocument: Document) {
        
        if (!originalDocument || !newDocument) {
            return;
        }
    
        const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    
        if (pos < 0) {
            return;
        }

        // newDocument.id = originalDocument.id;
        // this.documents[pos] = newDocument;
        // let documentListClone = this.documents.slice();
        // this.storeDocuments();
    
        // set the id of the new Document to the id of the old Document
        newDocument.id = originalDocument.id;
        //newDocument._id = originalDocument._id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // update database
        this.http.put('http://localhost:3000/documents/' + originalDocument.id,
            newDocument, { headers: headers })
            .subscribe(
                (response: Response) => {
                    this.documents[pos] = newDocument;
                    this.sortAndSend();
                }
            );
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
                'http://localhost:3000/documents',
                //'https://dkecms-default-rtdb.firebaseio.com/documents.json',
                documents,
                httpOption
            )
            .subscribe( () => {
                this.documentListChangedEvent.next([...this.documents]);
            })
    }
}