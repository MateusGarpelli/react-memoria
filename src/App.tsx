import { useEffect, useState } from "react";
import * as C from "./App.styles";

import logoImage from "./assets/devmemory_logo.png";
import RestartIcon from "./svgs/restart.svg";

import { Button } from "./components/Button";
import { InfoItem } from "./components/infoItem";
import { GridItem } from "./components/GridItem";

import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items"
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";


const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, SetTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, SetShowCount] = useState<number>(0);
  const [gridItems, SetGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        SetTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer)
  }, [playing, timeElapsed])

  // verify if the opened are equal
  useEffect(() => {
    if (showCount === 2) {
      let opened = gridItems.filter(item => item.show === true);
      if (opened.length === 2) {

        // v1 - if both are equal, make every shown permanent
        if (opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].show) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].show = false
            }
          }
          SetGridItems(tmpGrid);
          SetShowCount(0);
        } else {
          //v2 - if they are NOT equal, close all "show"
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].show = false
            }
            SetGridItems(tmpGrid);
            SetShowCount(0);
          }, 1000)
        }

      }
    }
  }, [showCount, gridItems]);

  // verify if game is over
  useEffect(() => {
    if (moveCount > 0 && gridItems.every(item => item.permanentShow === true)) {
      setPlaying(false)
    }
  }, [moveCount, gridItems]);

  const resetAndCreateGrid = () => {

    SetTimeElapsed(0);
    setMoveCount(0);
    SetShowCount(0);

    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        show: false,
        permanentShow: false,
      });
    }

    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i
      }
    }


    SetGridItems(tmpGrid);
    setPlaying(true);

  };

  const handleItemClick = (index: number) => {
    if (playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems];
      if (tmpGrid[index].permanentShow === false && tmpGrid[index].show === false) {
        tmpGrid[index].show = true;
        SetShowCount(showCount + 1)
      }

      SetGridItems(tmpGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href=''>
          <img src={logoImage} width='200' alt="" />
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App