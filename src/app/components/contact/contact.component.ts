import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Contact from 'src/app/entity/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  form: FormGroup;
  submitted: boolean;
  emailPattern: string = "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$";
  isSubmitingData: boolean;
  success: boolean;
  form_id_js = "javascript_form";
  data_js = { "access_token": "p1jwag3spuqqjzbad0arqglv" };

  constructor(private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      subject: ["", Validators.required],
      message: ["", Validators.required],
    });
  }

  get f() { return this.form.controls; }

  submit() {

    this.submitted = true;
    if (this.form.valid) {
      this.isSubmitingData = true;
      const contact = <Contact>this.form.value;
      var request = new XMLHttpRequest();
      request.onreadystatechange = () => { this.onReadyStateChange(request) };
      this.data_js['subject'] = contact.subject;
      this.data_js['text'] = `${contact.email} sent: ${contact.message}`;
      var params = this.toParams(this.data_js);
      request.open("POST", "https://postmail.invotes.com/send", true);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.send(params);
      return false;
    }
  }

  onReadyStateChange(request: XMLHttpRequest): any {
    if (request.readyState == 4 && request.status == 200) {
      this.form.reset();
      this.isSubmitingData = false;
      this.submitted = false;
      this.success = true;
    } else
      if (request.readyState == 4) {
        alert("error")
      }
    return false;
  };

  toParams(data_js) {
    var form_data = [];
    for (var key in data_js) {
      form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(data_js[key]));
    }
    return form_data.join("&");
  }

}
