import { Component } from '@angular/core';
import { RouterLink } from '../constant';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { NotifyService } from '../notify.service';
import { Notify } from '../models/notify';

@Component({
	selector: 'app-scaffold',
	templateUrl: './scaffold.component.html',
	styleUrls: ['./scaffold.component.scss']
})
export class ScaffoldComponent {
	constructor(
		private router: Router,
		private appService: AppService,
		public notifyService: NotifyService,
	) {
		if (this.notifies.length == 0) this.subscribeMsgs();
	}

	notifies: Notify[] = [];
	routerLink = RouterLink;
	keyword = '';
	keyWordTags = {};
	hotTags = []

	ngOnInit() {
		this.hotTags = ["年級", "科目"]
		this.keyWordTags = this.hotTags.reduce((a, key) => Object.assign(a, { [key]: "" }), {});
	}


	newPlan() {
		this.appService.getNew().then((id) => {
			this.router.navigate([RouterLink.EditingPlan, id]);
		});
	}

	getHotTags(): string[] {
		return this.hotTags;
	}

	onSearch(): void {
		console.log(this.keyWordTags);
		let isKeywordEmpty = 
			Object.values(this.keyWordTags).find(value => value !== "") === undefined &&
			this.keyword.length==0;
		if (isKeywordEmpty) return;

		this.router.navigate([RouterLink.Search], { queryParams: { q: this.keyword } });
	}

	resetKeyword() {
		this.keyword = "";
	}

	subscribeMsgs() {
		this.notifyService.getMsgs().subscribe(notifies => this.notifies = notifies)
	}
}
