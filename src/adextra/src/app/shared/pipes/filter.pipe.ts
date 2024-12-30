import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list, value: any, vesselsList): any {

    if (value.length > 2) {
      const res1 = list.map((e1) => e1.vessel_id);
      const res2 = vesselsList.filter((e2) => {
        return res1.find((e3) => e3 === e2._id);
      });

      const res3 = res2.filter((elt) => {
        return elt.name.trim().toLowerCase().includes(value.trim().toLowerCase())
      })

      const res4 = list.filter((e4) => {
        return res3.find((e5) => e5._id === e4.vessel_id);
      });

      return res4;
    }
    return list;
  }

}
