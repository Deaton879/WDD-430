import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('msgText') msgText!: ElementRef;
  @ViewChild('subject') subject!: ElementRef; 
  currentSender: string = "Dallas Eaton";
  @Output('addMessageEvent') onAddMessage = new EventEmitter<Message>(); 

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    this.onAddMessage.emit(new Message(1, this.subject.nativeElement.value, this.msgText.nativeElement.value, this.currentSender))
  }

  onClear() {
    this.msgText.nativeElement.value = "";
    this.subject.nativeElement.value = "";
  }

}
