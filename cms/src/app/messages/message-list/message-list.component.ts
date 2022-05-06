import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Message } from '../message.model';
@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(1,"test", "This is a test!", "Me"),
    new Message(1,"test", "This is a test!", "Me")
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
