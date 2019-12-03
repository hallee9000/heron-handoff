import React from 'react';

const MIN_SCALE = 0.75;
const MAX_SCALE = 2;
const SETTLE_RANGE = 0.001;
const ADDITIONAL_LIMIT = 0.2;
const DOUBLE_TAP_THRESHOLD = 300;
const ANIMATION_SPEED = 0.04;
const RESET_ANIMATION_SPEED = 0.08;
const INITIAL_X = 0;
const INITIAL_Y = 0;
const INITIAL_SCALE = 1;
const SCALE_INCREMENT = 0.075;

const settle = (val, target, range) => {
  const lowerRange = val > target - range && val < target;
  const upperRange = val < target + range && val > target;
  return lowerRange || upperRange ? target : val;
};

const inverse = (x) => x * -1;

const getPointFromEvt = (evt, element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

const getMidpoint = (pointA, pointB) => ({
  x: (pointA.x + pointB.x) / 2,
  y: (pointA.y + pointB.y) / 2,
});

const getDistanceBetweenPoints = (pointA, pointB) => (
  Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2))
);

const between = (min, max, value) => Math.min(max, Math.max(min, value));

class PinchZoomPan extends React.Component {
  constructor() {
    super(...arguments);
    this.initialState = this.getInititalState();
    this.state = this.initialState;

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleTapStart = this.handleTapStart.bind(this);
    this.handlePanMove = this.handlePanMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  zoomTo(scale, midpoint) {
    const frame = () => {
      if (this.state.scale === scale) return null;

      const distance = scale - this.state.scale;
      const targetScale = this.state.scale + (ANIMATION_SPEED * distance);

      this.zoom(settle(targetScale, scale, SETTLE_RANGE), midpoint);
      this.animation = requestAnimationFrame(frame);
    };

    this.animation = requestAnimationFrame(frame);
  }

  reset() {
    const frame = () => {
      if (this.state.scale === INITIAL_SCALE && this.state.x === INITIAL_X && this.state.y === INITIAL_Y) return null;
      const distance = INITIAL_SCALE - this.state.scale;
      const distanceX = INITIAL_X - this.state.x;
      const distanceY = INITIAL_Y - this.state.y;

      const targetScale = settle(this.state.scale + (RESET_ANIMATION_SPEED * distance), INITIAL_SCALE, SETTLE_RANGE);
      const targetX = settle(this.state.x + (RESET_ANIMATION_SPEED * distanceX), INITIAL_X, SETTLE_RANGE);
      const targetY = settle(this.state.y + (RESET_ANIMATION_SPEED * distanceY), INITIAL_Y, SETTLE_RANGE);

      const nextWidth = this.props.width * targetScale;
      const nextHeight = this.props.height * targetScale;

      this.setState({
        x: targetX,
        y: targetY,
        scale: targetScale,
        width: nextWidth,
        height: nextHeight,
      }, () => {
        this.animation = requestAnimationFrame(frame);
      });
    };

    this.animation = requestAnimationFrame(frame);
  }

  getInititalState() {
    return {
      x: INITIAL_X,
      y: INITIAL_Y,
      scale: INITIAL_SCALE,
      width: this.props.width,
      height: this.props.height,
    };
  }

  handleTouchStart(event) {
    this.animation && cancelAnimationFrame(this.animation);
    if (event.touches.length == 2) this.handlePinchStart(event);
    if (event.touches.length == 1) this.handleTapStart(event);
  }

  handleTouchMove(event) {
    if (event.touches.length == 2) this.handlePinchMove(event);
    if (event.touches.length == 1) this.handlePanMove(event);
  }

  handleTouchEnd(event) {
    if (event.touches.length > 0) return null;

    if (this.state.scale > MAX_SCALE) return this.zoomTo(MAX_SCALE, this.lastMidpoint);
    if (this.state.scale < MIN_SCALE) return this.zoomTo(MIN_SCALE, this.lastMidpoint);

    if (this.lastTouchEnd && this.lastTouchEnd + DOUBLE_TAP_THRESHOLD > event.timeStamp) {
      this.reset();
    }

    this.lastTouchEnd = event.timeStamp;
  }

  handleTapStart(event) {
    const tapPoint = event.touches && event.touches.length ? event.touches[0] : event;
    this.lastPanPoint = getPointFromEvt( tapPoint, this.container);

    if ( !event.touches ) {
      //onMouseMove={this.handlePanMove}
      //onMouseUp={this.handleTapEnd}
      window.document.documentElement.addEventListener( 'mousemove', this.handlePanMove );
      window.document.documentElement.addEventListener( 'mouseup', this.handleMouseUp );

    }
    this.isPanning = true;
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    const tapPoint = event;
    this.lastPanPoint = getPointFromEvt( tapPoint, this.container);

    window.document.documentElement.addEventListener( 'mousemove', this.handlePanMove );
    window.document.documentElement.addEventListener( 'mouseup', this.handleMouseUp );

    this.setState({
      isPanning: true
    });
  }

  handleMouseUp( event ) {
    this.setState({
      isPanning: false
    });
    window.document.documentElement.removeEventListener('mousemove', this.handlePanMove );
    window.document.documentElement.removeEventListener('mouseup', this.handleMouseUp );
  }

  handlePanMove(event) {
    if ( this.state.scale <= 1 || !this.state.isPanning ) {
      return null;
    }

    event.preventDefault();

    const tapPoint = event.touches && event.touches.length ? event.touches[0] : event;

    const point = getPointFromEvt(tapPoint, this.container);
    const nextX = this.state.x + point.x - this.lastPanPoint.x;
    const nextY = this.state.y + point.y - this.lastPanPoint.y;

    this.setState({
      x: between((this.props.width - this.state.width)/2, (this.state.width - this.props.width)/2 , nextX),
      y: between((this.props.height - this.state.height)/2, (this.state.height - this.props.height)/2, nextY),
    });

    this.lastPanPoint = point;
  }

  handlePinchStart(event) {
    const pointA = getPointFromEvt(event.touches[0], this.container);
    const pointB = getPointFromEvt(event.touches[1], this.container);
    this.lastDistance = getDistanceBetweenPoints(pointA, pointB);
  }

  handlePinchMove(event) {
    event.preventDefault();
    const pointA = getPointFromEvt(event.touches[0], this.container);
    const pointB = getPointFromEvt(event.touches[1], this.container);
    const distance = getDistanceBetweenPoints(pointA, pointB);
    const midpoint = getMidpoint(pointA, pointB);
    const scale = between(MIN_SCALE - ADDITIONAL_LIMIT, MAX_SCALE + ADDITIONAL_LIMIT, this.state.scale * (distance / this.lastDistance));

    this.zoom(scale, midpoint);

    this.lastMidpoint = midpoint;
    this.lastDistance = distance;
  }

  handleWheel( event ) {

    const rect = this.container.getBoundingClientRect();
    const scale = between(MIN_SCALE - ADDITIONAL_LIMIT, MAX_SCALE + ADDITIONAL_LIMIT, this.state.scale + (( event.deltaY > 0 ? 1 : -1 ) * SCALE_INCREMENT ));
    const pointA = getPointFromEvt( event.nativeEvent, this.container );
    const pointB = {x: pointA.x, y: pointA.y };



    const midpoint = getMidpoint( pointA, pointB);

    console.log( "WHEEL EVENT", midpoint );

    this.zoom( scale, midpoint );
    this.lastMidpoint = midpoint;

  }

  zoom(scale, midpoint) {
    console.log( 'TEST', this.props, this.initialState );
    let nextState;
    if ( this.props.width != this.initialState.width || this.props.height != this.initialState.height ) {
      this.initialState = this.getInititalState();
      this.initialState.scale = this.state.scale;
      this.initialState.x = this.state.x || this.initialState.x;
      this.initialState.y = this.state.y || this.initialState.y;
      // console.log( 'SET STATE', this.initialState );
      // this.setState( this.initialState );
      nextState = this.initialState;
    } else {
      nextState = this.state;
    }


    const nextWidth = this.props.width * scale;
    const nextHeight = this.props.height * scale;
    const tempX = nextState.x + (inverse(midpoint.x * scale) * ((nextWidth - nextState.width) / nextWidth));
    const tempY = nextState.y + (inverse(midpoint.y * scale) * ((nextHeight - nextState.height) / nextHeight));

    const nextX = between((this.props.width - nextWidth)/2, (nextWidth - this.props.width)/2 , tempX);
    const nextY = between((this.props.height - nextHeight)/2, (nextHeight - this.props.height)/2, tempY);

    console.log( nextState.x + ' + (' + inverse( midpoint.x * scale ) + ' *  ' + ( nextWidth - nextState.width ) +' / ' + nextWidth + ')', nextState.x + (inverse(midpoint.x * scale) * ((nextWidth - nextState.width) / nextWidth)) );

    this.setState({
      width: nextWidth,
      height: nextHeight,
      x: nextX,
      y: nextY,
      scale,
      midpoint
    });
  }

  render() {
    console.log( "IS PANNING", this.state.isPanning )
    const className = this.state.isPanning ? 'panning' : '';

    return (
      <div
        ref={(ref) => this.container = ref}
        className={className}
        // TOUCH EVENTS
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}

        // MOUSE EVENTS
        onMouseDown={this.handleMouseDown}

        onWheel={this.handleWheel}

        style={{
          overflow: 'hidden',
          width: this.props.width,
          height: this.props.height,
        }}
        >
          {this.props.children(this.state.x, this.state.y, this.state.scale)}
        </div>
    );
  }
}

export default PinchZoomPan;
