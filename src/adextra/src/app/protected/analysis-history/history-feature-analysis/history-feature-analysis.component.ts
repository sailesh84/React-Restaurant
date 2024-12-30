import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Analysis } from '@app/shared/models/analysis';
import * as Highcharts from 'highcharts';
import HC_boost from 'highcharts/modules/boost';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_pattern_fill from 'highcharts/modules/pattern-fill';
import { Time } from '@app/shared/enums/time.enums';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
HC_boost(Highcharts);
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);
HC_no_data_to_display(Highcharts);
HC_accessibility(Highcharts);
HC_pattern_fill(Highcharts);

// For highcharts, load moment in global
(window as any).moment = moment;
momentTZ();

@Component({
  selector: 'app-history-feature-analysis',
  templateUrl: './history-feature-analysis.component.html',
  styleUrls: ['./history-feature-analysis.component.scss']
})
export class HistoryFeatureAnalysisComponent implements OnInit, OnChanges {
  @Input() analysis: Analysis;
  @Input() timezone: string;

  highcharts = Highcharts;
  optionsGeneratedCharts: any[] = [];
  updateFlag = true;
  oneToOneFlag = true;
  isDisplayWo: boolean = false;
  wOptionList: any[] = [];
  selectedWoptionList: number = 0;

  constructor() { }

  ngOnInit() {
    this.wOptionList = [
      { name: "Swell Sea", value: 0 },
      { name: "Wind Sea", value: 1 }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.optionsGeneratedCharts = [];
    if (this.analysis) {
      this.generateChart(this.selectedWoptionList);
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

  private generateChart(data = 0) {
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
          text: this.getAnalysisTitle(this.analysis.data.cols[i].title, this.analysis.data.cols[i].weathervaning, data)
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
          gridLineWidth: 2,
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
            value: 1,
            color: '#FF0000',
            dashStyle: 'shortdash',
            width: 5,
            label: {
              text: 'Limit'
            }
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
      for (let j = 1; j < this.analysis.data.cols[i].subcols.length - 2; j++) {

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

      for (let j = count; j < this.analysis.data.cols[i].subcols.length - 2; j++) {
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

    if ((resAnalysis.length - 1) === j) {
      this.isDisplayWo = true;
    } else {
      this.isDisplayWo = false;
    }
  }

  private getPlotBands(data) {
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

  getAnalysisTitle(title: string, weathervaning: boolean, data: number) {
    if (weathervaning === true) {
      if (data === 0) {
        return title + "- Swell Sea";
      } else {
        return title + "- Wind Sea";
      }
    } else {
      return title;
    }
  }

  onWoptionListChange(event, option) {
    this.selectedWoptionList = event.value;
    this.refresh(this.selectedWoptionList);
  }

  refresh(data = 0): void {
    this.optionsGeneratedCharts = [];
    this.generateChart(data);
  }

  trackByFn(index: number, item: any): any {
    return index; // or item._id;
  }
}
