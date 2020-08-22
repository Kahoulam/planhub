import { Injectable } from '@angular/core';
import { Plan } from './models/plan';
import { User } from './models/user';
import { Column } from './constant'
import { MockData } from './constant';

@Injectable({
	providedIn: 'root'
})

export class StorageService {

	constructor() { }

	getMyPlans(): Plan[] {
		let result = this.getPlans(MockData.myId);
		if (result == null) {
			return [];
		}
		console.log("getMyPlans,"+result.length);
	}

	setMyPlans(value: Plan[]) {
		console.log("setMyPlans,"+value.length);
		if (value == null) {
			this.remove(MockData.myId);
		} else {
			// this.set(Column.MY_PLANS, value);
			this.setPlans(MockData.myId,value)
		}
	}

	getExternalPlans(): Plan[] {
		let result = this.get(Column.EX_PLANS);
		if (result == null) {
			return [];
		}
		let ret=Plan.fromArray(result);
		console.log("getExternalPlans,"+ret.length);
		return ret;
	}

	setExternalPlans(value: Plan[]) {
		console.log("setExternalPlans,"+value.length);
		if (value == null) {
			this.remove(Column.EX_PLANS);
		} else {
			this.set(Column.EX_PLANS, value);
		}
	}

	// getStarredIds(): string[] {
	//   let result = this.get<string[]>(Column.STARRED_IDS);
	//   if (result == null) {
	//     return [];
	//   }

	//   return result;
	// }

	// setStarredIds(value: string[]) {
	//   if (value == null) {
	//     this.remove(Column.STARRED_IDS);
	//   } else {
	//     this.set(Column.STARRED_IDS, value);
	//   }
	// }

	get<T>(key: string): T {
		let result = localStorage.getItem(key);

		if (result == null) {
			return null;
		}

		return JSON.parse(result);
	}

	set(key: string, value: any) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	remove(key: string): void {
		localStorage.removeItem(key);
	}

	// nesl

	getPlans(writer: string): Plan[] {
		let result = this.get(writer);
		if (result == null) {
			return [];
		}
		let ret=Plan.fromArray(result);
		console.log("getPlans,"+ret.length)
		return ret;
	}

	addPlan(writer: string, newPlan: Plan) {
		// console.log("addPlan,writer:"+writer+",Plan:"+newPlan.id);
		let oldPlans = this.getPlans(writer);
		oldPlans.push(newPlan);
		this.set(writer, oldPlans);
	}

	setPlans(userId:string,value: Plan[]) {
		console.log("setPlans,userId:"+userId+",value:"+value.length);
		if (value == null) {
			this.remove(userId);
		} else {
			value.forEach(element => this.addPlan(userId, element));
		}
	}

	getStarredPlans(giver: string): string[] {
		// 傳入使用者，回傳使用者給過星星的專案
		let plans=MockData.PLANS;
		plans=plans.filter(plan => plan.starred.includes(giver)); // TODO: 尋求更好的寫法
		let ret=[];
		plans.forEach(plan=> ret.push(plan.id))
		console.log("getStarredPlans,"+giver+",ret:"+ret.length);
		return ret;
	}

	addStarredPlan(giver: string, planId: string): boolean {
		// 傳入使用者，新增其至plan的「給星星名單」
		let plans = Plan.fromArray( this.get("plans"));
		plans.find(plan =>plan.id==planId).starred.push(giver)
		this.set("plans",plans); // TODO: move to commit function
		return true;
	}

	setStarredIds(userId:string,value: string[]) { // TODO: remove
		if (value == null) {
		  this.remove(userId);
		} else {
			value.forEach(planId =>this.addStarredPlan(userId,planId));
		}
	  }
}
