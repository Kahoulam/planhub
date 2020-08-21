import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Plan } from './models/plan';
import { CrawlService } from './crawl.service';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(
    private httpClient: HttpClient,
    private crawlService: CrawlService,
  ) {
    this.starList = [];
  }

  private starList: string[];

  getNew(): Promise<string> {
    let url = "https://codimd.schl.tw/api/new";
    let getNewId = (error: HttpErrorResponse) => {
      return Math.random().toString(16).slice(2);
      // return error.url.split('/').pop();
    };

    return this.httpClient.get<string>(url)
      .toPromise()
      .catch(getNewId);
  }

  getStarList(): string[] {
    return this.starList;
  }

  postStar(id: string): void {
    if (!this.starList.includes(id)) {
      this.starList.push(id);
    }
  }

  deleteStar(id: string): void {
    const index = this.starList.findIndex(p => p === id);
    if (index > -1) {
      this.starList.splice(index, 1);
    }
  }
  searchPlan(keyword: string): Promise<Plan[]> {
    let keywords = keyword.split(" ").filter(text => text != "");
    let includeKeywords = (plan: Plan) => keywords.every(keyword =>
      plan.title.includes(keyword) || plan.formats.includes(keyword)
    );

    return this.crawlService.getData().then(plans => plans.filter(includeKeywords));
  }
}
