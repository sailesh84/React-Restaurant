import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { Vessel } from '@app/shared/models/vessel';
import { WeatherService } from '@app/core/services/weather.service';
import { AnalysisService } from '@app/core/services/analysis.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_boost from 'highcharts/modules/boost';
import HC_windbarb from 'highcharts/modules/windbarb';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_drag_panes from 'highcharts/modules/drag-panes';
import HC_accessibility from 'highcharts/modules/accessibility';
import { Time } from '@app/shared/enums/time.enums';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

HC_stock(Highcharts);
HC_boost(Highcharts);
HC_windbarb(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_drag_panes(Highcharts);
HC_accessibility(Highcharts);

// For highcharts, load moment in global
(window as any).moment = moment;
momentTZ();

@Component({
  selector: 'app-history-feature-forecasts',
  templateUrl: './history-feature-forecasts.component.html',
  styleUrls: ['./history-feature-forecasts.component.scss']
})
export class HistoryFeatureForecastsComponent implements OnInit, OnChanges {
  @Input() project: Project;
  @Input() vessel: Vessel;
  @Input() forecaster: any;
  @Input() session: any;
  @Input() forecast: any;
  @Input() timezone: string;
  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef;
  @ViewChild('htmlData', { static: false }) htmlData!: ElementRef;

  unit = '0';
  data = [];
  highcharts = null;
  updateFlag = true;
  oneToOneFlag = true;
  optionsGeneratedCharts: any[] = [];

  commonChartOptions = {
    chart: {
      zoomType: 'x',
      events: {},
    },
    boost: {
      useGPUTranslations: true
    },
    exporting: {
      sourceWidth: 1800,
    },
    legend: {
      enabled: true
    },
    navigator: {
      enabled: false
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
                chart.xAxis[0].setExtremes(null, null, false);
                chart.redraw();
              }
            }
          }
        }
      }],
      inputEnabled: false
    },
    scrollbar: {
      enabled: false,
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    },
    title: {
      text: ''
    },
    xAxis: [{ // Bottom X axis
      type: 'datetime',
      pointInterval: 3 * Time.Hour, // 3h
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
      offset: 30,
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
    yAxis: {
      lineColor: '#000',
      lineWidth: 0,
      gridLineColor: '#000',
      gridLineDashStyle: 'Dot',
      allowDecimals: true,
      className: 'highcharts-color-0',
      title: {
        text: ''
      },
      min: 0,
      opposite: false
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      useHTML: true,
    },
    credits: {
      enabled: false
    },
    series: [],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  };

  forecasterId: any;
  subscriptionId: any;
  locationId: any;
  forecasterForGraphResponse: any = [];
  isDisabledBtn: boolean = true;
  filteredForecasterName: string = "";
  filteredForecVal: any = [];
  downloadPDFBtnText = "Download PDF";


  private isForecastDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isSchedulersDead$ = new Subject();

  constructor(private weatherService: WeatherService, private analysisService: AnalysisService, private schedulersService: SchedulersService) { }

  ngOnInit() {
    // this.getFilteredForecasterByScheduler(this.forecaster, this.project._id, this.vessel._id, true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.optionsGeneratedCharts = [];
    if (this.project && this.vessel) {
      this.getFilteredForecasterByScheduler(this.forecaster, this.project._id, this.vessel._id, true);
    }

    if (this.forecast) {
      this.generateChart(this.forecast.dataset);
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

  ngOnDestroy(): void {
    this.isForecastDead$.next();
    this.isAnalysisDead$.next();
    this.isSchedulersDead$.next();
  }

  getFilteredForecastName(fName: string) {
    let searchIndexfName = fName.indexOf('/');
    if (searchIndexfName < 0) {
      let c = fName.trim().slice(0, 3);
      return c;
    } else {
      let c = fName.trim().slice(0, searchIndexfName);
      return c;
    }
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  private generateChart(data: any[]) {
    this.data = (data) ? data : [];
    const that = this;

    this.highcharts = Highcharts;

    if (this.data.length < 1) {
      this.optionsGeneratedCharts.push(
        { ...this.commonChartOptions },
        { ...this.commonChartOptions },
        { ...this.commonChartOptions }
      );
    } else {
      const chartOptions = {
        chart: {
          zoomType: 'x',
          events: {
            load() {
              const select = document.getElementById('select_unit_system');
              select.addEventListener('change', () => {
                this.series[0].setData(that.getData(that.data[0].maxWaves));
                this.series[1].setData(that.getData(that.data[0].sigWaves));
                this.update({ yAxis: { title: { text: 'Height (' + ((that.unit === '0') ? 'm' : 'ft') + ')' } } });
              });
            }
          },
        },
        title: {
          text: this.data[0].label
        },
        yAxis: [{
          lineColor: '#000',
          lineWidth: 0,
          gridLineColor: '#000',
          gridLineDashStyle: 'Dot',
          allowDecimals: true,
          className: 'highcharts-color-0',
          title: {
            text: 'Height (' + ((this.unit === '0') ? 'm' : 'ft') + ')'
          },
          min: 0,
          opposite: false,
        }, {
          visible: false,
        }],
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter() {
            const points = this.points;
            let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) + '</span><table>';
            for (const point of points) {
              if (point.point.hasOwnProperty('direction')) {
                let direction = point.point.direction;
                if (direction < 0) { direction = direction + 360; }
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td style="' +
                  'text-align: right"><b>' + Highcharts.numberFormat(direction, 0) + 'º</b></td></tr>';
              } else {
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td style="' +
                  'text-align: right"><b>' + Highcharts.numberFormat(point.y, 1) + ((that.unit === '0') ? 'm' : 'ft') + '</b>' +
                  '</td></tr>';
              }
            }
            message += '</table>';
            return message;
          },
        },
        series: [{
          type: 'spline',
          name: 'Max wave',
          data: this.getData(this.data[0].maxWaves),
          color: '#FF0000',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'circle'
          },
          yAxis: 0,
        }, {
          type: 'spline',
          name: 'Sig wave',
          data: this.getData(this.data[0].sigWaves),
          color: '#0000FF',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'triangle'
          },
          yAxis: 0,
        }, {
          type: 'windbarb',
          name: 'Direction',
          data: this.data[0].direction.slice(),
          color: '#35B03E',
          yAxis: 1,
          vectorLength: 18,
          yOffset: -15,
        }]
      };
      const chartOptions2 = {
        chart: {
          zoomType: 'x',
          events: {
            load() {
              const select = document.getElementById('select_unit_system');
              select.addEventListener('change', () => {
                this.series[0].setData(that.getData(that.data[1].swell));
                this.update({ yAxis: { title: { text: 'Height (' + ((that.unit === '0') ? 'm' : 'ft') + ')' } } });
              });
            }
          },
        },
        title: {
          text: this.data[1].label
        },
        yAxis: [{
          lineColor: '#000',
          lineWidth: 0,
          gridLineColor: '#000',
          gridLineDashStyle: 'Dot',
          allowDecimals: true,
          className: 'highcharts-color-0',
          title: {
            text: 'Height (' + ((this.unit === '0') ? 'm' : 'ft') + ')'
          },
          min: 0,
          tickPixelInterval: 50,
          labels: {
            format: '{value:.1f}'
          },
          opposite: false,
        }, {
          gridLineWidth: 0,
          allowDecimals: true,
          className: 'highcharts-color-0',
          title: {
            text: 'Period (sec)'
          },
          min: 0,
          opposite: true,
        }, {
          visible: false,
        }],
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter() {
            const points = this.points;
            let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) + '</span><table>';
            for (const point of points) {
              if (point.point.hasOwnProperty('direction')) {
                let direction = point.point.direction;
                if (direction < 0) { direction = direction + 360; }
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td style="' +
                  'text-align: right"><b>' + Highcharts.numberFormat(direction, 0) + 'º</b></td></tr>';
              } else {
                if (point.series.yAxis.userOptions.index === 1) {
                  message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                    '<td style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 0) + 'sec</b></td></tr>';
                } else {
                  message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                    '<td style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 1) + ((that.unit === '0') ? 'm' :
                      'ft') + '</b></td></tr>';
                }
              }
            }
            message += '</table>';
            return message;
          },
        },
        series: [{
          type: 'spline',
          name: 'Swell',
          data: this.getData(this.data[1].swell),
          color: '#FF0000',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'triangle'
          },
          yAxis: 0
        }, {
          type: 'spline',
          name: 'Swell period',
          data: this.getData(this.data[1].swellPeriod),
          color: '#0000FF',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'circle'
          },
          yAxis: 1
        }, {
          type: 'windbarb',
          name: 'Direction',
          data: this.data[1].direction.slice(),
          color: '#35B03E',
          yAxis: 2,
          vectorLength: 18,
          yOffset: -15,
        }]
      };
      const chartOptions3 = {
        chart: {
          zoomType: 'x',
          events: {
            load() {
              const select = document.getElementById('select_unit_system');
              select.addEventListener('change', () => {
                this.series[0].setData(that.getDataBis((that.data[2].speed10) ? that.data[2].speed10 : []));
                this.series[1].setData(that.getDataBis((that.data[2].speed50) ? that.data[2].speed50 : []));
                this.series[2].setData(that.getDataBis((that.data[2].gusts10) ? that.data[2].gusts10 : []));
                this.series[2].setData(that.getDataBis((that.data[2].gusts50) ? that.data[2].gusts50 : []));
                this.update({ yAxis: { title: { text: 'Speed (' + ((that.unit === '0') ? 'm/s' : 'kts') + ')' } } });
              });
            }
          },
        },
        title: {
          text: this.data[2].label
        },
        yAxis: [{
          lineColor: '#000',
          lineWidth: 0,
          gridLineColor: '#000',
          gridLineDashStyle: 'Dot',
          allowDecimals: true,
          className: 'highcharts-color-0',
          title: {
            text: 'Speed (' + ((this.unit === '0') ? 'm/s' : 'kts') + ')'
          },
          min: 0,
          opposite: false,
        }, {
          visible: false,
        }],
        tooltip: {
          crosshairs: true,
          shared: true,
          useHTML: true,
          formatter() {
            const points = this.points;
            let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) + '</span><table>';
            for (const point of points) {
              if (point.point.hasOwnProperty('direction')) {
                let direction = point.point.direction;
                if (direction < 0) { direction = direction + 360; }
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td style="' +
                  'text-align: right"><b>' + Highcharts.numberFormat(direction, 0) + 'º</b></td></tr>';
              } else {
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td style="' +
                  'text-align: right"><b>' + Highcharts.numberFormat(point.y, 1) + ((that.unit === '0') ? 'm/s' : 'kts') + '</b>' +
                  '</td></tr>';
              }
            }
            message += '</table>';
            return message;
          },
        },
        series: [{
          type: 'spline',
          name: 'Wind 10m',
          data: this.getDataBis((this.data[2].speed10) ? this.data[2].speed10 : []),
          color: '#FF0000',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'circle'
          },
          yAxis: 0
        }, {
          type: 'spline',
          name: 'Wind 50m',
          data: this.getDataBis((this.data[2].speed50) ? this.data[2].speed50 : []),
          color: '#0000FF',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'triangle'
          },
          yAxis: 0
        }, {
          type: 'spline',
          name: 'Gusts 10m',
          data: this.getDataBis((this.data[2].gusts10) ? this.data[2].gusts10 : []),
          color: '#00FF00',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'diamond'
          },
          yAxis: 0
        }, {
          type: 'spline',
          name: 'Gusts 50m',
          data: this.getDataBis((this.data[2].gusts50) ? this.data[2].gusts50 : []),
          color: '#512D6D',
          marker: {
            enabled: true,
            radius: 5,
            symbol: 'square'
          },
          yAxis: 0
        }, {
          type: 'windbarb',
          name: 'Direction',
          data: this.data[2].direction.slice(),
          color: '#35B03E',
          yAxis: 1,
          vectorLength: 18,
          yOffset: -15,
        }]
      };

      this.optionsGeneratedCharts.push(
        { ...this.commonChartOptions, ...chartOptions },
        { ...this.commonChartOptions, ...chartOptions2 },
        { ...this.commonChartOptions, ...chartOptions3 }
      );
    }
  }

  private getData(data): any[] {
    if (this.unit === '0') {
      return data.slice();
    } else {
      return data.slice().map(item => [item[0], this.roundDecimal(item[1] * (1 / 0.3048))]);
    }
  }

  private getDataBis(data): any[] {
    if (this.unit === '0') {
      return data.slice().map(item => [item[0], this.roundDecimal(item[1] * 0.514444)]);
    } else {
      return data.slice();
    }
  }

  private roundDecimal(n: number, decimal: number = 2): number {
    const precision = Math.pow(10, decimal);
    return Math.round(n * precision) / precision;
  }

  private getFilteredForecasterByScheduler(forecaster: string, project: string, vessel: string, reset: boolean = false): void {
    if(project && vessel && forecaster && this.session){
      this.analysisService.getAnalysis(project, vessel, forecaster, this.session, reset).subscribe((response) => {
        if (response.data !== null) {
  
          let selectedScheduler = response.data.schedulerId;
          this.schedulersService.getScheduler(selectedScheduler, true).subscribe((response) => {
            let forecasterOfScheduler = response.data.forecasters;
            let filteredForec = Object.keys(forecasterOfScheduler).filter((key) => this.forecaster.includes(key))
              .reduce((obj, key) => {
                obj[key] = forecasterOfScheduler[key];
                return obj;
              }, {});
            this.forecasterId = Object.keys(filteredForec);
            this.filteredForecVal = Object.values(filteredForec);
  
            if (this.filteredForecVal.length > 0) {
              this.isDisabledBtn = false;
              this.filteredForecasterName = this.getFilteredForecastName(this.filteredForecVal[0].name);
  
              if (this.filteredForecasterName === "Met") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                this.locationId = "0";
                // this.getForecastForGraphDetails(this.forecasterId, this.subscriptionId, this.locationId);
                this.getForecastForGraphDetails(this.forecasterId, this.session, selectedScheduler);
  
              } else if (this.filteredForecasterName === "Infoplaza") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                let filteredForecasterName1 = this.filteredForecVal[0].name;
                let findIndexInFilteredForec = filteredForecasterName1.indexOf('/');
                this.locationId = filteredForecasterName1.slice(findIndexInFilteredForec + 1);
                // this.getForecastForGraphDetails(this.forecasterId, this.subscriptionId, this.locationId);
                this.getForecastForGraphDetails(this.forecasterId, this.session, selectedScheduler);
  
              } else if (this.filteredForecasterName === "StormGeo") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                let filteredForecasterName1 = this.filteredForecVal[0].name;
                let findIndexInFilteredForec = filteredForecasterName1.indexOf('/');
                this.locationId = filteredForecasterName1.slice(findIndexInFilteredForec + 1);
                // this.getForecastForGraphDetails(this.forecasterId, this.subscriptionId, this.locationId);
                this.getForecastForGraphDetails(this.forecasterId, this.session, selectedScheduler);
  
              } else if (this.filteredForecasterName === "Weathernews") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                let filteredForecasterName1 = this.filteredForecVal[0].name;
                let findIndexInFilteredForec = filteredForecasterName1.indexOf('/');
                this.locationId = filteredForecasterName1.slice(findIndexInFilteredForec + 1);
                // this.getForecastForGraphDetails(this.forecasterId, this.subscriptionId, this.locationId);
                this.getForecastForGraphDetails(this.forecasterId, this.session, selectedScheduler);
              }
  
            } else {
              this.isDisabledBtn = true;
            }
          });
        }
      });
    }
  }

  private getForecastForGraphDetails(foreId, sessionId, schedulerId): void {
    if (foreId && sessionId && schedulerId) {
      this.weatherService.getForecastForGraph(foreId, sessionId, schedulerId, true).subscribe(response => {

        if (response.success === true && this.filteredForecasterName === "StormGeo") {
          this.forecasterForGraphResponse = response.data.dataset.data;
        }
        else if (response.success === true && this.filteredForecasterName === "Met") {
          this.forecasterForGraphResponse = Object.values(response.data.Forecasts);
        }
        else if (response.success === true && this.filteredForecasterName === "Infoplaza") {
          this.forecasterForGraphResponse = response.data.forecast;
        }
        else if (response.success === true && this.filteredForecasterName === "Weathernews") {
          // this.forecasterForGraphResponse = Object.values(response.data.data);
          this.forecasterForGraphResponse = Object.values(response.data.dataset.data);
        }
        else if (response.success === false) {
          this.isDisabledBtn = true;
        }
      });
    }
  }

  private createPdf(): void {
    this.isDisabledBtn = true;
    this.downloadPDFBtnText = "Downloading...";
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF();
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Report-' + this.filteredForecasterName + '.pdf');
      this.pdfContent.nativeElement.style.height = 0;
      this.isDisabledBtn = false;
      this.downloadPDFBtnText = "Download PDF";
    });
  }
}
