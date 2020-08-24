import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { EditorComponent } from '../editor/editor.component';
import { StorageService } from '../storage.service';
import { Plan } from '../models/plan';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

export declare type Params = {
  id: string;
};

@Component({
  selector: 'app-editing-plan',
  templateUrl: './editing-plan.component.html',
  styleUrls: ['./editing-plan.component.scss']
})
export class EditingPlanComponent implements OnInit, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private appService: AppService,
    private storage: StorageService,
  ) { }

  @ViewChild('editor') editor: EditorComponent;

  plan: Plan = new Plan();

  ngOnInit(): void {
    var initPlan = (params: Params) => {
      this.plan = this.storage.getPlan(params.id);
     

      if (this.plan == null) {
        console.log("this.plan == null; not my plan");
        this.plan = new Plan({
          id: params.id,
          title: "Untitled",
          lastchangeAt: new Date(),
        });
      }
    }

    this.route.params.subscribe(initPlan);
  }

  ngAfterViewInit(): void {
    this.editor.focus()
  }

  @HostListener('window:beforeunload')
  save(): void {
    this.plan.content = this.editor.getMarkdown();
    this.plan.lastchangeAt = new Date();
    this.appService.addMyPlan(this.plan);

    this.location.back();
  }
}

