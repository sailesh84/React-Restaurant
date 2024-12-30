import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination'
})
export class PaginationPipe implements PipeTransform {

  transform(value: any, page: number, size: number): any {
    return  value.slice(
      (page - 1) * size,
      (page - 1) * size + size
    );
  }

}
