import React from "react";
import store from "../../../store/store";

const CanvasCurrentlyViewing = () => {
    return (
      <layer key={store.getState().canvas.reloadViewingList}>
        <ul className="currently-viewing"> 
            {store.getState().canvas.currentlyViewingList.map((viewer) => (
                    <li
                        
                    onClick={() => window.location.href = `/user/${viewer?.username}`}
                    key={viewer.userId}
                    >
                        {viewer?.username?.slice(0, 5)}
                    </li>
                )
            )}
        </ul>
    </layer>
  );
};

export default CanvasCurrentlyViewing;
