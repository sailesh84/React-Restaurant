import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Project} from '@app/shared/models/project';
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import HC_boost from 'highcharts/modules/boost';
import HC_more from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_drag_panes from 'highcharts/modules/drag-panes';
import HC_accessibility from 'highcharts/modules/accessibility';
import {WeatherService} from '@app/core/services/weather.service';
import {Observable, Subject} from 'rxjs';
import {ForecastersService} from '@app/core/services/forecasters.service';
import {Forecaster} from '@app/shared/models/forecaster';
import {takeUntil} from 'rxjs/operators';
import {Time} from '@app/shared/enums/time.enums';
HC_stock(Highcharts);
HC_boost(Highcharts);
HC_more(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_drag_panes(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-project-feature-compare',
  templateUrl: './project-feature-compare.component.html',
  styleUrls: ['./project-feature-compare.component.scss']
})
export class ProjectFeatureCompareComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() project: Project;
  @Input() vesselID = '-1';
  forecasters = {forecaster_one: null, forecaster_two: null};

  forecastersList: Forecaster[];

  state = { isLoaded: false, canConnect: null };

  socketEvent: Observable<any>;

  data = [];
  highcharts = null;
  updateFlag = true;
  oneToOneFlag = true;
  chartOptions = [];

  private isSocketEventDead$ = new Subject();
  private isForecastersDead$ = new Subject();
  private isWeatherDead$ = new Subject();

  constructor(private weatherService: WeatherService, private forecastersService: ForecastersService) { }

  ngOnInit() {
    this.getForecasters();

    this.socketEvent = this.weatherService.socketEvent;
  }

  ngAfterViewInit(): void {
    this.socketEvent.pipe(takeUntil(this.isSocketEventDead$)).subscribe(() => {
      this.data  = [];
      this.chartOptions = [
        {...this.getBaseOptions(), ...{title: {text: 'Total wave comparison'}}},
        {...this.getBaseOptions(), ...{title: {text: 'Swell comparison'}}},
        {
          ...this.getBaseOptions(),
          ...{
            title: {text: 'Wind comparison (Speed at 10m)'},
            yAxis: [{
              lineColor: '#000',
              lineWidth: 1,
              gridLineColor: '#000',
              allowDecimals: true,
              className: 'highcharts-color-0',
              title: {
                text: 'Speed (m/s)'
              },
              opposite: false,
            }],
          }
        },
        {
          ...this.getBaseOptions(),
          ...{
            title: {text: 'Wind comparison (Gusts at 10m)'},
            yAxis: [{
              lineColor: '#000',
              lineWidth: 1,
              gridLineColor: '#000',
              allowDecimals: true,
              className: 'highcharts-color-0',
              title: {
                text: 'Speed (m/s)'
              },
              opposite: false,
            }],
          }
        },
      ];

      this.getCompareForecasts(true);
    });
  }

  ngOnDestroy(): void {
    this.isSocketEventDead$.next();
    this.isForecastersDead$.next();
    this.isWeatherDead$.next();
  }

  private getBaseOptions(): any {
    return {
      chart: {
        type: 'columnrange',
        zoomType: 'x',
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
      xAxis: {
        lineColor: '#000',
        lineWidth: 1,
        gridLineWidth: 1,
        gridLineColor: '#000',
        pointInterval: Time.Day,
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%a %e %b %H:%M'
        },
        tickPixelInterval: 50,
        labels: {
          staggerLines: 2
        },
        crosshair: {
          width: '2'
        }
      },
      yAxis: [{
        lineColor: '#000',
        lineWidth: 1,
        gridLineColor: '#000',
        allowDecimals: true,
        className: 'highcharts-color-0',
        title: {
          text: 'Height (m)'
        },
        opposite: false,
      }],
      tooltip: {
        crosshairs: true,
        shared: true,
        useHTML: true,
        formatter() {
          let coeff = 1;
          const points = this.points;
          if (points) {
            let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
              '</span><table>';
            for (const point of points) {
              if (point.point.low && point.point.high) {
                if (point.point.color === 'rgba(255, 193, 7, 1)') {
                  coeff = -1;
                } else {
                  coeff = 1;
                }
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> Difference : </td><td style="' +
                  'text-align: right"><b>' + Highcharts.numberFormat((point.point.high - point.point.low) * coeff, 1) +
                  'm</b></td></tr>';
              } else {
                message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td ' +
                  'style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 1)  +  'm</b></td></tr>';
              }
            }
            message += '</table>';
            return message;
          } else {
            return '';
          }
        },
      },
      series: [],
      plotOptions: {
        columnrange: {
          borderRadius: 5,
          pointWidth: 5,
          pointPadding: 0.1,
        },
        spline: {
          marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle'
          },
        }
      },
      credits: {
        enabled: false
      },
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
  }

  getForecasters(reset: boolean = false) {
    this.forecastersService.getForecasters(reset).pipe(takeUntil(this.isForecastersDead$)).subscribe(response => {
      this.forecastersList = response.data;
      if (this.forecastersList.length < 0) {
        this.forecastersList = [];
        this.forecasters = {forecaster_one: null, forecaster_two: null};
        this.state.canConnect = false;
        this.state.isLoaded = true;
      } else {
        this.forecasters.forecaster_one = response.data[0]._id;
        this.forecasters.forecaster_two = response.data[1]._id;

        this.getCompareForecasts();
      }
    }, error => {
      this.forecastersList = [];
      this.forecasters = {forecaster_one: null, forecaster_two: null};
      this.state.canConnect = false;
      this.state.isLoaded = true;
    });
  }

  selectForecasterOne(event) {
    this.forecasters.forecaster_one = event.target.value;
    this.data = [];
    this.chartOptions = [
      {...this.getBaseOptions(), ...{title: {text: 'Total wave comparison'}}},
      {...this.getBaseOptions(), ...{title: {text: 'Swell comparison'}}},
      {
        ...this.getBaseOptions(),
        ...{
          title: {text: 'Wind comparison (Speed at 10m)'},
          yAxis: [{
            lineColor: '#000',
            lineWidth: 1,
            gridLineColor: '#000',
            allowDecimals: true,
            className: 'highcharts-color-0',
            title: {
              text: 'Speed (m/s)'
            },
            opposite: false,
          }],
        }
      },
      {
        ...this.getBaseOptions(),
        ...{
          title: {text: 'Wind comparison (Gusts at 10m)'},
          yAxis: [{
            lineColor: '#000',
            lineWidth: 1,
            gridLineColor: '#000',
            allowDecimals: true,
            className: 'highcharts-color-0',
            title: {
              text: 'Speed (m/s)'
            },
            opposite: false,
          }],
        }
      },
    ];
    this.getForecasters(true);
  }

  selectForecasterTwo(event) {
    this.forecasters.forecaster_two = event.target.value;
    this.data = [];
    this.chartOptions = [
      {...this.getBaseOptions(), ...{title: {text: 'Total wave comparison'}}},
      {...this.getBaseOptions(), ...{title: {text: 'Swell comparison'}}},
      {
        ...this.getBaseOptions(),
        ...{
          title: {text: 'Wind comparison (Speed at 10m)'},
          yAxis: [{
            lineColor: '#000',
            lineWidth: 1,
            gridLineColor: '#000',
            allowDecimals: true,
            className: 'highcharts-color-0',
            title: {
              text: 'Speed (m/s)'
            },
            opposite: false,
          }],
        }
      },
      {
        ...this.getBaseOptions(),
        ...{
          title: {text: 'Wind comparison (Gusts at 10m)'},
          yAxis: [{
            lineColor: '#000',
            lineWidth: 1,
            gridLineColor: '#000',
            allowDecimals: true,
            className: 'highcharts-color-0',
            title: {
              text: 'Speed (m/s)'
            },
            opposite: false,
          }],
        }
      },
    ];
    this.getForecasters(true);
  }

  getCompareForecasts(reset: boolean = false) {
    this.weatherService.getForecastsToCompare(
      this.forecasters.forecaster_one, this.forecasters.forecaster_two, this.project._id, this.vesselID, reset
    ).pipe(takeUntil(this.isWeatherDead$)).subscribe((response) => {
      if (response.data.length > 0) {
        // this.data = this.getCalculateDifference(response.data);
        this.state.canConnect = true;
        this.state.isLoaded = true;

        this.highcharts = Highcharts;
        this.chartOptions = [
          {
            ...this.getBaseOptions(),
            ...{
              title: {text: 'Total wave comparison'},
              series: [...this.getDumbellSeries(response.data, 'sigWaves', 0, 'Sig wave')]
            }
          },
          {
            ...this.getBaseOptions(),
            ...{
              title: {text: 'Swell comparison'},
              series: [...this.getDumbellSeries(response.data, 'swell', 1, 'Swell')]
            }
          },
          {
            ...this.getBaseOptions(),
            ...{
              title: {text: 'Wind comparison (Speed at 10m)'},
              yAxis: [{
                lineColor: '#000',
                lineWidth: 1,
                gridLineColor: '#000',
                allowDecimals: true,
                className: 'highcharts-color-0',
                title: {
                  text: 'Speed (m/s)'
                },
                opposite: false,
              }],
              tooltip: {
                crosshairs: true,
                shared: true,
                useHTML: true,
                formatter() {
                  let coeff = 1;
                  const points = this.points;
                  if (points) {
                    let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
                      '</span><table>';
                    for (const point of points) {
                      if (point.point.low && point.point.high) {
                        if (point.point.color === 'rgba(255, 193, 7, 1)') {
                          coeff = -1;
                        } else {
                          coeff = 1;
                        }
                        message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> Difference : </td><td style="' +
                          'text-align: right"><b>' + Highcharts.numberFormat((point.point.high - point.point.low) * coeff, 1) +
                          'm/s</b></td></tr>';
                      } else {
                        message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td ' +
                          'style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 1)  +  'm/s</b></td></tr>';
                      }
                    }
                    message += '</table>';
                    return message;
                  } else {
                    return '';
                  }
                },
              },
              series: [...this.getDumbellSeries(response.data, 'speed10', 2, 'Wind speed')]
            }
          },
          {
            ...this.getBaseOptions(),
            ...{
              title: {text: 'Wind comparison (Gusts at 10m)'},
              yAxis: [{
                lineColor: '#000',
                lineWidth: 1,
                gridLineColor: '#000',
                allowDecimals: true,
                className: 'highcharts-color-0',
                title: {
                  text: 'Speed (m/s)'
                },
                opposite: false,
              }],
              tooltip: {
                crosshairs: true,
                shared: true,
                useHTML: true,
                formatter() {
                  let coeff = 1;
                  const points = this.points;
                  if (points) {
                    let message = '<span style="font-weight: bold;">' + Highcharts.dateFormat('%a %e %b %H:%M %Z', this.x) +
                      '</span><table>';
                    for (const point of points) {
                      if (point.point.low && point.point.high) {
                        if (point.point.color === 'rgba(255, 193, 7, 1)') {
                          coeff = -1;
                        } else {
                          coeff = 1;
                        }
                        message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> Difference : </td><td style="' +
                          'text-align: right"><b>' + Highcharts.numberFormat((point.point.high - point.point.low) * coeff, 1) +
                          'm/s</b></td></tr>';
                      } else {
                        message += '<tr><td><span style="color: ' + point.color + '">\u25CF</span> ' + point.series.name + ' : </td><td ' +
                          'style="text-align: right"><b>' + Highcharts.numberFormat(point.y, 1)  +  'm/s</b></td></tr>';
                      }
                    }
                    message += '</table>';
                    return message;
                  } else {
                    return '';
                  }
                },
              },
              series: [...this.getDumbellSeries(response.data, 'gusts10', 2, 'Wind gusts')]
            }
          }
        ];
      } else {
        this.data = [];
        this.state.canConnect = false;
        this.state.isLoaded = true;
        this.highcharts = Highcharts;

        this.chartOptions = [
          {...this.getBaseOptions(), ...{title: {text: 'Total wave comparison'}}},
          {...this.getBaseOptions(), ...{title: {text: 'Swell comparison'}}},
          {
            ...this.getBaseOptions(),
            ...{
              title: {text: 'Wind comparison (Speed at 10m)'},
              yAxis: [{
                lineColor: '#000',
                lineWidth: 1,
                gridLineColor: '#000',
                allowDecimals: true,
                className: 'highcharts-color-0',
                title: {
                  text: 'Speed (m/s)'
                },
                opposite: false,
              }],
            }
          },
          {
            ...this.getBaseOptions(),
            ...{
              title: {text: 'Wind comparison (Gusts at 10m)'},
              yAxis: [{
                lineColor: '#000',
                lineWidth: 1,
                gridLineColor: '#000',
                allowDecimals: true,
                className: 'highcharts-color-0',
                title: {
                  text: 'Speed (m/s)'
                },
                opposite: false,
              }],
            }
          },
        ];
      }
    }, (error) => {
      this.data = [];
      this.state.canConnect = false;
      this.state.isLoaded = true;
      this.highcharts = Highcharts;

      this.chartOptions = [
        {...this.getBaseOptions(), ...{title: {text: 'Total wave comparison'}}},
        {...this.getBaseOptions(), ...{title: {text: 'Swell comparison'}}},
        {
          ...this.getBaseOptions(),
          ...{
            title: {text: 'Wind comparison (Speed at 10m)'},
            yAxis: [{
              lineColor: '#000',
              lineWidth: 1,
              gridLineColor: '#000',
              allowDecimals: true,
              className: 'highcharts-color-0',
              title: {
                text: 'Speed (m/s)'
              },
              opposite: false,
            }],
          }
        },
        {
          ...this.getBaseOptions(),
          ...{
            title: {text: 'Wind comparison (Gusts at 10m)'},
            yAxis: [{
              lineColor: '#000',
              lineWidth: 1,
              gridLineColor: '#000',
              allowDecimals: true,
              className: 'highcharts-color-0',
              title: {
                text: 'Speed (m/s)'
              },
              opposite: false,
            }],
          }
        },
      ];
    });
  }


  roundDecimal(n: number, decimal: number = 2): number {
    const precision = Math.pow(10, decimal);
    return Math.round( n * precision) / precision;
  }

  refresh(): void {
    this.data = [];
    this.chartOptions = [
      {...this.getBaseOptions(), ...{title: {text: 'Total wave comparison'}}},
      {...this.getBaseOptions(), ...{title: {text: 'Swell comparison'}}},
      {...this.getBaseOptions(), ...{title: {text: 'Wind comparison (Speed at 10m)'}}},
      {...this.getBaseOptions(), ...{title: {text: 'Wind comparison (Gusts at 10m)'}}},
    ];
    this.getForecasters(true);
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }

  private getDumbellSeries(data: any, prop: string, index: number, label: string) {
    const series =  [{
      name: `${label} forecaster 1`,
      type: 'spline',
      data: [],
      color: '#FF0000'
    }, {
      name: `${label} forecaster 2`,
      type: 'spline',
      data: [],
      color: '#0000FF',
    }, {
      id: 'dumbell-wave',
      name: '',
      data: [],
      showInLegend: false
     }, {
      linkedTo: 'dumbell-wave',
      type: 'scatter',
      name: '',
      data: [],
      showInLegend: false,
      enableMouseTracking: false,
    }, {
      linkedTo: 'dumbell-wave',
      type: 'scatter',
      name: '',
      data: [],
      showInLegend: false,
      enableMouseTracking: false,
    }];

    if (data && data.length > 1) {
      if (data[0].dataset && data[1].dataset) {
        series[0].data = [... (((data[0].dataset[index] || [])[prop] || []))];
        series[1].data = [... (((data[1].dataset[index] || [])[prop] || []))];
      }
    }

    if (series[0].data && series[0].data.length > 0 && series[1].data && series[1].data.length > 0) {
      for (const item of data[0].dataset[index][prop]) {
        const isExistInForecastTwo = data[1].dataset[index][prop].find(elt => elt[0] === item[0]);

        if (isExistInForecastTwo) {
          const diff = item[1] - isExistInForecastTwo[1];

          series[2].data.push({
            x: item[0],
            low: (diff < 0) ? item[1] : isExistInForecastTwo[1],
            high: (diff < 0) ? isExistInForecastTwo[1] : item[1],
            color: (diff < 0) ? 'rgba(255, 193, 7, 1)' : 'rgba(99, 190, 123, 1)',
          });

          if (diff < 0) {
            series[3].data.push({
              x: item[0],
              y: item[1],
              marker: {
                radius: 8,
                symbol: 'triangle-down',
                fillColor: 'rgba(255, 193, 7, 1)',
                enabled: true
              }
            });
          } else {
            series[4].data.push({
              x: item[0],
              y: item[1],
              marker: {
                radius: 8,
                symbol: 'triangle',
                fillColor: 'rgba(99, 190, 123, 1)',
                enabled: true
              }
            });
          }
        }
      }
    }

    return series;
  }
}
