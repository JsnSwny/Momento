import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Transformer, Text } from "react-konva";

const TextElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  stageRef,
  setSelectedId,
  setSelectedAction,
  draggable
}) => {
  const dispatch = useDispatch();
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleEditing = () => {
    const node = shapeRef.current;
    const transformer = trRef.current;
    const stage = stageRef.current;

    // hide text node and transformer:
    node.hide();
    // if (transformer) {
    //   transformer.hide();
    // }

    // create textarea over canvas with absolute position
    // first we need to find position for textarea
    // how to find it?

    // at first lets find position of text node relative to the stage:
    var textPosition = node.absolutePosition();

    // so position of textarea will be the sum of positions above:

    var areaPosition = {
      x: stage.container().offsetLeft + textPosition.x,
      y: stage.container().offsetTop + textPosition.y,
    };

    // create textarea and style it
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    textarea.value = node.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = node.width() - node.padding() * 2 + "px";
    textarea.style.height = node.height() - node.padding() * 2 + 5 + "px";
    textarea.style.fontSize = node.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = node.lineHeight();
    textarea.style.fontFamily = node.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = node.align();
    textarea.style.color = node.fill();
    let rotation = node.rotation();
    var transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }

    var px = 0;
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(node.fontSize() / 20);
    }
    transform += "translateY(-" + px + "px)";

    textarea.style.transform = transform;

    // reset height
    textarea.style.height = "auto";
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + "px";

    textarea.focus();

    function removeTextarea() {
      setSelectedId(null);
      textarea.parentNode.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      node.show();
      setSelectedAction("select");
      if (transformer) {
        transformer.forceUpdate();
      }
    }

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = node.placeholder.length * node.fontSize();
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }

      var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + "px";
    }

    textarea.addEventListener("keydown", function (e) {
      // hide on enter
      // but don't hide on shift + enter
      if (e.keyCode === 13 && !e.shiftKey) {
        node.text(textarea.value);
        dispatch({
          type: "UPDATE_ELEMENT",
          id: shapeProps.id,
          payload: { ...shapeProps, text: textarea.value },
        });
        removeTextarea();
      }
      // on esc do not set value back to node
      if (e.keyCode === 27) {
        removeTextarea();
      }
    });

    textarea.addEventListener("keydown", function (e) {
      let scale = node.getAbsoluteScale().x;
      setTextareaWidth(node.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + node.fontSize() + "px";
      dispatch({
        type: "UPDATE_ELEMENT",
        id: shapeProps.id,
        payload: { ...shapeProps, text: textarea.value },
      });
    });

    function handleOutsideClick(e) {
      if (e.target !== textarea) {
        node.text(textarea.value);
        dispatch({
          type: "UPDATE_ELEMENT",
          id: shapeProps.id,
          payload: { ...shapeProps, text: textarea.value },
        });
        removeTextarea();
      }
    }
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  useEffect(() => {
    handleEditing();
  }, []);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable={draggable}
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
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
          });
        }}
        onDblClick={handleEditing}
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
          enabledAnchors={["middle-left", "middle-right"]}
        />
      )}
    </React.Fragment>
  );
};

export default TextElement;
