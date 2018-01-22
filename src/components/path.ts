export class Path {
  el: SVGPathElement;

  constructor(path: SVGPathElement) {
    this.el = path;
  }

  get length(): number {
    if (this.el) {
      return this.el.getTotalLength();
    } else {
      return 0;
    }
  };

  get start() {
    return this.pointAtFraction(0);
  }
  get end() {
    return this.pointAtFraction(1);
  }

  pointAtFraction(fraction: number): { x: number, y: number } {
    const { x, y } = this.el.getPointAtLength(this.length * fraction);
    return { x, y };
  }

  // valueUpdater(axis, target, offset) {
  //   switch (axis) {
  //     case "horizontal":
  //       offset -= this.start.x;
  //       return (key, value) =>
  //         target[key] = offset + this.pointAt(value).x;
  //     case "vertical":
  //       offset -= this.start.y;
  //       return (key, value) =>
  //         target[key] = offset + this.pointAt(value).y;
  //     case "angle":
  //       return (key, value, delta = 0) => {
  //         if (delta === 0) { return; }
  //         fromPoint = this.pointAt(Math.max(value - delta, 0));
  //         toPoint = this.pointAt(Math.min(value + delta, 1));
  //         angle = Math.atan2(fromPoint.y - toPoint.y, fromPoint.x - toPoint.x) * 180 / Math.PI - 90;
  //         target[key] = angle;
  //       }
  //   }
  // }
}
