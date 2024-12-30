import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Time} from '@app/shared/enums/time.enums';
import * as Highcharts from 'highcharts';
import HC_gantt from 'highcharts/modules/gantt';
import HC_boost from 'highcharts/modules/boost';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_draggable_points from 'highcharts/modules/draggable-points';
import HC_accessibility from 'highcharts/modules/accessibility';
import {Scheduler} from '@app/shared/models/scheduler';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
HC_gantt(Highcharts);
HC_boost(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_draggable_points(Highcharts);
HC_accessibility(Highcharts);

// For highcharts, load moment in global
(window as any).moment = moment;
momentTZ();

@Component({
  selector: 'app-scheduler-feature-gantt',
  templateUrl: './scheduler-feature-gantt.component.html',
  styleUrls: ['./scheduler-feature-gantt.component.scss']
})
export class SchedulerFeatureGanttComponent implements OnInit, OnChanges {
  @Input() scheduler: Scheduler;
  @Input() timezone: string;

  highcharts;
  chartOptions = {};

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    if (this.scheduler._id) {
      this.highcharts = null;
      this.chartOptions = {};
      this.generateChart();
    }
  }

  getAlphaFactorInterval(tPop: number): string {
    if (this.scheduler.alphaFactor) {
      const ev = eval;
      for (const r of this.scheduler.alphaFactorTable.rows) {
        if(r.operator != null && (r.value != null || r.value != undefined)){
          if (ev(`${tPop} ${r.operator} ${r.value}`) === true) {
            return`${r.data[0].toFixed(2)} - ${r.data[r.data.length - 1].toFixed(2)}`;
          }
        }
      }
      return null;
    }
    return null;
  }

  getSchedulerRange(): {min: number, max: number} {
    const range = {min: null, max: null, duration: null};
    for (const t of this.scheduler.tasks) {
      if (!range.min || range.min > t.start) {
        range.min = t.start;
      }
      if (!range.max || range.max < t.end) {
        range.max = t.end;
      }
    }
    return range;
  }

  getDataSeries(): any[] {
    const today = new Date(Date.now());
    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);

    const dataPhases = [];
    let i = 0;
    for (const t of this.scheduler.tasks) {
      dataPhases.push(
        {
          name: t.name,
          id: t._id,
          start: t.start,
          end: t.end,
          color: t.color,
          tPop: t.offshoreDuration,
          alphaFactor: this.getAlphaFactorInterval(t.offshoreDuration),
          y: i++
        }
      );
    }

    return [
      {
        name: this.scheduler._id,
        data: dataPhases.slice()
      },
    ];
  }

  generateChart(): void {
    const schedulerRange = this.getSchedulerRange();
    let titleDuration = '';
    if (schedulerRange.max && schedulerRange.min) {
      titleDuration = `From ${Highcharts.dateFormat('%a %e %b %Y %H:%M %Z', schedulerRange.min)} to ` +
        `${Highcharts.dateFormat('%a %e %b %Y %H:%M %Z', schedulerRange.max)}`;
    }
    this.highcharts = Highcharts;
    this.chartOptions = {
      chart: {
        zoomType: 'x',
        type: 'gantt'
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
        text: titleDuration
      },
      xAxis: [{
        events: {
          setExtremes(event) {
            const duration = event.max - event.min;
            const chart = event.target.chart as Highcharts.Chart;
            // if (duration <= Time.Day) {
            //   chart.xAxis[0].update({
            //     tickInterval: Time.Hour // 1 hour
            //   });
            // } else if (duration > Time.Day && duration <= 1.5 * Time.Day) {
            //   chart.xAxis[0].update({
            //     tickInterval: Time.Hour * 3 // 3 hours
            //   });
            // }  else if (duration > 1.5 * Time.Day && duration <= 3.5 * Time.Day) {
            //   chart.xAxis[0].update({
            //     tickInterval: Time.Hour * 4.5 // 4.5 hours
            //   });
            // } else if (duration > 3.5 * Time.Day && duration <= 5 * Time.Day) {
            //   chart.xAxis[0].update({
            //     tickInterval: Time.Hour * 6 // 6 hours
            //   });
            // } else if (duration > 5 * Time.Day && duration <= 9 * Time.Day) {
            //   chart.xAxis[0].update({
            //     tickInterval: Time.Hour * 9// 9 hours
            //   });
            // } else {
            //   chart.xAxis[0].update({
            //     tickInterval: Time.Day // 12 hours
            //   });
            // }
            if (duration > 8 * Time.Day) {
              chart.xAxis[0].update({visible: false});
            } else {
              chart.xAxis[0].update({visible: true});
            }
          }
        },
        minRange: Time.Hour, // 1 h
        gridLineWidth: 1,
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '%H:%M',
        },
        grid: { // default setting
          enabled: true
        },
        visible: false
        // tickInterval: Time.Day / 2// 12 hour
      }, {
        type: 'datetime',
        currentDateIndicator: {
          label: {
            format: '%a %e %b %Y %H:%M %Z'
          },
          width: 5
        },
        dateTimeLabelFormats: {
          day: '%a %e %b',
        },
        minRange: Time.Hour, // 1 h
        tickInterval: Time.Day // 1 day
      }],
      yAxis: {
        // type: 'category',
        grid: {
          enabled: true,
          borderColor: 'rgba(0,0,0,0.3)',
          borderWidth: 1,
          // columns: [{
          //   labels: {
          //     useHTML: true,
          //     formatter() {
          //       return `<div class="btn-group btn-group-sm m-0" role="group">` +
          //         `<button class="btn btn-outline-info btn-edit" onclick="alert('Edited ${this.point.name}')">` +
          //         `<i class="material-icons md-center md-xs">edit</i></button>` +
          //         `<button class="btn btn-outline-danger btn-delete" onclick="alert('Edited ${this.point.name}')">` +
          //         `<i class="material-icons md-center md-xs">delete</i></button>` +
          //         `</div>`;
          //     },
          //     padding: 0.2
          //   },
          // }, {
          //   title: {
          //     text: 'Task',
          //     style: {
          //       fontWeight: 'bold'
          //     }
          //   },
          //   labels: {
          //     align: 'left',
          //     style: {
          //       fontWeight: 'bold'
          //     },
          //     useHTML: true,
          //     formatter() {
          //       return `<span><i style="color: ${this.point.color}" class="material-icons md-center md-sm">assignment</i> ` +
          //         `${this.point.name}</span>`;
          //     }
          //   },
          //   padding: 0.2
          // }, {
          //   title: {
          //     text: 'From',
          //     style: {
          //       fontWeight: 'bold'
          //     }
          //   },
          //   labels: {
          //     format: '{point.start:%a %e %b %H:%M}',
          //     padding: 0.2
          //   }
          // }, {
          //   title: {
          //     text: 'To',
          //     style: {
          //       fontWeight: 'bold'
          //     }
          //   },
          //   labels: {
          //     format: '{point.end:%a %e %b %H:%M}',
          //     padding: 0.2
          //   }
          // }, {
          //   title: {
          //     text: 'Est. hours',
          //     style: {
          //       fontWeight: 'bold'
          //     }
          //   },
          //   offset: 10,
          //   labels: {
          //     formatter() {
          //       const value = (this.point.x2 - this.point.x) / (60 * 60 * 1000) ;
          //       return `${value.toFixed(2)}`;
          //     },
          //     padding: 0.2
          //   },
          //   style: {
          //     width: '45px'
          //   }
          // }]
        }
      },
      tooltip: {
        headerFormat: '',
        useHTML: true,
        pointFormatter() {
          const point = this;
          const lines = [ {
            title: 'Start',
            value: Highcharts.dateFormat('%a %e %b %Y %H:%M %Z', point.start)
          }, {
            title: 'End',
            value: Highcharts.dateFormat('%a %e %b %Y %H:%M %Z', point.end)
          }, {
            title: 'Est. duration (hours)',
            value: `${((point.end - point.start) / Time.Hour).toFixed(2)}`
          }, {
            title: 'Tpop',
            value: point.tPop
          }];
          if (point.alphaFactor) {
            lines.push({
              title: 'Est. alpha factor',
              value: point.alphaFactor
            });
          }
          let message = '<span style="font-weight: bold; color: ' +  point.color + ';">\u25CF ' + point.name + '</span><table>';
          for (const l of lines) {
            message += '<tr><td style="font-weight: bold">' + l.title + ' : </td><td style="text-align: right">' + l.value + '</td></tr>';
          }
          message += '</table>';
          return message;
        },
      },
      credits: {
        enabled: false
      },
      series: this.getDataSeries().slice(),
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
          }
        }]
      },
      navigator: {
        height: 100,
        outlineColor: '#00a3e0',
        maskFill: 'rgba(0, 163 , 224, 0.05)',
        enabled: true,
        liveRedraw: true,
        series: {
          type: 'gantt',
          pointPlacement: 0.5,
          pointPadding: 0.25
        },
        xAxis: {
          dateTimeLabelFormats: {
            day: '%a %e %b %Y %H:%M'
          },
          currentDateIndicator: {
            label: {
              format: '%a %e %b %Y %H:%M'
            },
            width: 5
          },
        },
        yAxis: {
          min: 0,
          max: this.scheduler.tasks.length + 1,
          reversed: true,
          categories: []
        },
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
        trackBorderColor: '#00a3e0',
        enabled: true
      },
      rangeSelector: {
        enabled: true,
        selected: 4,
        buttonTheme: { // styles for the buttons
          fill: 'none',
          stroke: '#009dd6',
          'stroke-width': 1,
          r: 8,
          width: 45,
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
        inputBoxWidth: 145,
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
                  const now = new Date(Date.now()).getTime();
                  chart.xAxis[0].setExtremes(now, now + Time.Day, false);
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
                  const now = new Date(Date.now()).getTime();
                  chart.xAxis[0].setExtremes(now, now + (Time.Day * 2), false);
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
                  const now = new Date(Date.now()).getTime();
                  chart.xAxis[0].setExtremes(now, now + (Time.Day * 3), false);
                  chart.redraw();
                }
              }
            }
          }
        }, {
          type: 'week',
          count: 1,
          text: '7 days',
          events: {
            click() {
              for (const chart of Highcharts.charts) {
                if (chart !== undefined) {
                  const now = new Date(Date.now()).getTime();
                  chart.xAxis[0].setExtremes(now, now + (Time.Day * 7), false);
                  chart.redraw();
                }
              }
            }
          }
        }, {
          type: 'all',
          text: 'Reset'
        }],
        inputDateFormat: '%a %e %b %Y %H:%M',
        inputEditDateFormat: '%a %e %b %Y %H:%M',
      },
      exporting: {
        sourceWidth: 1800,
        // buttons: {
        //   toggleTableChart: {
        //     text: 'Show / Hide table',
        //     onclick() {
        //       that.showTableGantt = !that.showTableGantt;
        //       (this as Highcharts.Chart).yAxis[0].update({
        //         visible: that.showTableGantt
        //       }, true);
        //     }
        //   }
        // }
      }
    };
  }
}
