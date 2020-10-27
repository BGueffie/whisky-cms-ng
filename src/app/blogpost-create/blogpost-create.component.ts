import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { BlogpostService } from '../blogpost.service';

@Component({
  selector: 'app-blogpost-create',
  templateUrl: './blogpost-create.component.html',
  styleUrls: ['./blogpost-create.component.css']
})
export class BlogpostCreateComponent implements OnInit {
  creationForm: FormGroup;
  
  constructor(private fb: FormBuilder, private blogpostService: BlogpostService, private el : ElementRef) {
    
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.creationForm = this.fb.group({
      title : '', 
      subTitle : '',
      content : '',
      image : ''
    });
  }

  upload() {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#image');
    let fileCount: number = inputEl.files.length;
    if(fileCount > 0){
      let formData = new FormData();
      formData.append('image',inputEl.files.item(0));
      this.blogpostService.uploadImage(formData).subscribe(data => console.log(data), error => console.error(error));
    }
  }

  createBlogpost(formDirective : FormGroupDirective){
    if(this.creationForm.valid){
      console.log(this.creationForm.value); 
      this.blogpostService
      .createBlogpost(this.creationForm.value)
      .subscribe(data => this.handleSucess(data,formDirective), error => this.handleError(error));
    }
  }

  handleSucess(data, formDirective){
    console.log('OK blog post created', data);
    this.creationForm.reset();
    formDirective.resetForm();
    this.blogpostService.dispatchBlogpostCreated(data._id);
  }

  handleError(error){
    console.error('KO blog post not created', error);
  }
  
}
