import { EventEmitter, Injectable } from "@angular/core";
import { Message } from './message.model';
import { MOCKMESSAGES } from "./MOCKMESSAGES";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    messageChangedEvent = new EventEmitter<Message[]>();

    messages: Message[] = [];
    maxMessageId: number;

    constructor(private http: HttpClient) {
        this.messages = MOCKMESSAGES;
    }

    getMaxId() {

        let maxId = 0;

        this.messages.forEach(message => {
            let currentId = +message.id;
            if (currentId > maxId) {
                maxId = currentId;
            }
        });

        return maxId;
    }

    getMessage(id: string) {
        this.messages.forEach(message => {
            if(message.id === id){
                return message;
            }
            else { return null; }
        });
    }

    getMessages(): Message[] {
        this.http
            .get(
                'https://dkecms-default-rtdb.firebaseio.com/messages.json'
            )
            .subscribe({
                next: (messages: Message[]) => {
                    this.messages = messages;
                    this.maxMessageId = this.getMaxId();
                    this.messages.sort();
                    this.messageChangedEvent.next([...this.messages]);
                },
                error: (e) => console.log(e.message),
            });
        return this.messages.slice();
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.storeMessages();
        console.log(this.messages)
    }

    storeMessages() {
        let messages = JSON.stringify(this.messages);
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        this.http
            .put(
                'https://dkecms-default-rtdb.firebaseio.com/messages.json',
                messages,
                httpOption
            )
            .subscribe( () => {
                this.messageChangedEvent.next([...this.messages]);
            })
    }
}