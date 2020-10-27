import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../models/blogpost';

@Component({
  selector: 'app-blogpost-edit',
  templateUrl: './blogpost-edit.component.html',
  styleUrls: ['./blogpost-edit.component.css']
})
export class BlogpostEditComponent implements OnInit {
  blogpostId: string;
  blogpost: Blogpost;

  constructor( private blogpostService: BlogpostService, private el: ElementRef, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.blogpostId = this.activatedRoute.snapshot.paramMap.get('id');
    this.blogpostService.getBlogpostById(this.blogpostId)
      .subscribe(data => {
        this.blogpost = data;
        console.log(this.blogpost);
      }, 
      error => console.error(error)); 
  }



  upload() {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#image');
    let fileCount : number = inputEl.files.length;
    let formData = new FormData();
    if(fileCount > 0) {
      formData.append('image',inputEl.files.item(0));
      this.blogpostService.uploadImage(formData).subscribe(data => console.log(data), err => console.error(err));
    }
  }
  
  updateBlogpost(formDirective : FormGroupDirective) {
    /*if (this.editForm.valid){
      console.log(this.editForm.value);
      this.blogpostService
        .updateBlogpost(this.blogpostId, this.editForm.value)
        .subscribe(data => this.handleSucess(data, formDirective), error => this.handleError(error));
    }*/
    const editedBlogpost = this.blogpost;
    this.blogpostService
      .updateBlogpost(this.blogpostId,editedBlogpost)
      .subscribe(data => this.handleSucess(data, formDirective), error => this.handleError(error));
  }

  handleSucess(data, formDirective) {
    console.log('OK handleSucess - blog post updated', data);
    formDirective.reset();
    formDirective.resetForm();
    this.blogpostService.dispatchBlogpostCreated(data._id);
  }

  handleError(error) {
    console.error('KO handleError - blog post NOT updated', error);
  }

} 
