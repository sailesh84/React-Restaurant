import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_boost from 'highcharts/modules/boost';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_drag_panes from 'highcharts/modules/drag-panes';
import HC_accessibility from 'highcharts/modules/accessibility';
import { AnalysisService } from '@app/core/services/analysis.service';
import { SchedulersService } from '@app/core/services/schedulers.service';
import { Scheduler } from '@app/shared/models/scheduler';
import { Analysis } from '@app/shared/models/analysis';
import { ExplanationsService } from '@app/core/services/explanations.service';
import { Explanation } from '@app/shared/models/explanation';
import { forkJoin, Observable, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Time } from '@app/shared/enums/time.enums';
import { Project } from '@app/shared/models/project';
HC_stock(Highcharts);
HC_boost(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_drag_panes(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-project-feature-summary',
  templateUrl: './project-feature-summary.component.html',
  styleUrls: ['./project-feature-summary.component.scss']
})
export class ProjectFeatureSummaryComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() project: Project;
  @Input() vesselID = '-1';
  @Input() session: string;
  @Input() forecaster: string;
  @Input() schedulerID: string;
  @Input() isAlphaFactor: boolean;
  @Output() isCurrentForecasterActive = new EventEmitter<boolean>();
  schedulers: Scheduler[];
  fatigue: any[] = [];
  analysisDataForForecaster: string;
  analysisDataForCurrent: string;

  state = { isLoaded: false, canConnect: null };

  analysis: Analysis;
  explanation: Explanation;

  @ViewChild('modalHelp', { static: false }) modalHelp: ElementRef;

  min: number;
  max: number;
  highcharts = Highcharts;
  chartOptions = {};
  colorList: any[];
  isnoChartsMessage: string = "";
  
  startinHrsList: any[] = [];
  selectedstartinHrsList: number = 0;
  resetCache = false;
  delay: number = 0;
  isShown: boolean = false;
  startIndex: number = 0;
  endIndex: number = 0;

  socketEvent1: Observable<any>;
  socketEvent2: Observable<any>;

  private isSocket1EventDead$ = new Subject();
  private isSocket2EventDead$ = new Subject();
  private isAnalysisDead$ = new Subject();
  private isExplanationDead$ = new Subject();
  private isSchedulersDead$ = new Subject();

  constructor(private analysisService: AnalysisService, private schedulersService: SchedulersService, private explanationsService: ExplanationsService, private modalService: NgbModal) {
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', backdrop: 'static', scrollable: true })
      .result.then((result) => {
        // this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  ngOnInit() {
    this.socketEvent1 = this.explanationsService.socketEvent;
    this.socketEvent2 = this.analysisService.socketEvent;
    this.startinHrsList = [
      { _id: 0, value: 0 },
      { _id: 1, value: 1 },
      { _id: 2, value: 2 },
      { _id: 3, value: 3 },
      { _id: 4, value: 4 },
      { _id: 5, value: 5 },
      { _id: 6, value: 6 },
      { _id: 7, value: 7 },
      { _id: 8, value: 8 },
      { _id: 9, value: 9 },
      { _id: 10, value: 10 },
      { _id: 11, value: 11 },
      { _id: 12, value: 12 },
      { _id: 13, value: 13 },
      { _id: 14, value: 14 },
      { _id: 15, value: 15 },
      { _id: 16, value: 16 },
      { _id: 17, value: 17 },
      { _id: 18, value: 18 },
    ];
    this.isCurrentForecasterActive.emit(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.socketEvent1.pipe(takeUntil(this.isSocket1EventDead$)).subscribe(() => {
      this.getData(true, false);
    });
    this.socketEvent2.pipe(takeUntil(this.isSocket2EventDead$)).subscribe(() => {
      this.getData(false, true);
    });
  }

  ngOnDestroy(): void {
    this.isSocket1EventDead$.next();
    this.isSocket2EventDead$.next();
    this.isAnalysisDead$.next();
    this.isExplanationDead$.next();
    this.isSchedulersDead$.next();
  }

  getAnalysisData(id: string): void {

  }

  getData(resetEpl: boolean = false, resetAls: boolean = false): void {
    if (!this.session || !this.forecaster) {
      this.explanation = {
        _id: '', text: '', note: '', project: this.project._id, vessel: this.vesselID, product: null, forecaster: this.forecaster, analysis: null
      };
      this.analysis = null;
      this.state.canConnect = true;
      this.state.isLoaded = true;
    } else {
      forkJoin([
        this.analysisService.getAnalysis(this.project._id, this.vesselID, this.forecaster, this.session, resetAls).
          pipe(takeUntil(this.isAnalysisDead$)),
        this.schedulersService.getSchedulers(this.resetCache).pipe(takeUntil(this.isSchedulersDead$))
      ]).subscribe((responses) => {
        this.analysis = responses[0].data;
        this.schedulers = responses[1].data;
        const result = this.schedulers.filter(
          (elem) => elem._id === responses[0].data.schedulerId
        );

        this.analysisDataForForecaster = result[0].testing === true ? "Testing" : Object.values(result[0].forecasters)[0].name;
        this.analysisDataForCurrent = result[0].current === true ? result[0].current_data : "NA";

        this.explanationsService.getExplanation(this.project._id, this.vesselID, this.forecaster, this.analysis._id, resetEpl)
          .pipe(takeUntil(this.isExplanationDead$)).subscribe((resp) => {
            this.explanation = resp.data;
            this.createChart();
          }, () => {
            this.explanation = {
              _id: '', text: '', note: '', project: this.project._id, vessel: this.vesselID, product: null, forecaster: this.forecaster,
              analysis: this.analysis._id
            };
            this.createChart();
          });

      }, error => {
        this.schedulers = [];
        this.explanation = {
          _id: '', text: '', note: '', project: this.project._id, vessel: this.vesselID, product: null, forecaster: this.forecaster, analysis: null
        };
        this.analysis = null;
        this.state.canConnect = false;
        this.state.isLoaded = true;
      });
    }
  }

  createChart(): void {
    const that = this;
    if (!this.analysis) {
      this.chartOptions = {};
      this.min = null;
      this.max = null;
      this.explanation = {
        _id: '', text: '', note: '', project: this.project._id, vessel: this.vesselID, product: null, forecaster: this.forecaster,
        analysis: null
      };
      this.state.canConnect = false;
      this.state.isLoaded = true;
    } else {
      let isMessageExist = this.analysis.hasOwnProperty('message');
      if (isMessageExist === true || isMessageExist === false) {
        if (this.analysis.message === "Error with API forecaster") {
          this.isnoChartsMessage = this.analysis.message;
        }
        else {
          this.chartOptions = {
            chart: {
              zoomType: 'x',
            },
            // exporting: {
            //   buttons: {
            //     explanationButtonChart: {
            //       // text: 'See explanation',
            //       onclick() {
            //         that.open(that.modalHelp);
            //       }
            //     }
            //   },
            //   sourceWidth: 1800,
            // },
            exporting: {
              buttons: {
                contextButton: {
                  menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG']
                }
              }
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
              // selected: 1,
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
              enabled: true,
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
              },
              plotLines:[{
                color: '#fbfcd0',
                height: '2px',
                from: this.analysis.hasOwnProperty('currentForecasterData') === true ? this.analysis.currentForecasterData.fromDate : 0,
                to: this.analysis.hasOwnProperty('currentForecasterData') === true ? this.analysis.currentForecasterData.toDate : 0,
                zIndex: -999,
                width: 2,
                label: {
                  text: 'Forecaster + Current',
                  align: 'center',
                  style: {
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: 'large',
                  },
                  visible: false
                }
              },
              {
                color: '#d0fcdb',
                from: this.analysis.hasOwnProperty('forecasterData') === true ? this.analysis.forecasterData.fromDate : 0,
                to: this.analysis.hasOwnProperty('forecasterData') === true ? this.analysis.forecasterData.toDate : 0,
                zIndex: -999,
                width: 2,
                label: {
                  text: 'Forecaster',
                  align: 'center',
                  style: {
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: 'large'
                  },
                  visible: false
                }
              }]
            }, 
            { // Top X axis
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
                  if (point.color === '#34495e' || point.color === 'rgba(52, 73, 94, 0.3)') {
                    state = 'Completed';
                  } else if (point.color === '#90ed7d' || point.color === 'rgba(99, 190, 123, 0.3)') {
                    state = 'Passed';
                  } else if (point.color === '#8d0f94' || point.color === 'rgba(141, 15, 148, 0.3)') {
                    state = 'Swell';
                  } else if (point.color === '#0f4094' || point.color === 'rgba(15, 64, 148, 0.3)') {
                    state = 'Wind';
                  } else if (point.color === '#b0b0b0' || point.color === 'rgba(176, 176, 176, 0.3)') {
                    state = 'Failed Calculation';
                  } 
                  else {
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
      }
      this.state.canConnect = true;
      this.state.isLoaded = true;
    }
  }

  getScaleColour(value: number) {
    let [highMaxR, highMaxG, highMaxB] = [248, 105, 107];
    let [lowMaxR, lowMaxG, lowMaxB] = [99, 190, 123];
    const [midMaxR, midMaxG, midMaxB] = [255, 235, 132];
    let max = this.max;
    let min = this.min;

    if (Math.round(max - min) === 0) { return `${highMaxR}, ${highMaxG}, ${highMaxB}`; }

    const midPoint = (max + min) / 2;
    if (value > midPoint) {
      [lowMaxR, lowMaxG, lowMaxB] = [midMaxR, midMaxG, midMaxB];
      min = midPoint;
    } else {
      [highMaxR, highMaxG, highMaxB] = [midMaxR, midMaxG, midMaxB];
      max = midPoint;
    }

    const percentage = Math.abs((value - min) / (max - min));

    const redVal = Math.round(lowMaxR + ((highMaxR - lowMaxR) * percentage));
    const greenVal = Math.round(lowMaxG + ((highMaxG - lowMaxG) * percentage));
    const blueVal = Math.round(lowMaxB + ((highMaxB - lowMaxB) * percentage));

    return `${redVal}, ${greenVal}, ${blueVal}`;
  }

  private getZones(): any[] {
    
    // Fails counter
    const tabCountFails = [];
    let nbRows = this.analysis.data.cols.length - 1;
    let minus = 0;
    let i = 0;

    let istPopExist = this.analysis.data.cols.filter((element) => element.offshoreDuration);
    let isPredecessorExist = this.analysis.data.cols.filter((element) => element.predecessor);

    if (this.isAlphaFactor === true) {  //If Alpha Factor is enabled in scheduler
      if (istPopExist.length > 0 && isPredecessorExist.length > 0) {
        
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
              tabCountFails.push({ date: this.analysis.data.rows[i], count: countFails, stable: stable[i], cols: this.analysis.data.cols[j].title, tPopValues: this.analysis.data.cols[j].offshoreDuration, predecessorValues: this.analysis.data.cols[j].predecessor });
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
              tabCountFails.push({ date: this.analysis.data.rows[i], count: countFails, stable: "No", cols: this.analysis.data.cols[j].title, tPopValues: this.analysis.data.cols[j].offshoreDuration, predecessorValues: this.analysis.data.cols[j].predecessor });
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
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              } else {
                endDate = tabCountFails[index].date;
                color = 'rgba(99, 190, 123, 1)';      //success
                fillColor = 'rgba(99, 190, 123, 0.3)';
                colorCode = 'green';
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              }
            }
            else if (tabCountFails[index].count > 0 && tabCountFails[index].count < nbRows) {
              if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) { // if stable property is not present in object
                endDate = tabCountFails[index].date;
                color = '';
                fillColor = '';
                colorCode = '';
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              } else {
                if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(255, 193, 7, 1)';       //warning
                  fillColor = 'rgba(255, 193, 7, 0.2)';
                  colorCode = 'yellow';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                }
                else {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(201, 201, 201, 1)';     //failed-calculation
                  fillColor = 'rgba(201, 201, 201, 0.2)';
                  colorCode = 'grey';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                }
              }
            }
            else {
              if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) {
                endDate = tabCountFails[index].date;
                color = '';
                fillColor = '';
                colorCode = '';
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              } else {
                if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(248, 105, 107, 1)';     //error
                  fillColor = 'rgba(248, 105, 107, 0.2)';
                  colorCode = 'red';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                }
                else {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(201, 201, 201, 1)';     //failed-calculation
                  fillColor = 'rgba(201, 201, 201, 0.2)';
                  colorCode = 'grey';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
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
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              } else {
                endDate = tabCountFails[index].date;
                color = 'rgba(99, 190, 123, 1)';  //success
                fillColor = 'rgba(99, 190, 123, 0.3)';
                colorCode = 'green';
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              }
            }
            else if (tabCountFails[index].count > 0 && tabCountFails[index].count < nbRows) {
              if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) {
                endDate = tabCountFails[index].date;
                color = '';
                fillColor = '';
                colorCode = '';
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              } else {
                if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(255, 193, 7, 1)';       //warning
                  fillColor = 'rgba(255, 193, 7, 0.2)';
                  colorCode = 'yellow';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                }
                else {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(201, 201, 201, 1)';     //failed-calculation
                  fillColor = 'rgba(201, 201, 201, 0.2)';
                  colorCode = 'grey';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                }
              }
            }
            else {
              if (tabCountFails[index].hasOwnProperty('stable') === false || tabCountFails[index].stable === undefined) {
                endDate = tabCountFails[index].date;
                color = '';
                fillColor = '';
                colorCode = '';
                zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
              } else {
                if (tabCountFails[index].stable === true || tabCountFails[index].stable === "No") {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(248, 105, 107, 1)';     //error
                  fillColor = 'rgba(248, 105, 107, 0.2)';
                  colorCode = 'red';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                } else {
                  endDate = tabCountFails[index].date;
                  color = 'rgba(201, 201, 201, 1)';     //failed-calculation
                  fillColor = 'rgba(201, 201, 201, 0.2)';
                  colorCode = 'grey';
                  zones.push({ value: endDate, fillColor, color, colorCode: colorCode, cols: tabCountFails[index].cols });
                }
              }
            }
          }
        }
    
        if(tabCountFails.length > 0){
          const lastElt = tabCountFails[tabCountFails.length - 1];
          if (lastElt.count <= 0) {
            color = 'rgba(99, 190, 123, 1)';      //success
            fillColor = 'rgba(99, 190, 123, 0.3)';
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
              defColorFill = 'rgba(99, 190, 123, 0.3)';
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
        let delay = this.delay;
        let tpopSum = 0;
        let startIndex = 0;
        let a = [];
        let b = [];
        let startRemains = [];
        let seriesOutput = [];

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

        seriesOutput = this.getSeries();

        // procedure for sum tPop values start
        let filterAnalysis = this.analysis.data.cols.slice(0);
        let responseWithoutZeroPredecessor = filterAnalysis.findIndex((element) => {
          if (element.predecessor === 0) {
            return element.predecessor === 0;
          }
        });
        
        let filterAnalysisExcludZero: any;
        if (responseWithoutZeroPredecessor !== -1) {
          filterAnalysisExcludZero = filterAnalysis.slice().filter((item) => item.predecessor !== 0);
        }
        else {
          filterAnalysisExcludZero = filterAnalysis;
        }

        for (let i = 1; i < filterAnalysisExcludZero.length; i++) {
          tpopSum = tpopSum + filterAnalysisExcludZero[i].offshoreDuration;
        }

        // procedure for sum tPop values end
        finalOutput.filter((item, index) => {
          // filter non-highlighted cells first which is less than delay values
          if (index >= startIndex && index < delay) {
            item.color = 'rgba(255, 255, 255, 0.2)';
            // item.fillColor = 'rgba(255, 255, 255, 0.2)';
            startRemains.push(item);
          }
        });

        // Old Code
        // finalOutput.filter((item, index) => {
        //   // filter highlighted cells
        //   if (index >= startIndex + delay && index < tpopSum + delay) {
        //     a.push(item);
        //   }
        // });

        
        let seriesRev = seriesOutput.reverse();
        let start = 0;
        let end = 0;
        seriesRev.slice().map((item, index) => {
          if (item.name !== '') {
            start = item.start;
            end = item.end;
            for (let i = start; i <= end; i++) {
              if (item.data[i + 1] !== undefined) {
                a.push({
                  name: item.name,
                  value: item.data[i + 1].x,
                  color: item.data[i].zoneColor,
                  fillColor: item.data[i].fillColor,
                });
              } else {
                a.push({
                  name: item.name,
                  value: undefined,
                  color: 'rgba(255, 255, 255, 0.2)',
                  fillColor: 'rgba(255, 193, 7, 0.2)',
                  colorCode: '',
                });
              }
            }
          }
        });

        finalOutput.filter((item, index) => {
          // filter non-highlighted cells
          if (index >= tpopSum + delay && index < finalOutput.length) {
            item.color = 'rgba(255, 255, 255, 0.2)';
            // item.fillColor = 'rgba(255, 255, 255, 0.2)';
            b.push(item);
          }
        });

        let c = startRemains.concat(a, b);
        return c;
      }
      else {
        // If tPop and Predecessor property is not present
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
                fillColor = 'rgba(99, 190, 123, 0.3)';
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
                fillColor = 'rgba(99, 190, 123, 0.3)';
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
            fillColor = 'rgba(99, 190, 123, 0.3)';
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
              defColorFill = 'rgba(99, 190, 123, 0.3)';
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
    }
    else {  //If Alpha Factor is not enabled in scheduler
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
              fillColor = 'rgba(99, 190, 123, 0.3)';
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
              fillColor = 'rgba(99, 190, 123, 0.3)';
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
          fillColor = 'rgba(99, 190, 123, 0.3)';
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
            defColorFill = 'rgba(99, 190, 123, 0.3)';
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
  }

  getSeries(): any[] {
    const series = [{
      color: '',
      name: '',
      data: this.analysis.data.cols[0].subcols[0].data.slice().map((item, index) => [this.analysis.data.rows[index], item]),
      type: 'areaspline',
      yAxis: 0,
      predecessor: 0,
      marker: {
        enabled: true,
        radius: 4.5
      },
      start: 0,
      end: 0
    }];
    const nbRows = this.analysis.data.cols.length - 1;
    const temp = [];
    let startIndex = this.startIndex;
    let endIndex = this.endIndex;
    let delay = this.delay;
    let tPopSum = 0;


    let istPopExist = this.analysis.data.cols.filter((element) => element.offshoreDuration);
    let isPredecessorExist = this.analysis.data.cols.filter((element) => element.predecessor);
    let isRunExist = this.analysis.data.cols.filter((element) => element.run);

    if (this.isAlphaFactor === true) { //If Alpha Factor is enabled in scheduler
      if (istPopExist.length > 0 && isPredecessorExist.length > 0) {

        this.isShown = true; //true

        // procedure for sum tPop values start
        let filterAnalysis = this.analysis.data.cols.slice(0);
        let responseWithoutZeroPredecessor = filterAnalysis.findIndex((element) => {
          if (element.predecessor === 0) {
            return element.predecessor === 0;
          }
        });
        
        let filterAnalysisExcludZero: any;
        if (responseWithoutZeroPredecessor !== -1) {
          filterAnalysisExcludZero = filterAnalysis.slice().filter((item) => item.predecessor !== 0);
        }
        else {
          filterAnalysisExcludZero = filterAnalysis;
        }

        for (let i = 1; i < filterAnalysisExcludZero.length; i++) {
          tPopSum = tPopSum + filterAnalysisExcludZero[i].tpop;
        }


        // If tPop and Predecessor property is present
        for (let i = 1; i < this.analysis.data.cols.length; i++) {
            const tempRow = { name: this.analysis.data.cols[i].title, values: [], tPopValues: this.analysis.data.cols[i].offshoreDuration, predecessorValues: this.analysis.data.cols[i].predecessor };
  
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

        //Sorting temp in ascending order
        let tempSorted = temp.sort(function (a, b) {
          return a.predecessorValues - b.predecessorValues;
        });
        
        //Highlighting cell according to tPop values
        tempSorted.forEach(function (item, index) {
          let idx = index;
          if(item.predecessorValues === 0){ // item object whose predecessor value = 0
            idx = 0;
            if (idx <= 0) {
              startIndex = 0 + delay;
              // endIndex = item.tPopValues + delay;
              endIndex = tPopSum + delay;
              series.push({
                name: item.name,
                data: item.values.slice().map((element, index) => {
                  if (index >= startIndex && index < endIndex) {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = '#34495e';
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = '#90ed7d';
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = '#8d0f94';
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = '#0f4094';
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = '#b0b0b0';
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = '#f15c80';
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }

                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };

                  } else {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = 'rgba(52, 73, 94, 0.3)';  //#34495e
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = 'rgba(99, 190, 123, 0.3)'; //#90ed7d
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = 'rgba(141, 15, 148, 0.3)'; //#8d0f94
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = 'rgba(15, 64, 148, 0.3)'; //#0f4094
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = 'rgba(176, 176, 176, 0.3)'; //#b0b0b0
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = 'rgba(241, 92, 128, 0.2)'; //#f15c80
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }
  
                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };
                  }
                }),
                color: null,
                type: 'column',
                yAxis: 1,
                predecessor: item.predecessorValues,
                marker: null,
                start: startIndex,
                end: endIndex - 1
              });
            }
  
            if (idx > 0 && idx < temp.length + 1) {
              startIndex = endIndex;
              // endIndex = startIndex + item.tPopValues;
              endIndex = startIndex + tPopSum;
              series.push({
                name: item.name,
                data: item.values.slice().map((element, index) => {
                  if (index >= startIndex && index < endIndex) {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = '#34495e';
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = '#90ed7d';
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = '#8d0f94';
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = '#0f4094';
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = '#b0b0b0';
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = '#f15c80';
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }
  
                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };
  
                  } else {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = 'rgba(52, 73, 94, 0.3)';  //#34495e
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = 'rgba(99, 190, 123, 0.3)'; //#90ed7d
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = 'rgba(141, 15, 148, 0.3)'; //#8d0f94
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = 'rgba(15, 64, 148, 0.3)'; //#0f4094
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = 'rgba(176, 176, 176, 0.3)'; //#b0b0b0
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = 'rgba(241, 92, 128, 0.2)'; //#f15c80
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }
  
                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };
                  }
                }),
                color: null,
                type: 'column',
                yAxis: 1,
                predecessor: item.predecessorValues,
                marker: null,
                start: startIndex,
                end: endIndex - 1
              });
            }
          }
          else { // item object whose predecessor value > 0
            const predecessorCount = tempSorted.filter((obj) => obj.predecessorValues === 0).length;
            const idxx = idx - predecessorCount;
            if (idxx <= 0) {
              startIndex = 0 + delay;
              endIndex = item.tPopValues + delay;
              series.push({
                name: item.name,
                data: item.values.slice().map((element, index) => {
                  if (index >= startIndex && index < endIndex) {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = '#34495e';
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = '#90ed7d';
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = '#8d0f94';
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = '#0f4094';
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = '#b0b0b0';
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = '#f15c80';
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }

                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };

                  } else {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = 'rgba(52, 73, 94, 0.3)';  //#34495e
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = 'rgba(99, 190, 123, 0.3)'; //#90ed7d
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = 'rgba(141, 15, 148, 0.3)'; //#8d0f94
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = 'rgba(15, 64, 148, 0.3)'; //#0f4094
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = 'rgba(176, 176, 176, 0.3)'; //#b0b0b0
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = 'rgba(241, 92, 128, 0.2)'; //#f15c80
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }

                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };
                  }
                }),
                color: null,
                type: 'column',
                yAxis: 1,
                predecessor: item.predecessorValues,
                marker: null,
                start: startIndex,
                end: endIndex - 1
              });
            }
  
            if (idxx > 0 && idxx < temp.length+1) {
              startIndex = endIndex;
              endIndex = startIndex + item.tPopValues;
              series.push({
                name: item.name,
                data: item.values.slice().map((element, index) => {
                  if (index >= startIndex && index < endIndex) {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = '#34495e';
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = '#90ed7d';
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = '#8d0f94';
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = '#0f4094';
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = '#b0b0b0';
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = '#f15c80';
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }
  
                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };
  
                  } else {
                    let color;
                    let zoneColor;
                    let fillColor;
                    let colorCode;
                    if (element[1] === 0) {
                      color = 'rgba(52, 73, 94, 0.3)';  //#34495e
                      zoneColor = '';
                      fillColor = '';
                      colorCode = '';
                    } else if (element[1] === 1) {
                      color = 'rgba(99, 190, 123, 0.3)'; //#90ed7d
                      zoneColor = 'rgba(99, 190, 123, 1)';
                      fillColor = 'rgba(99, 190, 123, 0.3)';
                      colorCode = 'green';
                    } else if (element[1] === 3) {
                      color = 'rgba(141, 15, 148, 0.3)'; //#8d0f94
                      zoneColor = 'rgba(141, 15, 148, 1)';
                      fillColor = 'rgba(141, 15, 148, 0.3)';
                      colorCode = 'purple';
                    } else if (element[1] === 4) {
                      color = 'rgba(15, 64, 148, 0.3)'; //#0f4094
                      zoneColor = 'rgba(15, 64, 148, 1)';
                      fillColor = 'rgba(15, 64, 148, 0.3)';
                      colorCode = 'blue';
                    } else if (element[1] === 5) {
                      color = 'rgba(176, 176, 176, 0.3)'; //#b0b0b0
                      zoneColor = 'rgba(201, 201, 201, 1)';
                      fillColor = 'rgba(201, 201, 201, 0.2)';
                      colorCode = 'grey';
                    } else {
                      color = 'rgba(241, 92, 128, 0.2)'; //#f15c80
                      zoneColor = 'rgba(248, 105, 107, 1)';
                      fillColor = 'rgba(248, 105, 107, 0.2)';
                      colorCode = 'red';
                    }
  
                    return { x: element[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white', zoneColor, fillColor, colorCode };
                  }
                }),
                color: null,
                type: 'column',
                yAxis: 1,
                predecessor: item.predecessorValues,
                marker: null,
                start: startIndex,
                end: endIndex - 1
              });
            }
          }
        });

        const excludedZeroSeries = series.slice().filter((item) => item.predecessor === 0);
        const excludedSeriesSecond = series.slice().filter((item) => item.predecessor !== 0);
        const finalSeries = excludedZeroSeries.concat(excludedSeriesSecond.reverse());

        this.colorList = this.getColors(finalSeries);
        return finalSeries;
      }
      else {
        // If tPop and Predecessor property is not present
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
              return { x: item[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white' }; // highlighter
            }),
            color: null,
            type: 'column',
            yAxis: 1,
            predecessor: 0,
            marker: null,
            start: startIndex,
            end: endIndex - 1
          });
        }

        this.colorList = this.getColors(series);
        return series;
      }
    }
    else { //If Alpha Factor is not enabled in scheduler      
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
            return { x: item[0], y: - (0.7 / nbRows), color, borderWidth: 1, borderColor: 'white' }; // highlighter
          }),
          color: null,
          type: 'column',
          yAxis: 1,
          predecessor: 0,
          marker: null,
          start: startIndex,
          end: endIndex - 1
        });
      }

      this.colorList = this.getColors(series);
      return series;
    }
  }

  refresh(): void {
    this.getData(true, true);
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

  onStartinHrsChange(event): void {
    const selectedStartInHrs = {"startInHours": event._id};
    this.schedulersService.saveStartingHrs(this.schedulerID, selectedStartInHrs).subscribe((response) => {
      if(response.success === true){
        this.delay = response.data.startInHours;
        this.getData(true, true);
      }
    });
  }

}