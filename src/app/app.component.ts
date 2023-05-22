import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  endpointURL: string = 'https://training-angular-bcfb8-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endpointURL+'post.json';
  loadedPosts = [];
  showLoading = false;
  updateForm : FormGroup;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();

    this.updateForm = new FormGroup({
      'id': new FormControl(''),
      'userInput': new FormGroup({
        'title': new FormControl(''),
        'content': new FormControl('')
      }) 
    });
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log(postData);
    this.http.post<{name: string}>(this.postURL, postData).subscribe(
      (data) =>{
        console.log(data);
      }
    )
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  onUpdatePosts(updateData) {
    console.log(updateData);
    var id = updateData.id;
    var input = updateData.userInput;
    console.log(input);
    const data = {
      [id]: {
          'title': input.title,
          'content': input.content
        }
    }
    this.http.patch(this.postURL, data).subscribe(
      (data)=>{
        console.log(data);
        this.fetchPosts();
      }
    )
  }

  private fetchPosts(){
    this.showLoading = true;
    this.http.get<{[key: string]: Post}>(this.postURL).pipe(
      map(responseData => {
        const postArray : Post[] = [];
        for(const key in responseData){
          console.log("key :"+key);
          if(responseData.hasOwnProperty(key)){
            console.log("Response Data : "+responseData[key]);
            postArray.push({...responseData[key], id:key});
          }
        } 
        return postArray;
      })
    )
    .subscribe(
      posts => {
        this.showLoading = false;
        this.loadedPosts = posts;
        console.log(posts); 
      }
    )
  }

  fillForm(data){
    console.log(data);
    this.updateForm.patchValue({
      'id': data.id,
      'userInput': {
        'title': data.title,
        'content': data.content
      }
    });
  }
}
