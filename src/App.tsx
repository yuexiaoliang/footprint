import { useState, useRef, FC, MutableRefObject, Ref } from 'react';
import { ConfigProvider, theme } from 'antd';
import Map from '@/components/map/Map';
import Info from '@/components/info/Info';

const App: FC = () => {
  const [infoData, setInfoData] = useState({});
  const infoCom = useRef(null);

  const onMapPointClick = (point: any) => {
    setInfoData(point || {});

    // @ts-ignore
    infoCom.current.setVisible(true);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <Map onPointClick={onMapPointClick}></Map>
      <Info ref={infoCom} data={infoData}></Info>
    </ConfigProvider>
  );
};

export default App;
