import { Component, OnInit, HostListener  } from '@angular/core';
import { DummyServiceService } from 'src/app/services/dummy-service.service';
import { Post } from 'src/app/shared/models/post.model';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {

  newList:Post[] = [];
  isRequestingData:boolean = false;
  category:string = "";
  pages=0;
  constructor(private ds:DummyServiceService) {
  
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if(pos == max || pos > max-30 )   {
        //Do your action here
      if(this.isRequestingData){

      }else{
        this.getPostList();

      }
    }
  }
  ngOnInit(): void {
      this.getPostList();
    }
  getPostList(){
    console.log(this.newList.length);
    this.isRequestingData = true;
    this.ds.getPostList(this.pages, this.category)// resp is of type `HttpResponse<Config>`
    .subscribe(resp => {
      const body = { ... resp.body };
      let postList = body.data;
      // console.log(jsonpost);
      postList.forEach((element: any) => {
        let stat = new Post().deserialize(element);
        this.newList.push(stat);
        });
      this.pages++;
      this.isRequestingData = false;
    });

  }
  onCategoryClicked($event:string){
      console.log($event);
      this.category = $event;
      this.newList = [];
      this.pages = 0;
      window.scroll(0,0);
      this.getPostList();
  }
}