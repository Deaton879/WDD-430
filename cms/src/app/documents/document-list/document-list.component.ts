import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      1, 
      'CIT 260 - Object Oriented Programming', 
      'Detailed description of Object Oriented Programming course goes here.', 
      'https://content.byui.edu/file/b7c3e5ed-6947-497f-9d32-4e5b6b397cac/1/CIT 366 course description.pdf',
      null
    ),
    new Document(
      2, 
      'CIT 366 - Full Web Stack Development', 
      'Learn how to develop modern web applications using the MEAN stack', 
      'https://content.byui.edu/file/b7c3e5ed-6947-497f-9d32-4e5b6b397cac/1/CIT 366 course description.pdf',
      null
    ),
    new Document(
      3, 
      'CIT 425 - Data Warehousing', 
      'Detailed description of Data Warehousing course goes here.', 
      'https://content.byui.edu/file/b7c3e5ed-6947-497f-9d32-4e5b6b397cac/1/CIT 366 course description.pdf',
      null
    ),
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
