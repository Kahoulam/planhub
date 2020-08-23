import { Injectable } from '@angular/core';
import { Plan } from './models/plan';
import { User } from './models/user';
import { Column } from './constant'
import { MockData } from './constant';
import {NotifyService} from './notify.service';
import { Notify } from './models/notify';

@Injectable({
	providedIn: 'root'
})

export class StorageService {

	constructor(private notifyService:NotifyService) { }

	mockDataInit(){
		console.log("mockDataInit");
		this.set("plans",MockData.PLANS);
		this.set("users",MockData.USERS);
	}

	// getMyPlans(): Plan[] {
	// 	let result = this.getPlans(MockData.myId);
	// 	if (result == null) {
	// 		return [];
	// 	}
	// }

	// setMyPlans(value: Plan[]) {
	// 	if (value == null) {
	// 		this.remove(MockData.myId);
	// 	} else {
	// 		this.setPlans(MockData.myId,value)
	// 	}
	// }

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
		// this.notifyService.add(new Notify({
		// 	title:"get",msg:"get"
		// }))

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

	addPlan(userId:string,newPlan: Plan) {
		this.deletePlan(newPlan.id,function(plans:Plan[]){
			plans.push(newPlan)
		})

		let user=this.getUser(userId);
		user.plans = user.plans.filter(value => value != newPlan.id);
		user.plans.push( newPlan.id)
		this.addUser(user);
		
		this.notifyService.add(new Notify({
			title:"add Plan",msg:",plan:"+newPlan.id
		}))
	}

	deletePlan(planId:string,func){
		let plans=this.getDBPlans();
		let index=plans.findIndex(plan=>plan.id==planId)
		if(index>-1){
			plans.splice(index, 1);
			this.notifyService.add(new Notify({
				title:"delete Plan",msg:",plan:"+planId
			}))
		}
		if(func!=null)func(plans);
		this.setDBPlans(plans);
	}

	/* User*/

	getUser(userId: string): User {
		return this.getDBUsers().find(user=> userId===user.id);
	}

	addUser(user:User) {
		this.deleteUser(user.id,function(users:User[]){
			users.push(user)
		})
		this.notifyService.add(new Notify({
			title:"add User",msg:",user:"+user.id
		}))
	}

	deleteUser(userId:string,func) {
		let users=this.getDBUsers();
		let index=users.findIndex(user=>user.id==userId)
		if(index>-1){
			users.splice(index, 1);
			this.notifyService.add(new Notify({
				title:"delete User",msg:",user:"+userId
			}))
		}
		if(func!=null)func(users);
		this.setDBUsers(users);
	}

	/* User and Plan */

	getPlans(writer: string): Plan[] {
		let planIds = User.fromArray(this.get("users")).find(user => user.id==writer).plans;
		return this.getDBPlans().filter(plan=> planIds.includes(plan.id) );
	}

	/* Starred */

	getStarredPlans(giver: string): Plan[] {
		// 傳入使用者，回傳使用者給過星星的專案
		return this.getDBPlans().filter(plan => plan.starred.includes(giver));
	}

	addStarredPlan(giver: string, planId: string): boolean {
		// 傳入使用者，新增其至plan的「給星星名單」
		let plans = this.getDBPlans();
		plans.find(plan =>plan.id==planId).starred.push(giver)
		this.setDBPlans(plans);
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
