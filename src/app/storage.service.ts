import { Injectable } from '@angular/core';
import { Plan } from './models/plan';
import { Column } from './constant'

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

  getMyPlans(): Plan[] {
    let result = this.get(Column.MY_PLANS);
    if (result == null) {
      return [];
    }

    return Plan.fromArray(result);
  }

  setMyPlans(value: Plan[]) {
    if (value == null) {
      this.remove(Column.MY_PLANS);
    } else {
      this.set(Column.MY_PLANS, value);
    }
  }

  getExternalPlans(): Plan[] {
    let result = this.get(Column.EX_PLANS);
    if (result == null) {
      return [];
    }

    return Plan.fromArray(result);
  }

  setExternalPlans(value: Plan[]) {
    if (value == null) {
      this.remove(Column.EX_PLANS);
    } else {
      this.set(Column.EX_PLANS, value);
    }
  }

  getStarredIds(): string[] {
    let result = this.get<string[]>(Column.STARRED_IDS);
    if (result == null) {
      return [];
    }

    return result;
  }

  setStarredIds(value: string[]) {
    if (value == null) {
      this.remove(Column.STARRED_IDS);
    } else {
      this.set(Column.STARRED_IDS, value);
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
}
