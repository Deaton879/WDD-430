import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('msgText') msgText!: ElementRef;
  @ViewChild('subject') subject!: ElementRef; 
  currentSender: string = "1";
  //@Output('addMessageEvent') onAddMessage = new EventEmitter<Message>(); 

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSendMessage() {
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    // const newIngredient = new Ingredient(ingName, ingAmount);
    // this.slService.addIngredient(newIngredient);
    const subject = this.subject.nativeElement.value;
    const text = this.msgText.nativeElement.value;
    const newMessage = new Message('1', subject, text, this.currentSender);
    this.messageService.addMessage(newMessage);
    console.log(newMessage);
  }

  onClear() {
    this.msgText.nativeElement.value = "";
    this.subject.nativeElement.value = "";
  }

}
