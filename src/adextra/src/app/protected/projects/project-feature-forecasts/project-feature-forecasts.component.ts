import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { WeatherService } from '@app/core/services/weather.service';
import { AnalysisService } from '@app/core/services/analysis.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_boost from 'highcharts/modules/boost';
import HC_windbarb from 'highcharts/modules/windbarb';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_drag_panes from 'highcharts/modules/drag-panes';
import HC_accessibility from 'highcharts/modules/accessibility';
import { takeUntil } from 'rxjs/operators';
import { Time } from '@app/shared/enums/time.enums';
import jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';

HC_stock(Highcharts);
HC_boost(Highcharts);
HC_windbarb(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_drag_panes(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-project-feature-forecasts',
  templateUrl: './project-feature-forecasts.component.html',
  styleUrls: ['./project-feature-forecasts.component.scss']
})
export class ProjectFeatureForecastsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() project: Project;
  @Input() vesselID = '-1';
  @Input() session: string;
  @Input() forecaster: string;
  @ViewChild('pdfContent', { static: false }) pdfContent: ElementRef;
  @ViewChild('modalMessage', { static: true }) modalMessage: ElementRef;
  @Output() isCurrentForecasterActive = new EventEmitter<boolean>();

  zoom = 4;
  unit = '0';

  state = { isLoaded: false, canConnect: null };

  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isWeatherDead$ = new Subject();
  private isForecastDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isSchedulersDead$ = new Subject();

  data = [];
  highcharts = null;
  updateFlag = true;
  oneToOneFlag = true;
  optionsGeneratedCharts: any[] = [];
  isnoChartsMessage: string = "";
  forecasterResponse: any = {};
  filteredForecVal: any = [];
  forecasterId: any;
  subscriptionId: any;
  locationId: any;
  forecasterForGraphResponse: any = [];
  isDisabledBtn: boolean = true;
  filteredForecasterName: string = ""
  selectedScheduler: string = "";
  responseMessage: string = "";

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
        format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span>  %e %b}',
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

  constructor(private weatherService: WeatherService, private analysisService: AnalysisService, private schedulersService: SchedulersService, private modalService: NgbModal) { }

  ngOnInit() {
    this.socketEvent = this.weatherService.socketEvent;
    this.isCurrentForecasterActive.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.optionsGeneratedCharts = [];
    this.forecasterForGraphResponse = [];
    this.filteredForecasterName = "";
    this.getForecast(this.forecaster, this.project._id, this.vesselID, this.session, true);
    this.getFilteredForecasterByScheduler(this.forecaster, this.project._id, this.vesselID, true);
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.optionsGeneratedCharts = [];
      this.getForecast(this.forecaster, this.project._id, this.vesselID, this.session, true);
    });
  }

  ngOnDestroy(): void {
    this.isSocketEventDead$.next();
    this.isWeatherDead$.next();
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

  getFilteredForecasterByScheduler(forecaster: string, project: string, vessel: string, reset: boolean = false) {
    this.analysisService.getAnalysis(project, vessel, forecaster, this.session, reset).
      pipe(takeUntil(this.isAnalysisDead$)).subscribe((response) => {
        if (response.data !== null) {
          this.selectedScheduler = response.data.schedulerId;
          this.schedulersService.getScheduler(this.selectedScheduler, true).pipe(takeUntil(this.isSchedulersDead$)).subscribe((response) => {
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
                this.locationId = 0;

              } else if (this.filteredForecasterName === "Infoplaza") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                let filteredForecasterName1 = this.filteredForecVal[0].name;
                let findIndexInFilteredForec = filteredForecasterName1.indexOf('/');
                this.locationId = filteredForecasterName1.slice(findIndexInFilteredForec + 1);

              } else if (this.filteredForecasterName === "StormGeo") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                let filteredForecasterName1 = this.filteredForecVal[0].name;
                let findIndexInFilteredForec = filteredForecasterName1.indexOf('/');
                this.locationId = filteredForecasterName1.slice(findIndexInFilteredForec + 1);

              } else if (this.filteredForecasterName === "Weathernews") {
                this.subscriptionId = this.filteredForecVal[0].subscription;
                let filteredForecasterName1 = this.filteredForecVal[0].name;
                let findIndexInFilteredForec = filteredForecasterName1.indexOf('/');
                this.locationId = filteredForecasterName1.slice(findIndexInFilteredForec + 1);
              }

            } else {
              this.isDisabledBtn = true;
            }

          });
        }
      });
  }

  getForecast(forecaster: string, project: string, vessel: string, session: string, reset: boolean = false) {
    if (!this.session || !this.forecaster) {
      this.data = [];

      this.state.canConnect = true;
      this.state.isLoaded = true;
    } else {
      const that = this;
      this.weatherService.getForecast(forecaster, project, vessel, session, reset).pipe(takeUntil(this.isWeatherDead$))
        .subscribe(response => {
          this.forecasterResponse = response.data;
          let isMessageExist = this.forecasterResponse.hasOwnProperty('message');

          if (isMessageExist === true || isMessageExist === false) {
            if (this.forecasterResponse.message === "Error with API forecaster") {
              this.isnoChartsMessage = this.forecasterResponse.message;
              this.state.canConnect = true;
              this.state.isLoaded = true;
            }
            else {
              this.data = (response.data !== null) ? response.data.dataset : [];
              this.state.canConnect = true;
              this.state.isLoaded = true;

              this.highcharts = Highcharts;

              if (this.data.length < 1) {
                this.optionsGeneratedCharts.push(
                  { ...this.commonChartOptions },
                  { ...this.commonChartOptions },
                  { ...this.commonChartOptions }
                );
              }
              else {
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
                      let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
                        '</span><table>';
                      for (const point of points) {
                        if (point.point.hasOwnProperty('direction')) {
                          let direction = point.point.direction;
                          if (direction < 0) { direction = direction + 360; }
                          message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                            '<td style="text-align: right"><b>' + Highcharts.numberFormat(direction, 0) + 'º</b></td></tr>';
                        } else {
                          message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                            '<td style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 1) +
                            ((that.unit === '0') ? 'm' : 'ft') + '</b></td></tr>';
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
                      let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
                        '</span><table>';
                      for (const point of points) {
                        if (point.point.hasOwnProperty('direction')) {
                          let direction = point.point.direction;
                          if (direction < 0) { direction = direction + 360; }
                          message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                            '<td style="text-align: right"><b>' + Highcharts.numberFormat(direction, 0) + 'º</b></td></tr>';
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
                      let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
                        '</span><table>';
                      for (const point of points) {
                        if (point.point.hasOwnProperty('direction')) {
                          let direction = point.point.direction;
                          if (direction < 0) { direction = direction + 360; }
                          message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                            '<td style="text-align: right"><b>' + Highcharts.numberFormat(direction, 0) + 'º</b></td></tr>';
                        } else {
                          message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                            '<td style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 1) +
                            ((that.unit === '0') ? 'm/s' : 'kts') + '</b></td></tr>';
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
          }
        }, error => {
          this.data = [];
          this.state.canConnect = false;
          this.state.isLoaded = true;
          this.highcharts = Highcharts;
          this.optionsGeneratedCharts = [];
          this.optionsGeneratedCharts.push(
            { ...this.commonChartOptions },
            { ...this.commonChartOptions },
            { ...this.commonChartOptions }
          );
        });
    }
  }

  getData(data): any[] {
    if (this.unit === '0') {
      return data.slice();
    } else {
      return data.slice().map(item => [item[0], this.roundDecimal(item[1] * (1 / 0.3048))]);
    }
  }

  getDataBis(data): any[] {
    if (this.unit === '0') {
      return data.slice().map(item => [item[0], this.roundDecimal(item[1] * 0.514444)]);
    } else {
      return data.slice();
    }
  }

  roundDecimal(n: number, decimal: number = 2): number {
    const precision = Math.pow(10, decimal);
    return Math.round(n * precision) / precision;
  }

  refresh(): void {
    this.optionsGeneratedCharts = [];
    this.filteredForecasterName = "";
    this.getForecast(this.forecaster, this.project._id, this.vesselID, this.session, true);
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  createPdf() {
    const forecasterId = this.forecasterId;
    // const subscriptionId = this.subscriptionId;
    // const locationId = this.locationId;
    const sessionId = this.session;
    
    this.weatherService.getForecastForGraph(forecasterId, sessionId, this.selectedScheduler, true).pipe(takeUntil(this.isForecastDead$))
      .subscribe(response => {

        if (response.success === true && this.filteredForecasterName === "StormGeo") {
          this.forecasterForGraphResponse = response.data.dataset.data;
          const elementBody = document.getElementById('createPdf');
          const pdf = new jspdf();
          pdf.internal.scaleFactor = 5.5;

          const element = document.getElementById('createPdf');
          const w = element.clientWidth;
          const h = element.clientHeight;
          const newCanvas = document.createElement('canvas');
          newCanvas.width = w * 2;
          newCanvas.height = h * 2;
          newCanvas.style.width = w + 'px';
          newCanvas.style.height = h + 'px';
          const context = newCanvas.getContext('2d');

          pdf.addHTML(elementBody, 3, 3, { pagesplit: false, canvas: newCanvas }, () => {
            pdf.save('Report-' + this.filteredForecasterName + '.pdf');
            this.pdfContent.nativeElement.style.height = 0;
          });
        }
        else if (response.success === true && this.filteredForecasterName === "Met") {
          this.forecasterForGraphResponse = Object.values(response.data.Forecasts);
          const elementBody = document.getElementById('createPdf');
          const pdf = new jspdf();
          pdf.internal.scaleFactor = 5.5;

          const element = document.getElementById('createPdf');
          const w = element.clientWidth;
          const h = element.clientHeight;
          const newCanvas = document.createElement('canvas');
          newCanvas.width = w * 2;
          newCanvas.height = h * 2;
          newCanvas.style.width = w + 'px';
          newCanvas.style.height = h + 'px';
          const context = newCanvas.getContext('2d');

          pdf.addHTML(elementBody, 3, 3, { pagesplit: false, canvas: newCanvas }, () => {
            pdf.save('Report-' + this.filteredForecasterName + '.pdf');
            this.pdfContent.nativeElement.style.height = 0;
          });
        }
        else if (response.success === true && this.filteredForecasterName === "Infoplaza") {
          this.forecasterForGraphResponse = response.data.forecast;
          const elementBody = document.getElementById('createPdf');
          const pdf = new jspdf();
          pdf.internal.scaleFactor = 5.5;

          const element = document.getElementById('createPdf');
          const w = element.clientWidth;
          const h = element.clientHeight;
          const newCanvas = document.createElement('canvas');
          newCanvas.width = w * 2;
          newCanvas.height = h * 2;
          newCanvas.style.width = w + 'px';
          newCanvas.style.height = h + 'px';
          const context = newCanvas.getContext('2d');

          pdf.addHTML(elementBody, 3, 3, { pagesplit: false, canvas: newCanvas }, () => {
            pdf.save('Report-' + this.filteredForecasterName + '.pdf');
            this.pdfContent.nativeElement.style.height = 0;
          });
        }
        else if (response.success === true && this.filteredForecasterName === "Weathernews") {
          // this.forecasterForGraphResponse = Object.values(response.data.data);
          this.forecasterForGraphResponse = Object.values(response.data.dataset.data);
          const elementBody = document.getElementById('createPdf');
          const pdf = new jspdf();
          pdf.internal.scaleFactor = 5.5;

          const element = document.getElementById('createPdf');
          const w = element.clientWidth;
          const h = element.clientHeight;
          const newCanvas = document.createElement('canvas');
          newCanvas.width = w * 2;
          newCanvas.height = h * 2;
          newCanvas.style.width = w + 'px';
          newCanvas.style.height = h + 'px';
          const context = newCanvas.getContext('2d');

          pdf.addHTML(elementBody, 3, 3, { pagesplit: false, canvas: newCanvas }, () => {
            pdf.save('Report-' + this.filteredForecasterName + '.pdf');
            this.pdfContent.nativeElement.style.height = 0;
          });
        }
        else if (response.success === false) {
          this.isDisabledBtn = true;
          this.responseMessage = response.message;
          this.modalService.open(this.modalMessage, { centered: true, size: 'lg', backdrop: 'static' });
        }
      });
  }

  public dismiss(modal: NgbActiveModal) {
    modal.dismiss();
  }

  public decline(modal: NgbActiveModal) {
    modal.close(false);
  }

}
