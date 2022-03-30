import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Image, Transformer } from "react-konva";

const ImageElement = ({
    shapeProps,
    isSelected,
    onSelect,
    onChange,
}) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected) {
          // we need to attach transformer manually
          trRef.current.nodes([shapeRef.current]);
          trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Image
                image={shapeProps.imgObj}
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransform={(e) => {
                    const node = shapeRef.current;
                    onChange({
                        ...shapeProps,
                        width: Math.max(node.width() * node.scaleX(), 20),
                        height: Math.max(node.height() * node.scaleY(), 20),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY),
                    });
                }}
            />
            {isSelected && (
              <Transformer
                ref={trRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
                ignoreStroke={true}
                padding={5}
                enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              />
            )}            
        </React.Fragment>
    )

};

export default ImageElement;