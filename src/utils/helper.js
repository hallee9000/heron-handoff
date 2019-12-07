export const generateRects = (nodes, docRect) => {
  const rects = []
  const step = (nodes) => {
    nodes.map(node => {
      const nbb = node.absoluteBoundingBox
      if (node.visible===false) {
        return
      } else {
        const top = (nbb.y - docRect.y)/docRect.height
        const left = (nbb.x - docRect.x)/docRect.width
        const width = nbb.width/docRect.width
        const height = nbb.height/docRect.height
        rects.push({
          box: {
            top: `${top*100}%`,
            left: `${left*100}%`,
            width: `${width*100}%`,
            height: `${height*100}%`
          },
          ruler: {
            top: `calc(${(top+height)*100}% - 1px)`,
            left: `calc(${(left+width)*100}% - 1px)`
          },
          actualWidth: Math.floor(nbb.width)===nbb.width ? nbb.width : nbb.width.toFixed(2),
          actualHeight: Math.floor(nbb.height)===nbb.height ? nbb.height : nbb.height.toFixed(2),
          title: node.name,
          clazz: [
            node.type==='COMPONENT' || node.type==='INSTANCE' ? 'component' : ''
          ]
        })
        if (node.children) {
          step(node.children)
        }
      }
    })
  }
  step(nodes)
  return rects
}

export const calculateDistance = () => {
  if( ( this.selectedIndex && this.targetIndex && this.selectedIndex != this.targetIndex ) || ( this.selectedIndex && this.tempTargetRect ) ){
      var selectedRect = this.getRect(this.selectedIndex),
          targetRect = this.tempTargetRect || this.getRect(this.targetIndex),
          topData, rightData, bottomData, leftData,
          x = this.zoomSize(selectedRect.x + selectedRect.width / 2),
          y = this.zoomSize(selectedRect.y + selectedRect.height / 2);
      if(!this.isIntersect(selectedRect, targetRect)){
          if(selectedRect.y > targetRect.maxY){ //top
              topData = {
                  x: x,
                  y: this.zoomSize(targetRect.maxY),
                  h: this.zoomSize(selectedRect.y - targetRect.maxY),
                  distance: this.unitSize(selectedRect.y - targetRect.maxY),
                  percentageDistance: this.percentageSize((selectedRect.y - targetRect.maxY), this.current.height)
              };
          }
          if(selectedRect.maxX < targetRect.x){ //right
              rightData = {
                  x: this.zoomSize(selectedRect.maxX),
                  y: y,
                  w: this.zoomSize(targetRect.x - selectedRect.maxX),
                  distance: this.unitSize(targetRect.x - selectedRect.maxX),
                  percentageDistance: this.percentageSize((targetRect.x - selectedRect.maxX), this.current.width)
              }
          }
          if(selectedRect.maxY < targetRect.y){ //bottom
              bottomData = {
                  x: x,
                  y: this.zoomSize(selectedRect.maxY),
                  h: this.zoomSize(targetRect.y - selectedRect.maxY),
                  distance: this.unitSize(targetRect.y - selectedRect.maxY),
                  percentageDistance: this.percentageSize((targetRect.y - selectedRect.maxY), this.current.height)
              }
          }
          if(selectedRect.x > targetRect.maxX){ //left
              leftData = {
                  x: this.zoomSize(targetRect.maxX),
                  y: y,
                  w: this.zoomSize(selectedRect.x - targetRect.maxX),
                  distance: this.unitSize(selectedRect.x - targetRect.maxX),
                  percentageDistance: this.percentageSize((selectedRect.x - targetRect.maxX), this.current.width)
              }
          }
      }
      else{
          var distance = this.getDistance(selectedRect, targetRect);
          if (distance.top != 0) { //top
              topData = {
                  x: x,
                  y: (distance.top > 0)? this.zoomSize(targetRect.y): this.zoomSize(selectedRect.y),
                  h: this.zoomSize(this.positive(distance.top)),
                  distance: this.unitSize(this.positive(distance.top)),
                  percentageDistance: this.percentageSize(this.positive(distance.top), this.current.height)
              };
          }
          if (distance.right != 0) { //right
              rightData = {
                  x: (distance.right > 0)? this.zoomSize(selectedRect.maxX): this.zoomSize(targetRect.maxX),
                  y: y,
                  w: this.zoomSize(this.positive(distance.right)),
                  distance: this.unitSize(this.positive(distance.right)),
                  percentageDistance: this.percentageSize(this.positive(distance.right), this.current.width)
              };
          }
          if (distance.bottom != 0) { //bottom
              bottomData = {
                  x: x,
                  y: (distance.bottom > 0)? this.zoomSize(selectedRect.maxY): this.zoomSize(targetRect.maxY),
                  h: this.zoomSize(this.positive(distance.bottom)),
                  distance: this.unitSize(this.positive(distance.bottom)),
                  percentageDistance: this.percentageSize(this.positive(distance.bottom), this.current.height)
              };
          }
          if (distance.left != 0) { //left
              leftData = {
                  x: (distance.left > 0)? this.zoomSize(targetRect.x): this.zoomSize(selectedRect.x),
                  y: y,
                  w: this.zoomSize(this.positive(distance.left)),
                  distance: this.unitSize(this.positive(distance.left)),
                  percentageDistance: this.percentageSize(this.positive(distance.left), this.current.width)
              };
          }
      }
      // if (topData) {
      //     $('#td')
      //         .css({
      //             left: topData.x,
      //             top: topData.y,
      //             height: topData.h,
      //         })
      //         .show();
      //     $('#td div')
      //         .attr('data-height', topData.distance)
      //         .attr('percentage-height', topData.percentageDistance);
      // }
      // if (rightData) {
      //      $('#rd')
      //         .css({
      //             left: rightData.x,
      //             top: rightData.y,
      //             width: rightData.w
      //         })
      //         .show();
      //     $('#rd div')
      //         .attr('data-width', rightData.distance )
      //         .attr('percentage-width', rightData.percentageDistance);
      // }
      // if (bottomData) {
      //     $('#bd')
      //         .css({
      //             left: bottomData.x,
      //             top: bottomData.y,
      //             height: bottomData.h,
      //         })
      //         .show();
      //     $('#bd div')
      //         .attr('data-height', bottomData.distance )
      //         .attr('percentage-height', bottomData.percentageDistance);
      // }
      // if (leftData) {
      //      $('#ld')
      //         .css({
      //             left: leftData.x,
      //             top: leftData.y,
      //             width: leftData.w
      //         })
      //         .show();
      //     $('#ld div')
      //         .attr('data-width', leftData.distance )
      //         .attr('percentage-width', leftData.percentageDistance);
      // }
      // $('.selected').addClass('hidden');
  }
}
