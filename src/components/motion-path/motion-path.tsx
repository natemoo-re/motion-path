import { Component, Prop, Element, Watch, State, Method, Event, EventEmitter } from '@stencil/core';
import shifty from 'shifty';
import { Path } from '../path';
import { optionParser, AnimationOptions } from '../option-parser';

@Component({
  tag: 'motion-path',
  styleUrl: 'motion-path.scss',
  shadow: true
})
export class MyComponent {
  @Element() host: any;
  target: any;

  @Prop() animation: string;
  _animation: shifty.Tweenable;

  @Prop() d: string;
  _pathElement: any;
  path: Path;
  options: AnimationOptions;

  @State() iterations: number = 0;

  @Event() animationStart: EventEmitter;
  @Event() animationEnd: EventEmitter;

  componentDidLoad() {
    this.target = this.host.shadowRoot.querySelector('#target');

    this.createPathElement();
    this.options = optionParser.parse(this.animation);
    console.log(this.options);
    console.log();
    this.animationRun();
  }

  createPathElement() {
    this._pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this._pathElement.setAttribute('d', this.d);
    this.path = new Path(this._pathElement);
  }

  doAlternate() {
    let { startValue, endValue } = this.options;
    this.options.startValue = endValue;
    this.options.endValue = startValue;
  }

  animationRun() {
    if (this.options.alternate && this.iterations) {
      this.doAlternate();
    }
    this.translateTargetStart();
    this.createAnimation();
    if (this.options.playState === 'running') {
      this.play();
    }
  }

  createAnimation() {
    this._animation = new shifty.Tweenable();
    let { duration, easing, delay, startValue, endValue } = this.options
    this._animation.setConfig({
      from: { value: startValue },
      to: { value: endValue },
      duration,
      easing,
      delay,
      start: (state) => this.onAnimationStart(state),
      step: (state) => window.requestAnimationFrame(() => this.translateTarget(state))
    })
  }

  play() {
    this._animation.tween().then(() => this.onAnimationEnd());
  }

  pause() {
    this._animation.pause();
  }
  stop() {
    this._animation.stop(true);
  }

  onAnimationStart({ value }) { }

  onAnimationEnd() {
    this.iterations++;

    if (this.options.iteration === 'infinite') {
      this.animationRun();
    } else if (this.iterations < this.options.iteration) {
      this.animationRun();
    } else if (this.iterations === this.options.iteration) {

    }
  }

  translateTargetStart() {
    this.translateTarget({ value: this.options.startValue });
  }
  translateTargetEnd() {
    this.translateTarget({ value: this.options.endValue });
  }

  translateTarget({ value }) {
    let coords = this.path.pointAtFraction(value);
    this.target.style.setProperty('transform', `translate3D(${coords.x}px, ${coords.y}px, 0)`);
  }

  render() {
    return (
      <div id="target">
        <slot/>
      </div>
    );
  }
}
