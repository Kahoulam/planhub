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
		console.log("mockDataInit");
		this.set("plans",MockData.PLANS);
		this.set("users",MockData.USERS);
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

	/* DB */ // TODO: commit to DB function

	private getDBPlans(): Plan[] {
		return Plan.fromArray( this.get("plans"));
	}

	private setDBPlans( plans:Plan[]) {
		return this.set("plans",plans);
	}

	private getDBUsers(): User[] {
		return User.fromArray( this.get("users"));
	}

	private setDBUsers( users:User[]) {
		return this.set("users",users);
	}

	/* Plan */

	getPlan(planId: string): Plan {
		return this.getDBPlans().find(plan=> planId===plan.id);
	}

	searchPlan(keyword: string): Promise<Plan[]> {
		const keywords = keyword.split(" ").filter(text => text != "");
		let includeKeywords = (plan: Plan) => keywords.every(keyword =>
			plan.title.includes(keyword) || plan.formats.includes(keyword)
		);
		let result = this.getDBPlans().filter(includeKeywords);

		return new Promise<Plan[]>(resolve => resolve(result));
	}


	addPlan(userId:string,newPlan: Plan) {
		this.deletePlan(newPlan.id,newPlan)

		let user=this.getUser(userId);
		user.plans = user.plans.filter(value => value != newPlan.id);
		user.plans.push( newPlan.id)
		this.addUser(user);
	}

	deletePlan(planId:string,replacement:Plan){
		let plans=this.getDBPlans();
		let index=plans.findIndex(plan=>plan.id==planId)
		if(index>-1){
			plans.splice(index, 1);
		}
		if(replacement!=null)plans.push(replacement)
		this.setDBPlans(plans);
	}

	/* User*/

	getUser(userId: string): User {
		return this.getDBUsers().find(user=> userId===user.id);
	}

	addUser(user:User) {
		this.deleteUser(user.id,user)
	}

	deleteUser(userId:string,replacement:User) {
		let users=this.getDBUsers();
		let index=users.findIndex(user=>user.id==userId)
		if(index>-1){
			users.splice(index, 1);
			if(replacement!=null) users.push(replacement)
		}
		this.setDBUsers(users);
	}

	/* Plan Starred */

	getStarredPlanIds(giver: string): string[] {
		let ret=[];
		this.getStarredPlans(giver).forEach(plan=> ret.push(plan.id) )
		return ret;
	}

	addStarredPlanId(giver: string, planId: string) {
		let plan=this.getPlan(planId)
		plan.starred.push(giver)
		this.deletePlan(planId,plan)
	}

	deleteStarredPlanId(user:string,target:string){
		let plan=this.getPlan(target)
		plan.starred =plan.starred.filter(value => value != user);
		this.deletePlan(target,plan)
	}

	/* User and Plan */

	getPlans(writer: string): Plan[] {
		let planIds =this.getDBUsers().find(user => user.id==writer).plans;
		return this.getDBPlans().filter(plan=> planIds.includes(plan.id) );
	}

	getWriter(plan: Plan): User {
		return this.getDBUsers().find(user=> user.plans.includes(plan.id) );
	}

	getStarredPlans(giver: string): Plan[] {
		// 傳入使用者，回傳使用者給過星星的專案
		return this.getDBPlans().filter(plan => plan.starred.includes(giver));
	}
}
