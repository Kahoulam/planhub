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

	mockDataInit(){
		this.set("plans",MockData.PLANS);
		this.set("users",MockData.USERS);
	}

	getMyPlans(): Plan[] {
		let result = this.getPlans(MockData.myId);
		if (result == null) {
			return [];
		}
	}

	setMyPlans(value: Plan[]) {
		if (value == null) {
			this.remove(MockData.myId);
		} else {
			this.setPlans(MockData.myId,value)
		}
	}

	getExternalPlans(): Plan[] {
		let result = this.get(Column.EX_PLANS);
		if (result == null) {
			return [];
		}
		let ret=Plan.fromArray(result);
		return ret;
	}

	setExternalPlans(value: Plan[]) {
		if (value == null) {
			this.remove(Column.EX_PLANS);
		} else {
			this.set(Column.EX_PLANS, value);
		}
	}

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
		return ret;
	}

	addPlan(writer: string, newPlan: Plan) {
		let oldPlans = this.getPlans(writer);
		oldPlans.push(newPlan);
		this.set(writer, oldPlans);
	}

	setPlans(userId:string,value: Plan[]) {
		if (value == null) {
			this.remove(userId);
		} else {
			value.forEach(element => this.addPlan(userId, element));
		}
	}

	getStarredPlans(giver: string): Plan[] {
		// 傳入使用者，回傳使用者給過星星的專案
		let plans=Plan.fromArray( this.get("plans"));
		return plans.filter(plan => plan.starred.includes(giver));
	}

	addStarredPlan(giver: string, planId: string): boolean {
		// 傳入使用者，新增其至plan的「給星星名單」
		let plans = Plan.fromArray( this.get("plans"));
		plans.find(plan =>plan.id==planId).starred.push(giver)
		this.set("plans",plans); // TODO: move to commit function
		return true;
	}

	deleteStarredPlan(user:string,target:string){
		let starredIds=[]
		this.getStarredPlans(user).forEach(plan=> starredIds.push(plan.id ));
		let index = starredIds.findIndex(p => p === target);
		if (index > -1) {
			starredIds.splice(index, 1);
			starredIds.forEach(planId =>this.addStarredPlan(user,planId));
		}
	}
}
