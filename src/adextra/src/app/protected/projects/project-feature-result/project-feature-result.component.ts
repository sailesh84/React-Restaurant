import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Project } from '@app/shared/models/project';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductsService } from '@app/core/services/products.service';
import { WeatherService } from '@app/core/services/weather.service';
import { Time } from '@app/shared/enums/time.enums';
import * as moment from 'moment-timezone';
import * as Highcharts from 'highcharts';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-project-feature-result',
  templateUrl: './project-feature-result.component.html',
  styleUrls: ['./project-feature-result.component.scss']
})
export class ProjectFeatureResultComponent implements OnInit {
  state = { isLoaded: false, canConnect: null };
  resetCache = false;

  @Input() project: Project;
  @Input() vesselID = '-1';
  @Input() projectTypeID: '-1';
  @Input() contactID = '-1';
  @Input() schedulerID = '-1';
  @Input() schedulerCurrent: boolean;
  @Input() schedulerCurrentData: string;
  @Input() session: string;
  @Output() isCurrentForecasterActive = new EventEmitter<boolean>();
  highcharts = Highcharts;
  fatigue: any;
  fulgro: any[] = [];
  chartArray: any[] = [];
  newTimestamp: any[] = [];

  private isProductDead$ = new Subject();
  private isFatigueDead$ = new Subject();

  constructor(private productsService: ProductsService, private weatherService: WeatherService) {
  }

  ngOnInit() {    
    this.isCurrentForecasterActive.emit(true);

    if (this.schedulerID && this.schedulerCurrent === true && this.schedulerCurrentData === "Fugro") {
      this.getFugroForecasts();
    } else if (this.schedulerID && this.schedulerCurrent === true && this.schedulerCurrentData === "SatOcean") {
      this.getSatOceanForecasts();
    } else if (this.schedulerID && this.schedulerCurrent === true && this.schedulerCurrentData === "StormGeo") {
      this.getStormGeoForecasts();
    } else {
      this.fatigue = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    // this.isProductDead$.next();
    this.isFatigueDead$.next();
  }

  refresh(): void {
    this.getFugroForecasts();
  }

  getFugroForecasts(reset: boolean = false){
    this.chartArray = [];
    const forecastsType = "Fugro";
    this.weatherService.getAllFugroForecasts(reset).pipe(takeUntil(this.isFatigueDead$)).subscribe(response => {
      this.fatigue = response.data;
      this.createChart(forecastsType);
    }, error => {
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }
  
  getSatOceanForecasts(reset: boolean = false){
    this.chartArray = [];
    const forecastsType = "SatOcean";
    this.weatherService.getAllSatOceanForecasts(reset).pipe(takeUntil(this.isFatigueDead$)).subscribe(response => {
      this.fatigue = response.data;
      this.createChart(forecastsType);
    }, error => {
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }
  
  getStormGeoForecasts(reset: boolean = false){
    this.chartArray = [];
    const forecastsType = "StormGeo";
    this.weatherService.getAllStormGeoForecasts(reset).pipe(takeUntil(this.isFatigueDead$)).subscribe(response => {
      this.fatigue = response.data;
      this.createChart(forecastsType);
    }, error => {
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }

  private getInformation(): void {
    forkJoin([
      this.productsService.getResult(this.project._id, this.vesselID, this.projectTypeID, this.schedulerID, this.session, true).pipe(takeUntil(this.isProductDead$)),
      this.weatherService.getMockFatigueData(true).pipe(takeUntil(this.isFatigueDead$))
    ]).subscribe((responses) => {
      if (responses[1].success === true) {
        // this.createChart();
        this.state.canConnect = true;
        this.state.isLoaded = true;
      }
    }, () => {
      this.state.canConnect = false;
      this.state.isLoaded = true;
      this.fatigue = {};
    });
  }

  createChart(forecastsType: string) {
    this.fatigue.currentData[0].values.map((e1: any) => {
      const chartCreationProcess = {
        chart: {
          type: 'line'
        },
        legend: {
          enabled: true
        },
        noData: {
          style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: e1.depth+ 'm Depth',
          style: {
            fontSize: '30px',
            fontWeight: 'bold'
          }
        },
        navigator: {
          enabled: true,
          height: 80,
          outlineColor: '#00a3e0',
          maskFill: 'rgba(0, 163 , 224, 0.05)',
          xAxis: {
            tickWidth: 0,
            lineWidth: 0,
            gridLineWidth: 1,
            tickPixelInterval: 200,
            labels: {
              enabled: false,
              align: 'left',
              style: {
                color: 'black'
              },
              x: 3,
              y: -4
            }
          }
        },
        scrollbar: {
          enabled: true
        },
        rangeSelector: {
          enabled: false
        },
        xAxis: [{
          opposite: true,
          tickPositions: [11, 35, 59, 83, 107, 131, 155],
          tickLength: 20,
          categories: this.getCategoriesXAxis(),
          gridLineWidth: 2,
          gridLineColor: '#000',
        }],
        yAxis: [{
          lineWidth: 1,
          title: {
            text: forecastsType === 'SatOcean' ? 'Magnitude [kts]' : 'Speed [m/s]',
            style: {
              fontWeight: 'bold',
              color: '#2E6298'
            }
          }
        }, {
          lineWidth: 1,
          opposite: true,
          title: {
            text: 'Direction [Deg]',
            style: {
              fontWeight: 'bold',
              color: '#FF7F50'
            }
          }
        }],
        tooltip: {},
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
            }
          }]
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: true
            }
          }
        },
        series: this.getSeriesNew(e1.depth, forecastsType)
      }

      this.chartArray.push(chartCreationProcess);
    });
  }

  // getSeries(): any[] {
  //   const series = [];
  //   let sf_damage = this.fatigue.map(({ Datetime, Damage }) => [Datetime, Damage]);
  //   let mf_damage = this.fatigue.map(({ Datetime, Damage_1 }) => [Datetime, Damage_1]);

  //   series.push(
  //     {
  //       name: 'StormGeo Forecasted damage',
  //       color: '#5e8941',
  //       data: sf_damage,
  //       zones: [{
  //         value: 0.00976247712667431, //hc
  //         color: '#5f87cc'
  //       }, {
  //         color: '#5e8941'
  //       }]
  //     },
  //     {
  //       name: 'Meteogroup Forecasted damage',
  //       color: '#7030a0',
  //       data: mf_damage,
  //       zones: [{
  //         value: 0.00976247712667431, //hc
  //         color: '#5f87cc'
  //       }, {
  //         color: '#7030a0'
  //       }]
  //     }
  //   );
  //   return series;
  // }

  // getLastStormGeoVal(): any {
  //   const last_element = this.fatigue.reverse().find((n) => n.isDamgeSame === true);
  //   return last_element.Damage;
  // }

  // getLastMeteoVal(): any {
  //   const last_Melement = this.fatigue.reverse().find((n) => n.isDamgeSame === true);
  //   return last_Melement.Damage_1;
  // }

  getCategoriesXAxis() {
    this.fatigue.currentData.map((e1: any) => {
      const dateSplit = e1.timestamp.split('/');
      const reverseDate = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];
      const changedDate = reverseDate.split(' ');
      this.newTimestamp.push(
        new Date(changedDate[0]).toDateString() + ' ' + changedDate[1]
      );
    });
    return this.newTimestamp;
  }

  getSeriesNew(value: string, forecastsType: string) {
    const series = [];
    let depthWiseValues: any[] = [];

    depthWiseValues = this.fatigue.currentData.map((e1: any) =>
      e1.values.find((item: any) => item.depth === value)
    );

    if (forecastsType === "Fugro" || forecastsType === "StormGeo") {
      const speed = depthWiseValues.map((e1: any) => e1.speed);
      const direction = depthWiseValues.map((e2: any) => e2.direction);

      series.push(
        { name: 'Speed', color: '#2E6298', data: speed },
        { name: 'Direction', color: '#FF7F50', yAxis: 1, data: direction }
      );
    }
    else {
      const magnitude = depthWiseValues.map((e2: any) => e2.magnitude);
      const direction = depthWiseValues.map((e2: any) => e2.direction);

      series.push(
        { name: 'Magnitude', color: '#2E6298', data: magnitude },
        { name: 'Direction', color: '#FF7F50', yAxis: 1, data: direction }
      );
    }
    return series;
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }
}
