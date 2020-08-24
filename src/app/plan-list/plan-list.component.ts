import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../models/plan';
import { AppService } from '../app.service';
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
    return this.getStarredPlanIds().includes(plan.id);
  }

  getStarredPlanIds(){
    let ret=[]
    this.service.getStarredPlans().forEach(plan=> ret.push(plan.id) )
    return ret;
  }

  setStar(plan: Plan): void {
    if (this.isStarred(plan)) {
      this.service.deleteStarredPlan(plan.id);
    } else {
      this.service.postStarredPlan(plan.id);
    }
  }

  deletePlan(plan: Plan): void {
    this.dataSource = this.dataSource.filter(value => value.id != plan.id);
    this.service.deleteMyPlan(plan.id);
  }

  static imgs=[
    "https://res.cloudinary.com/www-virgin-com/virgin-com-prod/sites/virgin.com/files/Articles/Getty/finland_education_getty_0.jpg",
  ]

  getImg(plan: Plan): string {
    if(plan.content.includes("http")){
      // TODO: 偵測content中的圖片作為預覽圖
      return "";
    }else{
      return PlanListComponent.imgs[Math.random() * Math.floor(PlanListComponent.imgs.length-1)];
    }
  }
}
