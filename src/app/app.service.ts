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
	private myId: string;

	constructor(
		private httpClient: HttpClient,
		private storage: StorageService,
		private crawlService: CrawlService,
		private notifyService: NotifyService,
	) {
		this.myId = MockData.myId;
		this.initStorage().then(() => this.initValues());
	}

	private initStorage(): Promise<void> {
		this.storage.mockDataInit();

		let initExternalPlnas = (): Promise<string> => new Promise(resolve => {
		  if (this.storage.getExternalPlans().length == 0) {
			this.crawlService.getData().then(plans => this.storage.setExternalPlans(plans));
		  }
	
		  resolve();
		});

		let initPlnas = (): void => {
			this.storage.getExternalPlans().forEach(plan=>this.storage.addPlan(this.myId,plan))
		};
	
		return initExternalPlnas().then(initPlnas);
	  }
	
	  private initValues(): void {
		this.myStarredPlans = this.storage.getStarredPlans(this.myId);
		this.myPlans = this.storage.getPlans(this.myId);
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
		return this.storage.searchPlan(keyword);
	}

	async getNew(): Promise<string> {
		let untitledPlan = new Plan({
		  id: Math.random().toString(16).slice(2),
		  title: "Untitled",
		  lastchangeAt: new Date(),
		});
		this.addMyPlan(untitledPlan)
		return untitledPlan.id;
	
	  }
}
