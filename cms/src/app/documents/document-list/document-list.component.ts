import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {

  documents: Document[] = [];
  subscription: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    // this.documentService.documentChangedEvent.subscribe(
    //     (documents: Document[]) => {
    //       this.documents = documents;
    //     }
    //   )
    this.subscription = this.documentService.documentListChangedEvent
        .subscribe((documentsList: Document[]) => {
          this.documents = documentsList;
        })
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

}
