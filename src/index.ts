import { fromEvent, BehaviorSubject, interval, combineLatest } from "rxjs";
import { filter, withLatestFrom } from "rxjs/operators";

console.log("App has started!");

const changingAmount = 5;

const seconds: HTMLElement = document.querySelector("#seconds");
const pauseBtn: HTMLElement = document.querySelector("button#pause");
const startBtn: HTMLElement = document.querySelector("button#start");
const resetBtn: HTMLElement = document.querySelector("button#reset");
const incrementBtn: HTMLElement = document.querySelector("button#increment");
const decrementBtn: HTMLElement = document.querySelector("button#decrement");

const secondsCount = new BehaviorSubject<number>(0);
const isPaused$ = new BehaviorSubject<boolean>(false);
const isStarted$ = new BehaviorSubject<boolean>(false);

const timer$ = interval(1000);
const startEvent = fromEvent(startBtn, "click");
const pauseEvent = fromEvent(pauseBtn, "click");
const incrementEvent = fromEvent(incrementBtn, "click");
const decrementEvent = fromEvent(decrementBtn, "click");

combineLatest([timer$, startEvent])
  .pipe(
    withLatestFrom(isPaused$),
    filter((isStarted) => isStarted[1] === false)
  )
  .subscribe(() => {
    if (isStarted$.value) {
      secondsCount.next(secondsCount.value + 1);
      console.log(secondsCount.value);
      renderSecondsOnPage(secondsCount.value);
    }
  });

startEvent.subscribe(() => {
  isStarted$.next(true);
  console.log(isStarted$);
});

pauseEvent.subscribe(() => {
  isStarted$.next(false);
  console.log(isStarted$);
});

incrementEvent.subscribe(() => {
  console.log("incrementBtn");
  secondsCount.next(secondsCount.value + changingAmount);
  renderSecondsOnPage(secondsCount.value);
});

decrementEvent.subscribe(() => {
  console.log("decrementBtn");
  if (secondsCount.value < changingAmount) {
    secondsCount.next(0);
  } else {
    secondsCount.next(secondsCount.value - changingAmount);
  }
  renderSecondsOnPage(secondsCount.value);
});

fromEvent(resetBtn, "click").subscribe(() => {
  console.log("resetBtn");
  seconds.innerText = String(`00`);
  isStarted$.next(false);
  secondsCount.next(0);
});

function renderSecondsOnPage(value: number) {
  if (value < 10) {
    seconds.innerText = String(`0${value}`);
  } else {
    seconds.innerText = String(`${value}`);
  }
}
