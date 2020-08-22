import { Component } from '@angular/core';
import { RouterLink } from '../constant';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';


@Component({
	selector: 'app-scaffold',
	templateUrl: './scaffold.component.html',
	styleUrls: ['./scaffold.component.scss']
})
export class ScaffoldComponent {
	constructor(
		private router: Router,
		private appService: AppService,

		private _bottomSheet: MatBottomSheet
	) { }


	routerLink = RouterLink;
	keyword = '';

	newPlan() {
		this.appService.getNew().then((id) => {
			this.router.navigate([RouterLink.Plan, id]);
		});
	}

	onSearch(): void {
		let isKeywordEmpty = this.keyword.trim().length == 0;
		if (isKeywordEmpty) return;

		this.router.navigate([RouterLink.Search], { queryParams: { q: this.keyword } });
	}

	openBottomSheet(): void {
		this._bottomSheet.open(BottomSheet);
	  }
}

@Component({
	selector: 'bottom-sheet-overview-example-sheet',
	templateUrl: 'bottom-sheet.component.html',
  })
  export class BottomSheet {
	constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheet>) {}
  
	openLink(event: MouseEvent): void {
	  this._bottomSheetRef.dismiss();
	  event.preventDefault();
	}
  }