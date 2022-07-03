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
        // this.messages.forEach(message => {
        //     if(message.id === id){
        //         return message;
        //     }
        //     else { return null; }
        // });
        return this.messages.find((message) => message.id == id);    
    }

    getMessages() {
        this.http
            .get<{message: string, posts: Message[]}>(
                'http://localhost:3000/messages'
                //'https://dkecms-default-rtdb.firebaseio.com/messages.json'
            )
            .subscribe({
                next: (messages) => {
                    this.messages = messages.posts;
                    console.log(this.messages);
                    this.maxMessageId = this.getMaxId();
                    this.messages.sort();
                    this.messageChangedEvent.next([...this.messages]);
                },
                error: (e) => console.log(e.message),
            });
        return this.messages.slice();
    }

    addMessage(message: Message) {

        // this.messages.push(message);
        // this.storeMessages();
        // console.log(this.messages)
        // make sure id of the new Message is empty
        //message.id = '';
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // add to database
        this.http.post<{ mess: string, message: Message }>('http://localhost:3000/messages/',
        message,
        { headers: headers })
        .subscribe(
            (responseData) => {
                // add new document to documents
                console.log(responseData);
                this.messages.push(responseData.message);
                this.sortAndSend();
            }
        );
    }
    
    sortAndSend() {
        this.messages.sort();
        this.storeMessages();
        this.messages = this.getMessages();
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
                'http://localhost:3000/messages/',
                //'https://dkecms-default-rtdb.firebaseio.com/messages.json',
                messages,
                httpOption
            )
            .subscribe( () => {
                this.messageChangedEvent.next([...this.messages]);
            })
    }
}