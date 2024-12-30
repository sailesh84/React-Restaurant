import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Analysis } from '@app/shared/models/analysis';
import { ProgressBar } from '@app/shared/models/progressbar';
import { formatNumber } from '@app/shared/helpers/math';
import { Time } from '@app/shared/enums/time.enums';

@Component({
  selector: 'app-dashboard-feature-project-progressbar',
  templateUrl: './dashboard-feature-project-progressbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./dashboard-feature-project-progressbar.component.scss']
})
export class DashboardFeatureProjectProgressbarComponent implements OnInit {

  @Input() analysis: Analysis;
  @Input() project: string;
  @Input() product: string;
  @Input() colors: { success: string, error: string, warning: string, failedcalculation: string } = { success: 'bg-success', error: 'bg-danger', warning: 'bg-warning', failedcalculation: 'bg-secondary' };
  @Input() labels: { success: string, error: string, warning: string, failedcalculation: string } = { success: '', error: '', warning: '', failedcalculation: '' };

  progressbars: ProgressBar[] = [];

  constructor() { }

  ngOnInit() {
    this.getAnalysis();
  }

  getAnalysis(): void {
    if (this.analysis) {
      this.createProgressBars();
    } else {
      this.progressbars = [];
    }
  }

  getZones(): any[] {

    // Fails counter
    const tabCountFails = [];
    let nbRows = this.analysis.data.cols.length - 1;
    let minus = 0;
    let i = 0;
    for (const value of this.analysis.data.cols[0].subcols[0].data) {
      let countFails = 0;

      for (let j = 1; j < this.analysis.data.cols.length; j++) {
        //Checking, whether the last object of "cols-subcols" array was "stable" or "acceptable"
        let isWeathervaning = this.analysis.data.cols[j].subcols[this.analysis.data.cols[j].subcols.length - 1].title;
        if (isWeathervaning.trim().toLowerCase() === 'stable') {

          let acceptable = this.analysis.data.cols[j].subcols[this.analysis.data.cols[j].subcols.length - 2].data;
          let stable = this.analysis.data.cols[j].subcols[this.analysis.data.cols[j].subcols.length - 1].data;
          if (acceptable.length === 0) {
            acceptable = new Array(this.analysis.data.cols[0].subcols[0].data.length).fill('');
            minus++;
          }

          //Checking, whether the "acceptable" array contains boolean value / 2d array value
          let acceptableResult = acceptable.every((elt) => {
            if (typeof elt === 'boolean') {
              return true;
            }
            return false;
          });

          if (acceptableResult === true) {
            //Acceptable array contains "boolean" value
            if (stable[i] === true) {
              if (acceptable[i] == false) {
                countFails++;
              }
            } else if (stable[i] === false) {
              countFails++;
            }
          }
          else {
            //Acceptable array contains "2d array" value
            if (stable[i] === true) {
              if (acceptable[i][0] == false && acceptable[i][1] == false) {
                countFails++;
              }
            } else if (stable[i] === false) {
              countFails++;
            }
          }
          tabCountFails.push({ project: this.analysis.project, date: this.analysis.data.rows[i], count: countFails, stable: stable[i], cols: this.analysis.data.cols[j].title });
        }
        else if (isWeathervaning.trim().toLowerCase() === "acceptable") {

          let acceptable = this.analysis.data.cols[j].subcols[this.analysis.data.cols[j].subcols.length - 1].data;
          if (acceptable.length === 0) {
            acceptable = new Array(this.analysis.data.cols[0].subcols[0].data.length).fill('');
            minus++;
          }
          if (acceptable[i] === false) {
            countFails++;
          }
          tabCountFails.push({ project: this.analysis.project, date: this.analysis.data.rows[i], count: countFails, stable: "No", cols: this.analysis.data.cols[j].title });
        }
      }
      // tabCountFails.push({ date: this.analysis.data.rows[i], count: countFails });
      i++;
    }
    minus = minus / this.analysis.data.cols[0].subcols[0].data.length;
    nbRows -= minus;

    // Zone generator
    const zones = [];
    let endDate = null;
    let color = '';

    for (let index = 0; index < tabCountFails.length - 1; index++) {
      if (index <= 0) {
        if (tabCountFails[index].count <= 0) {
          color = 'success';
        }
        else if (tabCountFails[index].count > 0 && tabCountFails[index].count < nbRows) {
          color = 'warning';
        }
        else {
          if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
            color = 'error';
          } else {
            color = 'failedcalculation';     //failed-calculation
          }
        }
      } else {
        if (tabCountFails[index].count <= 0) {
          if (tabCountFails[index + 1].count <= 0) { // Case V -> V
            // nothing (modified)
            endDate = tabCountFails[index + 1].date;
            zones.push({ value: endDate, color, project: tabCountFails[index].project });
            color = 'success';
          }
          else if (tabCountFails[index + 1].count > 0 && tabCountFails[index + 1].count < nbRows) { // Case V -> A
            // endDate = tabCountFails[index].date;
            // zones.push({ value: endDate, color });
            // color = 'warning';

            if (tabCountFails[index + 1].stable === true || tabCountFails[index + 1].stable === "No") {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'warning';
            } else {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'failedcalculation';     //failed-calculation
            }

          }
          else {  // Case V -> F
            if (tabCountFails[index + 1].stable === true || tabCountFails[index + 1].stable === "No") {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'error';
            } else {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'failedcalculation';     //failed-calculation
            }
          }
        }
        else if (tabCountFails[index].count > 0 && tabCountFails[index].count < nbRows) {
          if (tabCountFails[index + 1].count <= 0) { // Case A -> V
            endDate = tabCountFails[index + 1].date;
            zones.push({ value: endDate, color, project: tabCountFails[index].project });
            color = 'success';
          }
          else if (tabCountFails[index + 1].count > 0 && tabCountFails[index + 1].count < nbRows) { // Case A -> A
            // nothing
            // endDate = tabCountFails[index].date;
            // zones.push({ value: endDate, color });
            // color = 'warning';

            if (tabCountFails[index + 1].stable === true || tabCountFails[index + 1].stable === "No") {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'warning';
            } else {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'failedcalculation';     //failed-calculation
            }
          }
          else {  // Case A -> F
            if (tabCountFails[index + 1].stable === true || tabCountFails[index + 1].stable === "No") {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'error';
            } else {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'failedcalculation';       //failed-calculation
            }
          }
        }
        else {
          if (tabCountFails[index + 1].count <= 0) { // Case F -> V
            endDate = tabCountFails[index + 1].date;
            zones.push({ value: endDate, color, project: tabCountFails[index].project });
            color = 'success';
          }
          else if (tabCountFails[index + 1].count > 0 && tabCountFails[index + 1].count < nbRows) { // Case F -> A
            // endDate = tabCountFails[index].date;
            // zones.push({ value: endDate, color });
            // color = 'warning';

            if (tabCountFails[index + 1].stable === true || tabCountFails[index + 1].stable === "No") {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'warning';
            } else {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'failedcalculation';     //failed-calculation
            }
          }
          else {  // Case F -> F
            // nothing
            if (tabCountFails[index + 1].stable === true || tabCountFails[index + 1].stable === "No") {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'error';
            } else {
              endDate = tabCountFails[index].date;
              zones.push({ value: endDate, color, project: tabCountFails[index].project });
              color = 'failedcalculation';       //failed-calculation
            }
          }
        }
      }
    }

    if (tabCountFails.length > 0) {
      const lastElt = tabCountFails[tabCountFails.length - 1];
      if (lastElt.count <= 0) {
        color = 'success';
      } else if (lastElt.count > 0 && lastElt.count < nbRows) {
        // color = 'warning';

        if (lastElt.stable == true || lastElt.stable == "No") {
          color = 'warning';
        }
        else {
          color = 'failedcalculation';     //failed calculation
        }
      } else {
        if (lastElt.stable == true || lastElt.stable == "No") {
          color = 'error';
        }
        else {
          color = 'failedcalculation';     //failed calculation
        }
      }
      zones.push({ value: lastElt.date, color, project: lastElt.project });
      return zones;
    }
  }
  
  createProgressBars(): void {
    const zones = this.getZones();
    const dates = this.analysis.data.rows;
    const oneDayInSecond = 24 * 3600;
    const widthDay = (dates.length > 0) ? 100 / dates.length : 0;
    let startDate = dates[0] || null;
    let endDate = null;
    let id = 1;
    let width = 0;

    if(zones !== undefined){
      for (const zone of zones) {
        // if(zone.project === "63eb6447b4d63b13a82cb7be"){
        //   this.progressbars = [{"id":5,"startDate":1686546000000,"endDate":1686632400000,"width":1426.9406392694063,"class":"bg-warning","label":""},{"id":139,"startDate":1686632400000,"endDate":1686675600000,"width":513.6986301369863,"class":"bg-danger","label":""},{"id":184,"startDate":1686675600000,"endDate":1686884400000,"width":3424.6575342465735,"class":"bg-warning","label":""}];
        // }
        // else {
          endDate = zone.value;
          width = ((endDate - startDate) / oneDayInSecond) * widthDay;
          if (endDate === startDate && zones.length === 1) {
            width = widthDay;
          }
          if (width > 0) {
            if (this.progressbars.length > 0) {
              if (this.progressbars[this.progressbars.length - 1].class === this.colors[zone.color]) {
                this.progressbars[this.progressbars.length - 1].endDate = endDate;
                this.progressbars[this.progressbars.length - 1].width += width;
              } else {
                this.progressbars.push({ id, startDate, endDate, width, class: this.colors[zone.color], label: this.labels[zone.color] });
              }
            } else {
              this.progressbars.push({ id, startDate, endDate, width, class: this.colors[zone.color], label: this.labels[zone.color] });
            }
          }
          startDate = endDate;
          id++;
        // }

      }
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id
  }

  getDuration(startDate: number, endDate: number): string {
    return `${formatNumber((endDate - startDate) / Time.Hour, 1, 0, 0)} hrs`;
  }
}
