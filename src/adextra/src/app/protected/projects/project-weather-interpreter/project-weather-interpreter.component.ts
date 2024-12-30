import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { WeatherService } from '@app/core/services/weather.service';
import * as moment from 'moment-timezone';

// RxJs 
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Time } from '@app/shared/enums/time.enums';

// highcharts 
import * as Highcharts from 'highcharts';
import HC_boost from 'highcharts/modules/boost';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_pattern_fill from 'highcharts/modules/pattern-fill';

// temporary 
import { AnalysisService } from '@app/core/services/analysis.service';
import { Analysis } from '@app/shared/models/analysis';

@Component({
  selector: 'app-project-weather-interpreter',
  templateUrl: './project-weather-interpreter.component.html',
  styleUrls: ['./project-weather-interpreter.component.scss']
})
export class ProjectWeatherInterpreterComponent implements OnInit {
  state = { isLoaded: false, canConnect: null };
  resetCache = false;

  @Input() project: Project;
  @Input() projectID = '-1';
  @Input() vesselID = '-1';
  @Input() projectTypeID: '-1';
  @Input() contactID = '-1';
  @Input() schedulerID = '-1';
  @Input() session: string;
  @Input() forecaster: string;
  @Output() isCurrentForecasterActive = new EventEmitter<boolean>();

  highcharts = Highcharts;
  chartOptions = {};
  optionsGeneratedCharts: any[] = []; //required
  columnColors: any[] = [];
  analysis: any; //temporary
  selectedWoptionList: number = 0;  //temporary
  weatherInterpreter: any;
  dateTime: any;
  wtDateTime: any;

  socketEvent: Observable<any>;

  private isSocketEventDead$ = new Subject();
  private isAnalysisDead$ = new Subject();  //temporary
  private isWeatherInterpreterDead$ = new Subject();

  constructor(private weatherService: WeatherService, private analysisService: AnalysisService) { }

  ngOnInit() {
    this.socketEvent = this.analysisService.socketEvent;
    this.isCurrentForecasterActive.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getInformation(this.projectID, this.vesselID, this.projectTypeID);
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.getInformation(this.projectID, this.vesselID, this.projectTypeID);
    });
  }

  ngOnDestroy(): void {
    this.isSocketEventDead$.next();
    this.isAnalysisDead$.next();
  }

  refresh(data = 0): void {
    this.optionsGeneratedCharts = [];
    this.getInformation(this.projectID, this.vesselID, this.projectTypeID);
  }


  private getInformation(project: string, vessel: string, projectTypeid: string): void {
    this.weatherService.getWeatherInterpreter(project, vessel, projectTypeid, true).pipe(takeUntil(this.isWeatherInterpreterDead$))
      .subscribe((response) => {

        this.weatherInterpreter = response.data;
        if (this.weatherInterpreter.length <= 0) {
          this.chartOptions = {};
          this.optionsGeneratedCharts = [];
          this.weatherInterpreter = null;
          this.state.canConnect = true;
          this.state.isLoaded = true;
        } else {

          let istaskDetailsExist = this.weatherInterpreter[0].data.hasOwnProperty('taskDetails');
          this.wtDateTime = this.weatherInterpreter[0].date;

          // let isDetailsExist = this.weatherInterpreter[0].data.taskDetails[0].hasOwnProperty('details');

          if (istaskDetailsExist === true) {
            this.chartOptions = {
              chart: {
                zoomType: 'x',
              },
              legend: {
                enabled: true
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
                text: 'Summary of Weather Forecast Prior to Analysis'
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
                    if (point.color === "green" || point.color === "Green" || point.color === "GREEN") {
                      state = 'Passed';
                    } else if (point.color === "red" || point.color === "Red" || point.color === "RED") {
                      state = 'Failed';
                    }
                    else {
                      state = "NA";
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
                  zones: this.getZones(this.weatherInterpreter[0]),
                  // zones: [],
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
              series: this.getSeries(this.weatherInterpreter[0]),
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
          }
          else {
            this.chartOptions = {};
            this.optionsGeneratedCharts = [];
            this.weatherInterpreter = null;
          }
          this.state.canConnect = true;
          this.state.isLoaded = true;
        }

      }, () => {
        this.state.canConnect = false;
        this.state.isLoaded = true;
      });
  }

  getDetails(item): any[] {
    const seriesItems = [];
    for (var index in item.details.Colour) {
      seriesItems.push({
        x: item.details.Datetime[index],
        y: -0.7,
        borderWidth: 1,
        borderColor: 'white',
        color: item.details.Colour[index],
        title: item.title
      });
    }

    return seriesItems;
  }

  private getZones(response): any[] {
    const entries = response.data.taskDetails.filter((e1) => e1);
    const dateTime = [];
    let zones = [];
    response.data.taskDetails.filter((element) => {
      for (const key in element.details) {
        if (key === 'Datetime') {
          dateTime.push(element.details.Datetime);
        }
      }
    });

    // removing underscore from all the objects in array, added timezone in between all the items of all the objects in array, changed the format of all items in timezone
    dateTime.map((item) => {
      var keyse = Object.keys(item);
      for (var i in keyse) {
        item[keyse[i]] = item[keyse[i]].replaceAll('_', ' ');
        const date = item[keyse[i]].slice(0, 16);
        const time = item[keyse[i]].slice(16, 20);
        const formattedTime = time.replace(/..\B/g, '$&:');
        item[keyse[i]] = Date.parse(date + formattedTime + ' UTC+0000');
      }
    });

    // Old Code 
    // entries.map((item) => {
    //   // console.log("item", item);
    //   for (var index in item.details.Colour) {
    //     if (
    //       item.details.Colour[index] === 'Green' ||
    //       item.details.Colour[index] === 'green' ||
    //       item.details.Colour[index] === 'GREEN'
    //     ) {
    //       zones.push({
    //         value: item.details.Datetime[index],
    //         color: 'rgba(99, 190, 123, 1)',
    //         fillColor: 'rgba(99, 190, 123, 0.2)',
    //         title: item.title
    //       });
    //     } else {
    //       zones.push({
    //         value: item.details.Datetime[index],
    //         color: 'rgba(248, 105, 107, 1)',
    //         fillColor: 'rgba(248, 105, 107, 0.2)',
    //         title: item.title
    //       });
    //     }
    //   }
    // });

    let newEntries = [];
    let groupByDateTime = [];
    let result = [];

    entries.map((item) => {
      for (var index in item.details.Datetime) {
        newEntries.push({
          value: item.details.Datetime[index],
          color: item.details.Colour[index],
          title: item.title,
        });
      }
    });

    groupByDateTime = newEntries.reduce(function (r, a) {
      r[a.value] = r[a.value] || [];
      r[a.value].push(a);
      return r;
    }, Object.create(null));

    let az = Object.entries(groupByDateTime);

    for (let i = 0; i < az.length; i++) {
      if (az[i + 1] !== undefined) {

        // let key = az[i][0];
        let value = az[i][1];
        let colors = value.map((element) => {
          return element.color;
        });

        let distColorGet = [...new Set(colors)];
        var defColor = '';
        var defColorFill = '';
        if (distColorGet.length == 1 && distColorGet.includes('Green')) {
          defColor = 'rgba(99, 190, 123, 1)';
          defColorFill = 'rgba(99, 190, 123, 0.3)';
        } else if (distColorGet.length == 1 && distColorGet.includes('Red')) {
          defColor = 'rgba(248, 105, 107, 1)';
          defColorFill = 'rgba(248, 105, 107, 0.2)';
        } else if (
          distColorGet.length == 2 &&
          distColorGet.includes('Red') &&
          distColorGet.includes('Green')
        ) {
          defColor = 'rgba(255, 193, 7, 1)';
          defColorFill = 'rgba(255, 193, 7, 0.2)';
        }

        let obj = { value: az[i + 1][0], color: defColor, fillColor: defColorFill };
        result.push(obj);
      } else {
        result.push({
          value: undefined,
          color: defColor,
          fillColor: defColorFill,
        });
      }
    }
    return result;    
  }


  getSeries(response): any[] {

    const entries = response.data.taskDetails.filter((e1) => e1);
    const dateTimeOfSeries = [];
    response.data.taskDetails.filter((element) => {
      for (const key in element.details) {
        if (key === 'Datetime') {
          dateTimeOfSeries.push(element.details.Datetime);
        }
      }
    });

    if (dateTimeOfSeries[0] !== undefined) {

      // removing underscore from all the objects in array, added timezone in between all the items of all the objects in array, changed the format of all items in timezone
      // dateTimeOfSeries.map((item) => {
      //   let dateKeyse = Object.keys(item);
      //   for (let i in dateKeyse) {
      //     item[dateKeyse[i]] = item[dateKeyse[i]].replaceAll('_', ' ');
      //     const date = item[dateKeyse[i]].slice(0, 16);
      //     const time = item[dateKeyse[i]].slice(16, 20);
      //     const formattedTime = time.replace(/..\B/g, '$&:');
      //     item[dateKeyse[i]] = Date.parse(date + formattedTime + ' UTC+0000');
      //   }
      // });

      // for creating summary graph
      let rows = [];
      const dateTimeArr = Object.values(dateTimeOfSeries[0]);
      const details = response.data.taskDetails[0].details;
      for (const key in details) {
        let hsVal = `${key}`;
        if (hsVal === 'Overall HS' || hsVal === 'Hs in WF') {
          rows = Object.values(details[key]);
        }
      }

      const series = [
        {
          color: '',
          name: '',
          data: rows.map((item, index) => [dateTimeArr[index], item]),
          type: 'areaspline',
          yAxis: 0,
          marker: {
            enabled: true,
            radius: 4.5,
          },
        },
      ];

      let revEntries = [];

      entries.slice().reverse().forEach((x) => revEntries.push(x));
      revEntries.map((item) => {
        series.push({
          name: item.title,
          data: this.getDetails(item),
          color: null,
          type: 'column',
          yAxis: 1,
          marker: null,
        });
      });
      return series;
    }
  }


  getAnalysis(project: string, vessel: string, forecaster: string, session: string, reset: boolean = false, data = 0): void {
    if (!this.forecaster || !this.session) {
      this.analysis = null;
      this.optionsGeneratedCharts = [];
      this.state.canConnect = true;
      this.state.isLoaded = true;
    } else {
      this.analysisService.getAnalysis(project, vessel, forecaster, session, reset).pipe(takeUntil(this.isAnalysisDead$))
        .subscribe(response => {

          this.analysis = response.data;
          if (!this.analysis) {
            this.optionsGeneratedCharts = [];
            this.analysis = null;
            this.state.canConnect = false;
            this.state.isLoaded = true;
          } else {

            let isMessageExist = this.analysis.hasOwnProperty('message');
            if (isMessageExist === true || isMessageExist === false) {
              if (this.analysis.message === "Error with API forecaster") {
                // this.isnoChartsMessage = this.analysis.message;
              }
              else {
                for (let i = 1; i < this.analysis.data.cols.length; i++) {
                  const options = {
                    chart: {
                      type: 'column',
                      zoomType: 'x'
                    },
                    boost: {
                      useGPUTranslations: true
                    },
                    exporting: {
                      sourceWidth: 1800,
                    },
                    noData: {
                      style: {
                        fontWeight: 'bold',
                        fontSize: '15px',
                        color: '#303030'
                      }
                    },
                    title: {
                      text: '14in Recover'
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
                      showLastLabel: true,
                      labels: {
                        format: '{value:%H:%M}',
                        align: 'left',
                        x: 3,
                      },
                      crosshair: {
                        width: 2
                      },
                      plotBands: this.getPlotBands(this.analysis.data)
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
                      gridLineWidth: 2
                    }],
                    yAxis: {
                      lineColor: '#000',
                      lineWidth: 0,
                      gridLineDashStyle: 'Dot',
                      gridLineColor: '#000',
                      allowDecimals: true,
                      tickPixelInterval: 50,
                      className: 'highcharts-color-0',
                      title: {
                        text: ''
                      },
                      max: 2,
                      min: 0,
                      labels: {
                        format: '{value:.1f}'
                      },
                      plotLines: [{
                        // value: 1,
                        // color: '#FF0000',
                        // dashStyle: 'shortdash',
                        // width: 5,
                        // label: {
                        //   text: 'Limit'
                        // }
                      }]
                    },
                    tooltip: {
                      shared: true,
                      useHTML: true,
                      formatter() {
                        const points = this.points;
                        let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
                          '</span><table>';
                        for (const point of points) {
                          const col = (point.y === -1) ? 'N/A' : point.y.toFixed(2);
                          message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td>' +
                            '<td style="text-align: right">' + ((col > 1) ? '<b style="color: rgb(222, 73, 41);">' + col + '</b>' : '<b>' +
                              col + '</b>') + '</td></tr>';
                        }

                        message += '</table>';

                        return message;
                      }
                    },
                    colors: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green',
                      'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green',
                      'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green',],
                    plotOptions: {
                      column: {
                        borderRadius: 5,
                        pointWidth: 15,
                        pointPadding: 0.1,
                      }
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
                        }
                      }]
                    },
                    selectedWoptionList: data
                  };

                  const showCharts = new Array(this.analysis.data.cols[i].subcols.length - 1);
                  const seen = new Set();
                  const addOptions = true;
                  const isAllEmptyObj = [];
                  const series = [];
                  let count = 0;

                  // Check whether (analysis.subcols.data) contains null value or not. It returns true/false in array
                  for (let j = 1; j < this.analysis.data.cols[i].subcols.length - 1; j++) {

                    let chkAnalysisData = this.analysis.data.cols[i].subcols[j].data;
                    let resChkAnalysisData = chkAnalysisData.filter(Array.isArray).length;

                    if (resChkAnalysisData > 0) {
                      const isEmpty2dArr = this.analysis.data.cols[i].subcols[j].data.every((x) => x[data] === null);
                      isAllEmptyObj.push(isEmpty2dArr);
                    } else {
                      const isEmptySingleDimArray = this.analysis.data.cols[i].subcols[j].data.every((x) => x === null);
                      isAllEmptyObj.push(isEmptySingleDimArray);
                    }
                  }

                  // Check whether "isAllEmptyObj" contains similar values or not. It returns true/false in array
                  let checkSimilarValue = isAllEmptyObj.every(
                    (item) => isAllEmptyObj.indexOf(item) === 0
                  );

                  // Get similar value from "isAllEmptyObj" array
                  const getSimilarValue = isAllEmptyObj.find(
                    (n) => seen.size === seen.add(n).size
                  );

                  if ((checkSimilarValue === true) && (getSimilarValue === true)) {
                    count = 1;
                  } else {
                    count = 0;
                  }

                  for (let j = count; j < this.analysis.data.cols[i].subcols.length - 1; j++) {
                    if (this.analysis.data.cols[i].subcols[j].data.length === 0) {
                      showCharts[j] = false;
                    } else {
                      showCharts[j] = true;

                      // Check whether analysis.subcols.data is single dimensional array / two dimensional array
                      let chkAnalysis = this.analysis.data.cols[i].subcols[j].data;
                      let resChkAnalysis = chkAnalysis.filter(Array.isArray).length;

                      // If two dimensional array is there
                      if (resChkAnalysis > 0) {
                        series.push({
                          name: this.analysis.data.cols[i].subcols[j].title,
                          data: this.analysis.data.cols[i].subcols[j].data.slice().map((item, index) => {
                            if (item[data] === '-' || item[data] === '' || item[data] === null) {
                              return [this.analysis.data.rows[index], -1];
                            } else {
                              const limit = (this.analysis.data.cols[i].subcols[j].hasOwnProperty('limit'))
                                ? this.analysis.data.cols[i].subcols[j].limit : null;
                              if (limit && limit > 0) {
                                return [this.analysis.data.rows[index], item[data] / limit];
                              } else {
                                return [this.analysis.data.rows[index], item[data]];
                              }
                            }
                          })
                        });
                      }
                      else { // If single dimensional array is there
                        series.push({
                          name: this.analysis.data.cols[i].subcols[j].title,
                          data: this.analysis.data.cols[i].subcols[j].data.slice().map((item, index) => {
                            if (item === '-' || item === '' || item === null) {
                              return [this.analysis.data.rows[index], -1];
                            } else {
                              const limit = (this.analysis.data.cols[i].subcols[j].hasOwnProperty('limit'))
                                ? this.analysis.data.cols[i].subcols[j].limit : null;
                              if (limit && limit > 0) {
                                return [this.analysis.data.rows[index], item / limit];
                              } else {
                                return [this.analysis.data.rows[index], item];
                              }
                            }
                          })
                        });
                      }
                    }
                  }

                  if (showCharts.find((elt) => elt === true) !== undefined) {
                    if (addOptions === true) {
                      options.series = series;
                      this.optionsGeneratedCharts.push(options);
                    }
                  }
                }

                let resAnalysis = this.analysis.data.cols.map((elt) => elt.weathervaning);
                let j = 0;
                for (let i = 1; i < resAnalysis.length; i++) {
                  if (resAnalysis[i] === false) {
                    j++;
                  }
                }

                // if ((resAnalysis.length - 1) === j) {
                //   this.isDisplayWo = true;
                // } else {
                //   this.isDisplayWo = false;
                // }
              }
            }
            this.state.canConnect = true;
            this.state.isLoaded = true;
          }
        }, error => {
          this.optionsGeneratedCharts = [];
          this.analysis = null;
          // this.state.canConnect = false;
          // this.state.isLoaded = true;
        });
    }
  }

  getPlotBands(data) {
    const size = data.rows.length;
    if (size <= 1) {
      return [];
    }

    const plotBands = [
      {
        from: data.rows[0],
        to: data.rows[0] + Time.Day,
        color: 'rgba(81, 45, 109, 0.2)',
        // color: 'url(#highcharts-default-pattern-0)',
        label: {
          text: 'Day 1',
          style: {
            // color: '#53565a',
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '18px'
          },
          y: -30
        }
      },
      {
        from: data.rows[0] + Time.Day,
        to: data.rows[0] + (Time.Day * 2),
        color: 'rgba(0, 163, 224, 0.2)',
        // color: 'url(#highcharts-default-pattern-3)',
        label: {
          text: 'Day 2',
          style: {
            // color: '#53565a',
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '18px'
          },
          y: -30
        }
      },
      {
        from: data.rows[0] + (Time.Day * 2),
        to: data.rows[0] + (Time.Day * 3),
        color: 'rgba(81, 45, 109, 0.2)',
        // color: 'url(#highcharts-default-pattern-2)',
        label: {
          text: 'Day 3',
          style: {
            // color: '#53565a',
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '18px'
          },
          y: -30
        }
      },
      {
        from: data.rows[0] + (Time.Day * 3),
        to: data.rows[data.rows.length - 1],
        color: 'rgba(0, 163, 224, 0.2)',
        // color: 'url(#highcharts-default-pattern-1)',
        label: {
          text: 'After day 3',
          style: {
            // color: '#53565a',
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '18px'
          },
          y: -30
        }
      }
    ];

    const lastDate = data.rows[data.rows.length - 1];
    const firstDate = data.rows[0];

    if (lastDate <= (firstDate + Time.Day)) {
      return plotBands.slice(0, 1);
    } else if (lastDate <= (firstDate + (2 * Time.Day))) {
      return plotBands.slice(0, 2);
    } else if (lastDate <= (firstDate + (3 * Time.Day))) {
      return plotBands.slice(0, 3);
    } else {
      return plotBands.slice();
    }
  }

}
