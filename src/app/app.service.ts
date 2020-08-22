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
	private starredPlans: Plan[];
	private myPlans: Plan[];
	private externalPlans: Plan[];
	private myId: string;

	constructor(
		private httpClient: HttpClient,
		private storage: StorageService,
		private crawlService: CrawlService,
		// private noticeService: NoticeService,
	) {
		this.storage.mockDataInit();
		this.myId = MockData.myId;
		this.starredPlans = this.storage.getStarredPlans(this.myId);
		this.myPlans = this.storage.getPlans(this.myId);
		// this.externalPlans = this.storage.getExternalPlans();

		// if (this.externalPlans.length == 0) {
		// 	this.crawlService.getData().then(plans => {
		// 		this.externalPlans = plans;
		// 		this.storage.setExternalPlans(plans);
		// 	});
		// }

		this.myPlans.sort((a, b) => b.lastchangeAt.getTime() - a.lastchangeAt.getTime());

	}

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

	getStarredPlans(): Plan[] {
		return this.starredPlans;
	}

	postStarredPlan(id: string): void {
		if (!this.starredPlans.find(plan => plan.id===id)) {
			this.storage.addStarredPlan(this.myId, id);
			this.starredPlans=this.storage.getStarredPlans(this.myId);
		}
	}

	deleteStarredPlan(id: string): void {
		this.storage.deleteStarredPlan(this.myId, id);

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
		// let externalPlans = this.externalPlans.filter(plan => this.starredIds.includes(plan.id));
		// let plans = this.myPlans.filter(plan => this.starredIds.includes(plan.id))

		// return new Promise<Plan[]>(resolve => resolve(plans.concat(externalPlans)));
		// let plans = this.storage.getStarredPlans(this.myId)
		return new Promise<Plan[]>(resolve => resolve(this.starredPlans));
	}
}
