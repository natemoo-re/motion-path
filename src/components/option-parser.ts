import shifty from 'shifty';

export interface AnimationOptions {
    startValue: 0|1;
    endValue: 0|1;
    duration: number;
    easing: string;
    delay: number;
    playState: string;
    iteration: string | number;
    alternate: boolean;
}

class OptionParser {

    private isTime(str: string): boolean {
        return /^([.\d]+(ms|s))|0$/.test(str);
    }
    private getTimeInMS(str: string) {
        let value = Number.parseFloat(str);
        if (str.endsWith('ms')) {
            value = value;
        } else if (str.endsWith('s')) {
            value = value * 1000;
        } else {
            value = 0;
        }
        return value;
    }

    private isIterationCount(str: string): boolean {
        return str === 'infinite' || !Number.isNaN(Number.parseFloat(str));
    }
    private getIterationCount(str: string): number|string {
        if (str === 'infinite') {
            return str;
        } else {
            return Number.parseFloat(str);
        }
    }

    private isPlayState(str: string): boolean {
        const keywords = ['running', 'paused'];
        return keywords.includes(str);
    }

    private isDirection(str: string): boolean {
        const keywords = ['normal', 'reverse', 'alternate', 'alternate-reverse'];
        return keywords.includes(str);
    }

    private timingKeywords = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'];
    private isTimingKeyword(str: string): boolean {
        return this.timingKeywords.includes(str);
    }
    private timingFunctions = [/^cubic-bezier\(.+\)/, /^steps\(.+\)/, /^frames\(.+\)/];
    private isTimingFunction(str: string): boolean {
        return this.timingFunctions.map(fn => fn.test(str)).find(res => res === true) || false;
    }
    private getCubicBezierArgs(str: string): number[] {
      return str.match(/\((.*)\)/)[1].split(',').map(str => Number.parseFloat(str.trim()));
    }
    private getTimingFunctionInShifty(str: string) {
        if (this.isTimingKeyword(str)) {
            switch(str) {
                case 'ease': return 'easeInOutCubic';
                case 'ease-in': return 'easeInCubic';
                case 'ease-out': return 'easeOutCubic';
                case 'ease-in-out': return 'easeInOutCubic';
                default: return 'linear';
            }
        } else if (this.isTimingFunction(str)) {
            switch(true) {
              case str.startsWith('cubic-bezier'):
                let [x1, y1, x2, y2] = this.getCubicBezierArgs(str);
                return shifty.setBezierFunction(`cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`, x1, y1, x2, y2);
                default:
                    break;
            }
        }
    }

    public parse(animation: string): AnimationOptions {
        const map = animation.match(/([\w-]+\(.*\)|[\w-]+)/g);
        let options = {
            'duration': '0s',
            'timing-function': 'ease',
            'delay': '0s',
            'iteration-count': '1',
            'direction': 'normal',
            'fill-mode': 'none',
            'play-state': 'running'
        };
        let matchedTime = 0;
        map.forEach(item => {
          let key;
          switch (true) {
              case this.isTime(item):
                  if (matchedTime === 0) { key = 'duration'; }
                  else if (matchedTime === 1) { key = 'delay'; }
                  matchedTime++;
                  break;
            case (this.isTimingKeyword(item) || this.isTimingFunction(item)):
                  key = 'timing-function';
                  break;
              case this.isIterationCount(item) && !this.isTime(item):
                  key = 'iteration-count';
                  break;
              case this.isDirection(item):
                  key = 'direction';
                  break;
              case this.isPlayState(item):
                  key = 'play-state';
                  break;
              default: break;
          }
          if (key) {
            options[key] = item;
          }
            // if (this.isTime(item)) {

            // } else if (this.isTimingKeyword(item) || this.isTimingFunction(item)) {
            //     options['timing-function'] = item;
            // } else if (this.isIterationCount(item)) {
            //     options['iteration-count'] = item;
            // } else if (this.isDirection(item)) {
            //     options['direction'] = item;
            // } else if (this.)
        })
        console.log(options);
        return {
            startValue: (/reverse/g.test(options.direction)) ? 1 : 0,
            endValue: (/reverse/g.test(options.direction)) ? 0 : 1,
            duration: this.getTimeInMS(options.duration),
            easing: this.getTimingFunctionInShifty(options['timing-function']),
            delay: this.getTimeInMS(options.delay),
            playState: options['play-state'],
            iteration: this.getIterationCount(options['iteration-count']),
            alternate: /alternate/g.test(options.direction)
        }
    }

}

export const optionParser = new OptionParser();
