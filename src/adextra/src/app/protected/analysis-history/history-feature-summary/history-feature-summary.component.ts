import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Analysis } from '@app/shared/models/analysis';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_boost from 'highcharts/modules/boost';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_drag_panes from 'highcharts/modules/drag-panes';
import HC_accessibility from 'highcharts/modules/accessibility';
import { Time } from '@app/shared/enums/time.enums';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Explanation } from '@app/shared/models/explanation';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
HC_stock(Highcharts);
HC_boost(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_drag_panes(Highcharts);
HC_accessibility(Highcharts);

// For highcharts, load moment in global
(window as any).moment = moment;
momentTZ();

@Component({
  selector: 'app-history-feature-summary',
  templateUrl: './history-feature-summary.component.html',
  styleUrls: ['./history-feature-summary.component.scss']
})
export class HistoryFeatureSummaryComponent implements OnInit, OnChanges {

  @Input() analysis: Analysis;
  @Input() explanation: Explanation;
  @Input() timezone: string;

  min: number;
  max: number;
  highcharts = Highcharts;
  chartOptions = {};
  colorList: any[];

  @ViewChild('modalHelp', { static: false }) modalHelp: ElementRef;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = {};
    if (this.analysis) {
      this.generateChart();
    }
    if (this.timezone) {
      // overrides global time config for Highcharts
      Highcharts.setOptions({
        time: {
          timezone: this.timezone
        },
      });
      // add custom format : zone hour offset format
      Highcharts.dateFormats.Z = (timestamp) => {
        return `GMT ${momentTZ(timestamp).tz(this.timezone).format('Z')}`;
      };
    }
  }

  private open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', backdrop: 'static', scrollable: true })
      .result.then((result) => {
        // this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private generateChart(): void {
    const that = this;
    this.chartOptions = {
      chart: {
        zoomType: 'x',
      },
      exporting: {
        buttons: {
          explanationButtonChart: {
            // text: 'See explanation',
            onclick() {
              that.open(that.modalHelp);
            }
          }
        },
        sourceWidth: 1800,
      },
      legend: {
        enabled: false
      },
      boost: {
        useGPUTranslations: true
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      },
      title: {
        text: 'Summary of Weather Forecast Analysis Results'
      },
      scrollbar: {
        barBackgroundColor: '#009dd6',
        barBorderRadius: 7,
        barBorderWidth: 0,
        buttonBackgroundColor: '#009dd6',
        buttonBorderWidth: 0,
        buttonBorderRadius: 7,
        trackBackgroundColor: 'none',
        trackBorderWidth: 1,
        trackBorderRadius: 8,
        trackBorderColor: '#00a3e0'
      },
      rangeSelector: {
        buttonTheme: { // styles for the buttons
          fill: 'none',
          stroke: '#009dd6',
          'stroke-width': 1,
          r: 8,
          width: 32,
          style: {
            color: '#009dd6',
            fontWeight: 'bold'
          },
          states: {
            hover: {
              fill: '#009dd6',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#009dd6',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#009dd6',
        inputBoxWidth: 120,
        inputBoxHeight: 18,
        inputStyle: {
          color: '#009dd6',
          fontWeight: 'bold'
        },
        labelStyle: {
          color: '#512d6d',
          fontWeight: 'bold'
        },
        buttons: [{
          type: 'day',
          count: 1,
          text: '24h',
          events: {
            click() {
              for (const chart of Highcharts.charts) {
                if (chart !== undefined) {
                  chart.xAxis[0].setExtremes(chart.xAxis[0].min, chart.xAxis[0].min + Time.Day, false);
                  chart.redraw();
                }
              }
            }
          }
        }, {
          type: 'day',
          count: 2,
          text: '48h',
          events: {
            click() {
              for (const chart of Highcharts.charts) {
                if (chart !== undefined) {
                  chart.xAxis[0].setExtremes(chart.xAxis[0].min, chart.xAxis[0].min + (Time.Day * 2), false);
                  chart.redraw();
                }
              }
            }
          }
        }, {
          type: 'day',
          count: 3,
          text: '72h',
          events: {
            click() {
              for (const chart of Highcharts.charts) {
                if (chart !== undefined) {
                  chart.xAxis[0].setExtremes(chart.xAxis[0].min, chart.xAxis[0].min + (Time.Day * 3), false);
                  chart.redraw();
                }
              }
            }
          }
        }, {
          type: 'all',
          text: 'Reset',
          events: {
            click() {
              for (const chart of Highcharts.charts) {
                if (chart !== undefined) {
                  chart.xAxis[0].setExtremes(chart.xAxis[0].min, chart.xAxis[0].max, false);
                  chart.redraw();
                }
              }
            }
          }
        }],
        inputDateFormat: '%a %e %b %H:%M',
        inputEditDateFormat: '%a %e %b %H:%M',
      },
      navigator: {
        height: 80,
        outlineColor: '#00a3e0',
        maskFill: 'rgba(0, 163 , 224, 0.05)',
        series: {
          type: 'areaspline',
          fillOpacity: 0.75,
          lineWidth: 1,
          marker: {
            enabled: true,
            symbol: 'circle'
          }
        },
        xAxis: {
          tickWidth: 0,
          lineWidth: 0,
          gridLineWidth: 1,
          pointInterval: Time.Day,
          tickPixelInterval: 200,
          type: 'datetime',
          dateTimeLabelFormats: {
            day: '%a %e %b %H:%M'
          },
          labels: {
            align: 'left',
            style: {
              color: 'black'
            },
            x: 3,
            y: -4
          }
        }
      },
      xAxis: [{ // Bottom X axis
        id: 'main',
        type: 'datetime',
        pointInterval: Time.Hour, // 1.5h
        tickLength: 20,
        tickColor: '#000',
        lineColor: '#000',
        lineWidth: 1,
        gridLineWidth: 1,
        gridLineColor: '#000',
        gridLineDashStyle: 'Dot',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        showLastLabel: true,
        labels: {
          format: '{value:%H:%M}',
          align: 'left',
          x: 3,
        },
        crosshair: {
          width: 2
        }
      }, { // Top X axis
        linkedTo: 0,
        type: 'datetime',
        tickInterval: Time.Day,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span>  %e %b %Y}',
          align: 'left',
          x: 3,
          y: -5
        },
        opposite: true,
        tickLength: 20,
        lineColor: '#000',
        lineWidth: 0,
        gridLineColor: '#000',
        gridLineWidth: 2,
      }],
      yAxis: [{
        lineColor: '#000',
        lineWidth: 0,
        gridLineColor: '#000',
        gridLineDashStyle: 'Dot',
        allowDecimals: true,
        tickPixelInterval: 50,
        className: 'highcharts-color-0',
        title: { text: '' },
        min: 0,
        labels: {
          format: '{value:.1f}',
          formatter() {
            return (this.value >= 0) ? Highcharts.numberFormat(this.value, 1) : '';
          }
        },
        height: '60%',
        opposite: false,
      }, {
        lineColor: '#000',
        lineWidth: 0,
        gridLineColor: '#000',
        className: 'highcharts-color-0',
        title: { text: '' },
        opposite: true,
        top: '65%',
        height: '35%',
        visible: false,
      }],
      tooltip: {
        crosshairs: true,
        shared: true,
        useHTML: true,
        formatter() {
          const points = this.points.slice().reverse();
          // points.splice(points.length - 1, 1);
          let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) + '</span><table>';
          for (const point of points) {
            let state;
            if (point.color === '#34495e') {
              state = 'Completed';
            } else if (point.color === '#90ed7d') {
              state = 'Passed';
            } else if (point.color === '#8d0f94') {
              state = 'Swell';
            } else if (point.color === '#0f4094') {
              state = 'Wind';
            } else if (point.color === '#b0b0b0') {
              state = 'Failed Calculation';
            } else {
              state = 'Failed';
            }
            message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td style="' +
              'text-align: right"><b>' + state + '</b></td></tr>';
          }
          message += '</table>';
          return message;
        },
      },
      plotOptions: {
        areaspline: {
          dataLabels: {
            enabled: true,
            formatter() {
              return Highcharts.numberFormat(this.y, 1);
            }
          },
          showInLegend: false,
          enableMouseTracking: false,
          zoneAxis: 'x',
          zones: this.getZones(),
        },
        column: {
          stacking: 'normal',
          showInLegend: true,
          pointWidth: 25,
          pointPadding: 0.2,
        }
      },
      credits: {
        enabled: false
      },
      series: this.getSeries(),
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
          }
        }]
      }
    };
    this.min = Math.min(...this.analysis.data.cols[0].subcols[0].data);
    this.max = Math.max(...this.analysis.data.cols[0].subcols[0].data);
  }

  private getZones(): any[] {

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
          tabCountFails.push({ date: this.analysis.data.rows[i], count: countFails, stable: stable[i], cols: this.analysis.data.cols[j].title });
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
          tabCountFails.push({ date: this.analysis.data.rows[i], count: countFails, stable: "No", cols: this.analysis.data.cols[j].title });
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
    let fillColor = '';
    let colorCode = '';
    let fillVal = [];
    
    for (let index = 0; index < tabCountFails.length - 1; index++) {
      if (index <= 0) {
        if (tabCountFails[index].count <= 0) {
          if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) { // if stable property is not present in object
            endDate = tabCountFails[index].date;
            color = '';
            fillColor = '';
            colorCode = '';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          } else {
            endDate = tabCountFails[index].date;
            color = 'rgba(99, 190, 123, 1)';      //success
            fillColor = 'rgba(99, 190, 123, 0.2)';
            colorCode = 'green';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          }
        }
        else if (tabCountFails[index].count > 0 && tabCountFails[index].count < nbRows) {
          if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) { // if stable property is not present in object
            endDate = tabCountFails[index].date;
            color = '';
            fillColor = '';
            colorCode = '';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          } else {
            if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
              endDate = tabCountFails[index].date;
              color = 'rgba(255, 193, 7, 1)';       //warning
              fillColor = 'rgba(255, 193, 7, 0.2)';
              colorCode = 'yellow';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
            else {
              endDate = tabCountFails[index].date;
              color = 'rgba(201, 201, 201, 1)';     //failed-calculation
              fillColor = 'rgba(201, 201, 201, 0.2)';
              colorCode = 'grey';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
          }
        }
        else {
          if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) {
            endDate = tabCountFails[index].date;
            color = '';
            fillColor = '';
            colorCode = '';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          } else {
            if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
              endDate = tabCountFails[index].date;
              color = 'rgba(248, 105, 107, 1)';     //error
              fillColor = 'rgba(248, 105, 107, 0.2)';
              colorCode = 'red';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
            else {
              endDate = tabCountFails[index].date;
              color = 'rgba(201, 201, 201, 1)';     //failed-calculation
              fillColor = 'rgba(201, 201, 201, 0.2)';
              colorCode = 'grey';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
          }
        }
      }
      else {
        if (tabCountFails[index].count <= 0) {
          if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) { // if stable property is not present in object
            endDate = tabCountFails[index].date;
            color = '';
            fillColor = '';
            colorCode = '';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          } else {
            endDate = tabCountFails[index].date;
            color = 'rgba(99, 190, 123, 1)';  //success
            fillColor = 'rgba(99, 190, 123, 0.2)';
            colorCode = 'green';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          }
        }
        else if (tabCountFails[index].count > 0 && tabCountFails[index].count < nbRows) {
          if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) {
            endDate = tabCountFails[index].date;
            color = '';
            fillColor = '';
            colorCode = '';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          } else {
            if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
              endDate = tabCountFails[index].date;
              color = 'rgba(255, 193, 7, 1)';       //warning
              fillColor = 'rgba(255, 193, 7, 0.2)';
              colorCode = 'yellow';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
            else {
              endDate = tabCountFails[index].date;
              color = 'rgba(201, 201, 201, 1)';     //failed-calculation
              fillColor = 'rgba(201, 201, 201, 0.2)';
              colorCode = 'grey';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
          }
        }
        else {
          if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) {
            endDate = tabCountFails[index].date;
            color = '';
            fillColor = '';
            colorCode = '';
            zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
          } else {
            if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
              endDate = tabCountFails[index].date;
              color = 'rgba(248, 105, 107, 1)';     //error
              fillColor = 'rgba(248, 105, 107, 0.2)';
              colorCode = 'red';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            } else {
              endDate = tabCountFails[index].date;
              color = 'rgba(201, 201, 201, 1)';     //failed-calculation
              fillColor = 'rgba(201, 201, 201, 0.2)';
              colorCode = 'grey';
              zones.push({ value: endDate, fillColor, color, colorCode: colorCode });
            }
          }
        }
      }
    }

    if(tabCountFails.length > 0){
      const lastElt = tabCountFails[tabCountFails.length - 1];
      if (lastElt.count <= 0) {
        color = 'rgba(99, 190, 123, 1)';      //success
        fillColor = 'rgba(99, 190, 123, 0.2)';
        colorCode = 'green';
      } else if (lastElt.count > 0 && lastElt.count < nbRows) {
        if (lastElt.stable == true || lastElt.stable == "No") {
          color = 'rgba(255, 193, 7, 1)';       //warning
          fillColor = 'rgba(255, 193, 7, 0.2)';
          colorCode = 'yellow';
        }
        else {
          color = 'rgba(201, 201, 201, 1)';     //failed calculation
          fillColor = 'rgba(201, 201, 201, 0.2)';
          colorCode = 'grey';
        }
      } else {
        if (lastElt.stable == true || lastElt.stable == "No") {
          color = 'rgba(248, 105, 107, 1)';     //error
          fillColor = 'rgba(248, 105, 107, 0.2)';
          colorCode = 'red';
        }
        else {
          color = 'rgba(201, 201, 201, 1)';     //failed calculation
          fillColor = 'rgba(201, 201, 201, 0.2)';
          colorCode = 'grey';
        }
      }
    }

    zones.push({ fillColor, color, colorCode });

    let time = zones.map((data) => {
      return data.value;
    });

    time = [...new Set(time)];
    time.map((data, index) => {
      let filterValue = zones.filter((o) => o.value === data);
      let colors = filterValue.map((val) => {
        return val.colorCode;
      });

      let distColorGet = [...new Set(colors)];
      let distColor = distColorGet.filter((value) => {
        if (value != '' && distColorGet.indexOf(value) > -1) return value;
      });

      let defColor = '';
      let defColorFill = '';
      if (distColor.includes('grey')) {
        defColor = 'rgba(201, 201, 201, 1)';
        defColorFill = 'rgba(201, 201, 201, 0.2)';
      } else {
        if (distColor.length == 1 && distColor.includes('green')) {
          defColor = 'rgba(99, 190, 123, 1)';
          defColorFill = 'rgba(99, 190, 123, 0.2)';
        } else if (distColor.length == 1 && distColor.includes('red')) {
          defColor = 'rgba(248, 105, 107, 1)';
          defColorFill = 'rgba(248, 105, 107, 0.2)';
        } else if (distColor.length == 1 && distColor.includes('yellow')) {
          defColor = 'rgba(255, 193, 7, 1)';
          defColorFill = 'rgba(255, 193, 7, 0.2)';
        } else if (
          distColor.length >= 2 &&
          distColor.includes('red') &&
          distColor.includes('green')
        ) {
          defColor = 'rgba(255, 193, 7, 1)';
          defColorFill = 'rgba(255, 193, 7, 0.2)';
        } else if (
          distColor.length >= 2 &&
          distColor.includes('yellow') &&
          distColor.includes('green')
        ) {
          defColor = 'rgba(255, 193, 7, 1)';
          defColorFill = 'rgba(255, 193, 7, 0.2)';
        } else if (
          distColor.length >= 2 &&
          distColor.includes('yellow') &&
          distColor.includes('red')
        ) {
          defColor = 'rgba(248, 105, 107, 1)';
          defColorFill = 'rgba(248, 105, 107, 0.2)';
        } else if (
          distColor.length >= 3 &&
          distColor.includes('yellow') &&
          distColor.includes('green') &&
          distColor.includes('red')
        ) {
          defColor = 'rgba(255, 193, 7, 1)';
          defColorFill = 'rgba(255, 193, 7, 0.2)';
        }
      }
      let obj = { value: data, color: defColor, fillColor: defColorFill };
      fillVal.push(obj);
    });

    let finalOutput = [];
    for (let i = 0; i < fillVal.length - 1; i++) {
      if (i === fillVal.length - 1) {
        finalOutput.push({
          color: fillVal[i].color,
          fillColor: fillVal[i].fillColor,
        });
      } else {
        finalOutput.push({
          value: fillVal[i + 1].value,
          color: fillVal[i].color,
          fillColor: fillVal[i].fillColor,
        });
      }
    }
    return finalOutput;
  }

  getSeries(): any[] {
    const series = [{
      color: '',
      name: '',
      data: this.analysis.data.cols[0].subcols[0].data.slice().map((item, index) => [this.analysis.data.rows[index], item]),
      type: 'areaspline',
      yAxis: 0,
      marker: {
        enabled: true,
        radius: 4.5
      },
    }];

    const nbRows = this.analysis.data.cols.length - 1;
    const temp = [];

    for (let i = 1; i < this.analysis.data.cols.length; i++) {
      const tempRow = { name: this.analysis.data.cols[i].title, values: [] };

      //Checking, whether the last object of "cols-subcols" array was "stable" or "acceptable"
      let isWeathervaning = this.analysis.data.cols[i].subcols[this.analysis.data.cols[i].subcols.length - 1].title;
      if (isWeathervaning.trim().toLowerCase() === "stable") {

        let acceptable = this.analysis.data.cols[i].subcols[this.analysis.data.cols[i].subcols.length - 2].data;
        let stable = this.analysis.data.cols[i].subcols[this.analysis.data.cols[i].subcols.length - 1].data;

        //Checking, whether the "acceptable" array contains boolean value / 2d array value
        let acceptableResult = acceptable.every((elt) => {
          if (typeof elt === 'boolean') {
            return true;
          }
          return false;
        });

        if (acceptableResult === true) {
          //Acceptable array contains "boolean" value
          let j = 0;
          for (const [item, value] of stable.entries()) {
            if (value === true) {
              let itemIncrementByOne = item + 1;
              let finalCount = acceptable.length - itemIncrementByOne;

              for (let i = item; i < acceptable.length - finalCount; i++) {
                if (acceptable[i] === true) {
                  tempRow.values.push([this.analysis.data.rows[j], 1]); // passed
                }
                if (acceptable[i] === false) {
                  tempRow.values.push([this.analysis.data.rows[j], 2]); // failed
                }
              }
            }
            else if (value === false) {
              tempRow.values.push([this.analysis.data.rows[j], 5]); // failed calculation
            }
            j++;
          }
          temp.push(tempRow);

        } else {
          //Acceptable array contains "2d array" value
          let j = 0;
          for (const [item, value] of stable.entries()) {
            if (value === true) {
              let itemIncrementByOne = item + 1;
              let finalCount = acceptable.length - itemIncrementByOne;

              for (let i = item; i < acceptable.length - finalCount; i++) {
                if (acceptable[i][0] == true && acceptable[i][1] == true) {
                  tempRow.values.push([this.analysis.data.rows[j], 1]); // passed
                }
                if (acceptable[i][0] == false && acceptable[i][1] == false) {
                  tempRow.values.push([this.analysis.data.rows[j], 2]); // failed
                }
                if (acceptable[i][0] == true && acceptable[i][1] == false) {
                  tempRow.values.push([this.analysis.data.rows[j], 3]); // swell
                }
                if (acceptable[i][0] == false && acceptable[i][1] == true) {
                  tempRow.values.push([this.analysis.data.rows[j], 4]); // wind
                }
              }
            }
            else if (value === false) {
              tempRow.values.push([this.analysis.data.rows[j], 5]); // failed calculation
            }
            j++;
          }
          temp.push(tempRow);
        }
      }
      else if (isWeathervaning.trim().toLowerCase() === "acceptable") {

        let acceptable = this.analysis.data.cols[i].subcols[this.analysis.data.cols[i].subcols.length - 1].data;
        if (acceptable.length === 0) {
          acceptable = new Array(this.analysis.data.cols[0].subcols[0].data.length).fill('');
        }

        let j = 0;
        for (const item of acceptable) {
          if (item === undefined || item === null || item === '') {
            tempRow.values.push([this.analysis.data.rows[j], 0]); // completed
          } else {
            if (item === true) {
              tempRow.values.push([this.analysis.data.rows[j], 1]); // passed
            }
            if (item === false) {
              tempRow.values.push([this.analysis.data.rows[j], 2]); // failed
            }
            if (item === "Swell") {
              tempRow.values.push([this.analysis.data.rows[j], 3]); // swell
            }
            if (item === "Wind") {
              tempRow.values.push([this.analysis.data.rows[j], 4]); // wind
            }
          }
          j++;
        }
        temp.push(tempRow);
      }
    }

    for (const row of temp.reverse()) {
      series.push({
        name: row.name,
        data: row.values.slice().map((item) => {
          let color;
          if (item[1] === 0) {
            color = '#34495e';
          } else if (item[1] === 1) {
            color = '#90ed7d';
          } else if (item[1] === 3) {
            color = '#8d0f94';
          } else if (item[1] === 4) {
            color = '#0f4094';
          } else if (item[1] === 5) {
            color = '#b0b0b0';
          } else {
            color = '#f15c80';
          }
          return { x: item[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white' };
        }),
        color: null,
        type: 'column',
        yAxis: 1,
        marker: null,
      });
    }

    this.colorList = this.getColors(series);
    return series;
  }

  getColors(seriesData) {
    let resColor = [];
    let res = [];
    var unique = {};
    for (let i = 1; i < seriesData.length; i++) {
      if (seriesData[i].data.length !== 0) {
        seriesData[i].data.forEach(function (x) {
          if (!unique[x.color]) {
            resColor.push(x.color);
            unique[x.color] = true;
          }
        });
      }
    }

    for (let j = 0; j < resColor.length; j++) {
      if (resColor[j] === '#34495e') {
        res.push({ name: resColor[j], value: 'completed', title: 'Completed' });
      } else if (resColor[j] === '#90ed7d') {
        res.push({ name: resColor[j], value: 'passed', title: 'Passed' });
      } else if (resColor[j] === '#8d0f94') {
        res.push({ name: resColor[j], value: 'swell', title: 'Swell' });
      } else if (resColor[j] === '#0f4094') {
        res.push({ name: resColor[j], value: 'wind', title: 'Wind' });
      } else if (resColor[j] === '#b0b0b0') {
        res.push({ name: resColor[j], value: 'failed-calculation', title: 'Failed Calculation' });
      } else if (resColor[j] === '#f15c80') {
        res.push({ name: resColor[j], value: 'failed', title: 'Failed' });
      }
    }
    return res;
  }
}
