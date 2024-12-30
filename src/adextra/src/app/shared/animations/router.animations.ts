import {animate, state, style, transition, trigger} from '@angular/animations';

/**
 * Function for adding a transition on the router.
 */
export function routerTransition() {
    return noTransition();
}

/**
 * Function for disabled a transition on the router.
 */
export function noTransition() {
    return trigger('routerTransition', []);
}

/**
 * Transition slide to right.
 */
export function slideToRight() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
    ])
  ]);
}

/**
 * Transition slide to left.
 */
export function slideToLeft() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateX(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
    ])
  ]);
}

/**
 * Transition slide to tp.
 */
export function slideToTop() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
    ])
  ]);
}

/**
 * Transition slide to bottom.
 */
export function slideToBottom() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0%)' }),
      animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
    ])
  ]);
}
