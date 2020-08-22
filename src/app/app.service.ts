import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Plan } from './models/plan';
import { StorageService } from './storage.service';
import { CrawlService } from './crawl.service';

import { MockData } from './constant';

// source : https://ed.arte.gov.tw/ch/content/m_design_list_1.aspx?PageNo=1

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    private httpClient: HttpClient,
    private storage: StorageService,
    private crawlService: CrawlService,
  ) {
    this.starredIds = this.storage.getStarredIds();
    this.myPlans = this.storage.getMyPlans();
    this.externalPlans = this.storage.getExternalPlans();

    if (this.storage.getExternalPlans().length == 0) {
      this.crawlService.getData().then(plans => {
        this.externalPlans = plans;
        this.storage.setExternalPlans(plans);
      });
    }

    if (this.storage.getMyPlans().length == 0) {
      this.storage.setMyPlans(MockData.MY_PLANS);
      this.myPlans = MockData.MY_PLANS;
    }

    this.myPlans.sort((a, b) => b.lastchangeAt.getTime() - a.lastchangeAt.getTime());

  }

  private starredIds: string[];
  private myPlans: Plan[];
  private externalPlans: Plan[];

  getNew(): Promise<string> {
    const url = "https://codimd.schl.tw/api/new";
    let getNewId = (error: HttpErrorResponse) => {
      return Math.random().toString(16).slice(2);
      // return error.url.split('/').pop();
    };

    return this.httpClient.get<string>(url)
      .toPromise()
      .catch(getNewId);
  }

  getStarredIds(): string[] {
    return this.starredIds;
  }

  postStarredId(id: string): void {
    if (!this.starredIds.includes(id)) {
      this.starredIds.push(id);
      this.storage.setStarredIds(this.starredIds);
    }
  }

  deleteStarredId(id: string): void {
    const index = this.starredIds.findIndex(p => p === id);
    if (index > -1) {
      this.starredIds.splice(index, 1);
      this.storage.setStarredIds(this.starredIds);
    }
  }

  getMyPlans(): Promise<Plan[]> {
    return new Promise<Plan[]>(resolve => resolve(this.myPlans));
  }

  deleteMyPlan(id: string): void {
    this.myPlans = this.myPlans.filter(value => value.id != id);
    this.storage.setMyPlans(this.myPlans);
  }

  searchPlan(keyword: string): Promise<Plan[]> {
    const keywords = keyword.split(" ").filter(text => text != "");
    let includeKeywords = (plan: Plan) => keywords.every(keyword =>
      plan.title.includes(keyword) || plan.formats.includes(keyword)
    );
    let result = this.externalPlans.filter(includeKeywords);

    return new Promise<Plan[]>(resolve => resolve(result));
  }

  getStarred(): Promise<Plan[]> {
    let externalPlans = this.externalPlans.filter(plan => this.starredIds.includes(plan.id));
    let plans = this.myPlans.filter(plan => this.starredIds.includes(plan.id))

    return new Promise<Plan[]>(resolve => resolve(plans.concat(externalPlans)));
  }
}
