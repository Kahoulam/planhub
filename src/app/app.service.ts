import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Plan } from './models/plan';
import { StorageService } from './storage.service';
import { CrawlService } from './crawl.service';
import {NotifyService} from './notify.service';
import { Notify } from './models/notify';
import { MockData } from './constant';

@Injectable({
	providedIn: 'root'
})

export class AppService {
	private myStarredPlans: Plan[];
	private myPlans: Plan[];
	private externalPlans: Plan[];
	private myId: string;

	constructor(
		private httpClient: HttpClient,
		private storage: StorageService,
		private crawlService: CrawlService,
		private notifyService: NotifyService,
	) {
		this.storage.mockDataInit();
		this.myId = MockData.myId;
		this.myStarredPlans = this.storage.getStarredPlans(this.myId);
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

	/* Starred Plan */

	getMyStarredPlans(): Plan[] {
		return this.myStarredPlans;
	}

	postMyStarredPlan(id: string): void {
		if (!this.myStarredPlans.find(plan => plan.id===id)) {
			this.storage.addStarredPlanId(this.myId, id);
			this.myStarredPlans=this.storage.getStarredPlans(this.myId);

			this.notifyService.add(new Notify({
				title:"add starred",msg:",plan:"+id
			}))
		}
	}

	deleteMyStarredPlan(id: string): void {
		this.storage.deleteStarredPlanId(this.myId, id);
		this.myStarredPlans=this.storage.getStarredPlans(this.myId);

		this.notifyService.add(new Notify({
			title:"delete starred",msg:",plan:"+id
		}))
	}

	getStarred(): Promise<Plan[]> {
		// let externalPlans = this.externalPlans.filter(plan => this.starredIds.includes(plan.id));
		// let plans = this.myPlans.filter(plan => this.starredIds.includes(plan.id))

		// return new Promise<Plan[]>(resolve => resolve(plans.concat(externalPlans)));
		// let plans = this.storage.getStarredPlans(this.myId)
		return new Promise<Plan[]>(resolve => resolve(this.myStarredPlans));
	}

	getMyStarredPlanIds(): string[] {
		let ret=[];
		this.getMyStarredPlans().forEach(plan=> ret.push(plan.id) )
		return ret;
	}

	/* My Plan */

	getMyPlans(): Promise<Plan[]> {
		return new Promise<Plan[]>(resolve => resolve(this.myPlans));
	}

	addMyPlan(plan:Plan){
		this.storage.addPlan(MockData.myId,plan);
		this.myPlans= this.storage.getPlans(this.myId);

		this.notifyService.add(new Notify({
			title:"你 新增了一個標題為「"+plan.title+"」的教案",msg:"授權狀況: 沒有甚麼特別的"
		}))
	}

	deleteMyPlan(id: string): void {
		this.myPlans = this.myPlans.filter(value => value.id != id);
		this.storage.deletePlan(id,null);

		this.notifyService.add(new Notify({
			title:"delete plan",msg:",plan:"+id
		}))
	}

	/* Other */

	searchPlan(keyword: string): Promise<Plan[]> {
		const keywords = keyword.split(" ").filter(text => text != "");
		let includeKeywords = (plan: Plan) => keywords.every(keyword =>
			plan.title.includes(keyword) || plan.formats.includes(keyword)
		);
		let result = this.externalPlans.filter(includeKeywords);

		return new Promise<Plan[]>(resolve => resolve(result));
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
}
