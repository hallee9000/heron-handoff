import React, { useState } from 'react'
import { Stage, Layer, Rect, Image, Text, Transformer } from 'react-konva'
import { ShapeConfig } from 'konva/lib/Shape'
import useImage from 'use-image'
import file from './mock/file.json'
import { decompose2DMatrix } from './utils/math'

import type { KonvaEventObject } from 'konva/lib/Node'

const frames = file.document.children[1].children

interface Point {
  x: number
  y: number
}

interface StageInterface {
  x: number
  y: number
  scale: number
}

const list: any[] = []
// frame
function walkInFrame (frames: any[]) {
  frames.map(frame => {
    const { color } = frame.fills[0]
    const rgb = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`
    const { width, height } = frame.absoluteBoundingBox
    list.push({ ...decompose2DMatrix(frame.absoluteTransform), width, height, fill: rgb })
    if (frame.children) {
      walkInFrame(frame.children)
    }
  })
}
walkInFrame(frames)

// the first very simple and recommended way:
const FrameImage = (props: ShapeConfig) => {
  const [image] = useImage('https://guangzhou-1255718578.cos.ap-guangzhou.myqcloud.com/New%20version.png');
  return <Image image={image} {...props}/>;
};

// see https://www.steveruiz.me/posts/zoom-ui
const HeronCanvas = ({ text='文字内容' }: { text?: string }) => {
  const [index, setIndex] = useState<number | undefined>()
  const [stage, setStage] = useState({
    x: 0,
    y: 0,
    scale: 1
  })

  function panStage (stage: StageInterface, dx: number, dy: number): void {
    setStage({
      x: stage.x - dx,
      y: stage.y - dy,
      scale: stage.scale
    })
  }

  function zoomStage(stage: StageInterface, client: Point, diffScale: number): void {
    const scale = (1 - diffScale) * stage.scale
    setStage({
      x: stage.x - (client.x - stage.x) * (-diffScale),
      y: stage.y - (client.y - stage.y) * (-diffScale),
      scale
    })
  }

  function handlePanAndZoom (e: KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault()
    if (e.evt.ctrlKey) {
      // Zoom event
      const { clientX: x, clientY: y, deltaY } = e.evt
      zoomStage(stage, { x, y }, deltaY / 100)
    } else {
      // Pan event
      const { deltaX, deltaY } = e.evt
      panStage(stage, deltaX, deltaY)
    }
  }

  function handleSelect (index: number) {
    setIndex(index)
  }

  console.log(list)
  return (
    <Stage
      x={stage.x}
      y={stage.y}
      scale={{ x: stage.scale, y: stage.scale }}
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handlePanAndZoom}
    >
      <Layer>
        <Text text={text} />
        {
          list.map((f, i) => {
            console.log(f.rotation)
            return (
              <Rect
                key={i}
                x={f.translation[0]}
                y={f.translation[1]}
                width={f.width}
                height={f.height}
                rotation={f.rotation}
                scale={f.scale}
                fill={f.fill}
                strokeScaleEnabled={false}
                stroke={index===i ? '#0035FF' : 'transparent'}
                strokeWidth={1}
                onClick={() => handleSelect(i)}
              />
            )
          })
        }
        <Transformer/>
        <FrameImage
          x={520}
          y={20}
          width={1440}
          height={10918/2}
          strokeScaleEnabled={false}
          stroke={index===3 ? '#0035FF' : 'transparent'}
          strokeWidth={1}
          onClick={() => handleSelect(3)}
        />
      </Layer>
    </Stage>
  )
}

export default HeronCanvas
