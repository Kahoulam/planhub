import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../models/plan';
import { AppService } from '../app.service';
import { StorageService } from '../storage.service';
import { RouterLink } from '../constant';

@Component({
  selector: 'plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {
  @Input() dataSource: Plan[];

  constructor(
    private service: AppService,
    public storage: StorageService,
  ) { }

  routerLink = RouterLink;

  ngOnInit(): void {
  }

  openPage(plan: Plan): void {
    window.open(plan.origin, '_blank');
  }

  view(plan: Plan): void {

  }

  isStarred(plan: Plan): boolean {
    return this.service.getMyStarredPlanIds().includes(plan.id);
  }

  setStar(plan: Plan): void {
    if (this.isStarred(plan)) {
      this.service.deleteMyStarredPlan(plan.id);
    } else {
      this.service.postMyStarredPlan(plan.id);
    }
  }

  deleteMyPlan(plan: Plan): void {
    this.dataSource = this.dataSource.filter(value => value.id != plan.id);
    this.service.deleteMyPlan(plan.id);
  }

  getForkFrom(plan:Plan){
    let ret=this.storage.getPlan(plan.id).forkFrom
    return ret===undefined?"":"fork from: "+ret
  }

  static imgs=[
    "https://res.cloudinary.com/www-virgin-com/virgin-com-prod/sites/virgin.com/files/Articles/Getty/finland_education_getty_0.jpg",
  ]

  getImg(plan: Plan): string {
    if(plan.content!==undefined && plan.content.includes(".jpg")){
      // TODO: 偵測content中的圖片作為預覽圖
      return "";
    }else{
      // return PlanListComponent.imgs[Math.random() * Math.floor(PlanListComponent.imgs.length-1)];
      return "";
    }
  }
}
